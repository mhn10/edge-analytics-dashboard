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
)

var (
	mtx            sync.RWMutex
	name           = flag.String("name", "", "name given to node")
	members        = flag.String("members", "", "comma seperated list of members")
	ip             = flag.String("ip", "", "public IP on which node is connected")
	port           = flag.Int("port", 4001, "http port")
	bindPort       = flag.Int("bindPort", 7946, "binding port")
	memberObj      *memberlist.Memberlist
	items          = map[string]string{}
	broadcasts     *memberlist.TransmitLimitedQueue
	clusterMembers = map[string]string{}
)

// Member store list of all alive members
type Member struct {
	Name string
	IP   net.IP
	Port uint16
}

type ActiveMembers struct {
	Active []Member
}

// HealthScore store list of all alive members
type HealthScore struct {
	Name  string
	Score int
}

type broadcast struct {
	msg    []byte
	notify chan<- struct{}
}

type delegate struct{}

type update struct {
	Action string // add, del
	Data   map[string]string
}

func init() {
	flag.Parse()
}

func (b *broadcast) Invalidates(other memberlist.Broadcast) bool {
	return false
}

func (b *broadcast) Message() []byte {
	return b.msg
}

func (b *broadcast) Finished() {
	if b.notify != nil {
		close(b.notify)
	}
}

func (d *delegate) NodeMeta(limit int) []byte {
	return []byte{}
}

func (d *delegate) NotifyMsg(b []byte) {
	if len(b) == 0 {
		return
	}

	switch b[0] {
	case 'd': // data
		var updates []*update
		if err := json.Unmarshal(b[1:], &updates); err != nil {
			return
		}
		mtx.Lock()
		for _, u := range updates {
			for k, v := range u.Data {
				switch u.Action {
				case "add":
					items[k] = v
				case "del":
					delete(items, k)
				}
			}
		}
		mtx.Unlock()
	}
}

func (d *delegate) GetBroadcasts(overhead, limit int) [][]byte {
	return broadcasts.GetBroadcasts(overhead, limit)
}

func (d *delegate) LocalState(join bool) []byte {
	mtx.RLock()
	m := items
	mtx.RUnlock()
	b, _ := json.Marshal(m)
	return b
}

func (d *delegate) MergeRemoteState(buf []byte, join bool) {
	if len(buf) == 0 {
		return
	}
	if !join {
		return
	}
	var m map[string]string
	if err := json.Unmarshal(buf, &m); err != nil {
		return
	}
	mtx.Lock()
	for k, v := range m {
		items[k] = v
	}
	mtx.Unlock()
}

// Post call for node
func addHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("add handler")
	r.ParseForm()
	var key string
	var val string

	key = r.FormValue("key")
	val = r.FormValue("val")

	fmt.Printf("%s: %s", key, val)

	mtx.Lock()
	items[key] = val
	mtx.Unlock()

	b, err := json.Marshal([]*update{
		&update{
			Action: "add",
			Data: map[string]string{
				key: val,
			},
		},
	})

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	broadcasts.QueueBroadcast(&broadcast{
		msg:    append([]byte("d"), b...),
		notify: nil,
	})

	fmt.Fprintln(w, "Done")
}

func getHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("called")
	r.ParseForm()
	key := r.Form.Get("key")
	mtx.RLock()
	val := items[key]
	mtx.RUnlock()
	// json.NewEncoder(w).Encode(items)
	w.Write([]byte(val))
}

// Returns list of all active members in cluster
func getMembersHandler(w http.ResponseWriter, r *http.Request) {
	allMembers := memberObj.Members()

	w.Header().Set("Content-Type", "application/json")
	mem := ActiveMembers{}
	for _, node := range allMembers {
		mem.Active = append(mem.Active, Member{
			Name: node.Name,
			IP:   node.Addr,
			Port: node.Port,
		})
	}

	js, err := json.Marshal(mem)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
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
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func start() (*memberlist.Memberlist, error) {
	if *ip == "" {
		fmt.Println("IP address not provided")
		os.Exit(1)
	}

	if *name == "" {
		fmt.Println("No name is given to node")
		os.Exit(1)
	}

	// Configure member list
	c := memberlist.DefaultLocalConfig()
	c.BindPort = *bindPort
	// fmt.Println(*bindPort)
	// fmt.Println(c.BindPort)
	// c.BindPort = 0

	c.AdvertiseAddr = *ip
	key := make([]byte, 24)
	// Encryption key
	copy(key, "clustersecret")
	c.SecretKey = key
	c.Name = *name
	list, err := memberlist.Create(c)

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

	// Handle addition of node
	http.HandleFunc("/add", addHandler)
	http.HandleFunc("/get", getHandler)

	// Get node info
	http.HandleFunc("/info", getNodeInfoHandler)

	// Get member list
	http.HandleFunc("/members", getMembersHandler)

	fmt.Printf("Listening on :%d\n", *port)

	if err := http.ListenAndServe(fmt.Sprintf(":%d", *port), nil); err != nil {
		fmt.Println(err)
	}
}
