package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/hashicorp/memberlist"
	"github.com/pborman/uuid"
)

var (
	mtx            sync.RWMutex
	members        = flag.String("members", "", "comma seperated list of members")
	port           = flag.Int("port", 4001, "http port")
	bindPort       = flag.Int("bindPort", 8000, "binding port")
	memberObj      *memberlist.Memberlist
	clusterMembers = map[string]string{}
)

// Member store list of all alive members
type Member struct {
	Name string
	IP   net.IP
	Port uint16
}

// HealthScore store list of all alive members
type HealthScore struct {
	Name  string
	Score int
}

// type update struct {
// 	Action string // add, del
// 	Data   map[string]string
// }

func init() {
	flag.Parse()
}

func getMembersHandler(w http.ResponseWriter, r *http.Request) {
	allMembers := memberObj.Members()

	w.Header().Set("Content-Type", "application/json")
	for _, node := range allMembers {
		member := Member{
			Name: node.Name,
			IP:   node.Addr,
			Port: node.Port,
		}

		js, err := json.Marshal(member)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(js)
	}
}

func startNodeHandler(w http.ResponseWriter, r *http.Request) {
	memberObj.UpdateNode(10)
	w.Write([]byte("Node started"))
}

func stopNodeHandler(w http.ResponseWriter, r *http.Request) {
	memberObj.Shutdown()
	w.Write([]byte("Node shutdown"))
}

func getStatusHandler(w http.ResponseWriter, r *http.Request) {
	result := HealthScore{Name: "Health Score", Score: memberObj.GetHealthScore()}

	w.Header().Set("Content-Type", "application/json")
	js, err := json.Marshal(result)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(result)
	w.Write(js)
}

func getNodeInfoHandler(w http.ResponseWriter, r *http.Request) {
	node := Member{
		Name: memberObj.LocalNode().Name,
		IP:   memberObj.LocalNode().Addr,
		Port: memberObj.LocalNode().Port,
	}

	js, err := json.Marshal(node)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(js)
}

func start() (*memberlist.Memberlist, error) {
	// Get hostname
	hostname, p := os.Hostname()
	fmt.Println(p)

	// Configure member list
	c := memberlist.DefaultLocalConfig()
	fmt.Println(*bindPort)
	c.BindPort = *bindPort
	c.Name = hostname + "-" + uuid.NewUUID().String()
	list, err := memberlist.Create(c)

	// Check type of variable
	// fmt.Print(reflect.TypeOf(m))

	if err != nil {
		return list, err
	}

	// If there are more members, join them to form a cluster
	if len(*members) > 0 {
		parts := strings.Split(*members, ",")
		_, err := list.Join(parts)
		if err != nil {
			return list, err
		}
	}

	node := list.LocalNode()

	fmt.Printf("Local member %s:%d\n", node.Addr, node.Port)

	return list, nil
}

func main() {

	if m, err := start(); err != nil {
		fmt.Println(err)
	} else {
		memberObj = m
	}

	// Get node info
	http.HandleFunc("/info", getNodeInfoHandler)

	// Get member list
	http.HandleFunc("/members", getMembersHandler)

	// Stop node
	http.HandleFunc("/stop", stopNodeHandler)
	http.HandleFunc("/start", startNodeHandler)

	// Status
	http.HandleFunc("/status", getStatusHandler)

	fmt.Printf("Listening on :%d\n", *port)

	if err := http.ListenAndServe(fmt.Sprintf(":%d", *port), nil); err != nil {
		fmt.Println(err)
	}
}
