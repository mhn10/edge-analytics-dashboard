// const mqtt = require('mqtt');
// // require("../dotenv").config();
// // var broker = 'mqtt://iot.eclipse.org:1883'
// var broker = 'mqtt://54.67.84.242:1883'
// // const client = mqtt.connect(process.env.MQTT_BROKER);
// const client = mqtt.connect(broker);
// // const {client} = require('../index');
// var allNodes = [];
// var nodeDetail ={};

// // console.log( 'Connected to broker at: %s', process.env.MQTT_BROKER )
// console.log( 'Connected to broker at: %s', broker );

// var topics = ['NodeInfo', 'ActiveNodes', 'TaskResults'];

// client.on('connect', () => {
// 	for( var i = 0; i < topics.length; i++ )
// 	{
// 		client.subscribe( topics[i] )
// 		console.log( 'Subscribed to: %s', topics[i] );
// 	}
// })

// client.on('message', async (topic, message) => {
// 	switch( topic ) {
// 		case 'NodeInfo':
// 			return await handleNodeInfo( message )
// 		case 'ActiveNodes':
// 		console.log("Message received for Active Nodes");
// 			return await handleActiveNodes( message )
// 		case 'TaskResults':
// 			return await handleResults( message )
// 	}
// 	console.log( 'No handler for this topic %s', topic )
// })

// function handleNodeInfo( message ) {
// 	console.log( 'Message received:', message);
// 	nodeDetail = strMapToObj(message);
// }

// function handleActiveNodes( message ) {
// 	console.log("Message",message);
// 	// allNodes = [];
// 	js = JSON.parse( message );
// 	for ( i in js['Active'] ) {
// 		// console.log(allNodes);
// 		// console.log( js['Active'][i] );
// 		var NodeInfoMap = new Map();
// 		for ( key in js['Active'][i] ) {
// 			// console.log(key);
// 			NodeInfoMap.set( key, js['Active'][i][key] );
// 		}
// 		console.log("i: ", NodeInfoMap);
// 		var obj = strMapToObj(NodeInfoMap);
// 		allNodes.push( obj );
// 		// return allNodes;
// 		// console.log("allNode: ", allNodes);
// 	}
// 	// console.log( 'Message received for Active Node %s', message );
// }

// function handleResults( message ) {
// 	console.log("Inside handle Result, message received", message);
// }

// function  getNodesInfo() {
// 	console.log("Inside getNodesInfo");
// 	while(allNodes.length === 0){
// 		continue;
// 	}
// 	return allNodes;
// }

// function getNodeDetail() {
// 	console.log("Inside getNodeDetail");
// 	console.log("NodeDetail", nodeDetail);
// 	return nodeDetail;
// }
// module.exports = {getNodesInfo, getNodeDetail};

// function strMapToObj(temp) {
// 	let obj = Object.create(null);
// 	for (let [k,v] of temp) {
// 		obj[k] = v;
// 	}
// 	return obj;
// }
