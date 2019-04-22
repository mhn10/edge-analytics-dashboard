const mqtt = require('mqtt');
// require("../dotenv").config();
var broker = 'mqtt://iot.eclipse.org:1883'
// const client = mqtt.connect(process.env.MQTT_BROKER);
const client = mqtt.connect(broker);
// const {client} = require('../index');
var NodeInfoMap = new Map();
var allNodes = [];
var NodeDetails = new Map();

// console.log( 'Connected to broker at: %s', process.env.MQTT_BROKER )
console.log( 'Connected to broker at: %s', broker );

var topics = ['NodeInfo', 'ActiveNodes', 'TaskResults'];

client.on('connect', () => {
	for( var i = 0; i < topics.length; i++ )
	{
		client.subscribe( topics[i] )
		console.log( 'Subscribed to: %s', topics[i] );
	}
})

client.on('message', (topic, message) => {
	switch( topic ) {
		case 'NodeInfo':
			return handleNodeInfo( message )
		case 'ActiveNodes':
			return handleActiveNodes( message )
		case 'TaskResults':
			return handleResults( message )
	}
	console.log( 'No handler for this topic %s', topic )
})

function handleNodeInfo( message ) {
	NodeDetails.clear();
	console.log( 'Message received:' );
	js = JSON.parse( message )
	for ( key in js ) {
		NodeDetails.set( key, js[key] );
		// console.log( '%s: %s', key, js[key] );
	}
}

function handleActiveNodes( message ) {
	// console.log("lund",message);
	allNodes = [];
	js = JSON.parse( message );
	for ( i in js['Active'] ) {
		// console.log(allNodes);
		// console.log( js['Active'][i] );
		var NodeInfoMap = new Map();
		for ( key in js['Active'][i] ) {
			// console.log(key);
			NodeInfoMap.set( key, js['Active'][i][key] );
		}
		// console.log("i: ", NodeInfoMap);
		var obj = strMapToObj(NodeInfoMap);
		allNodes.push( obj );
		// console.log("allNode: ", allNodes);
	}
	// console.log( 'Message received for Active Node %s', message );
}

function handleResults( message ) {
	// console.log( 'Message received for Resutls %s', message );
}

function getNodeInfo() {
	console.log("Inside getNodeInfo");
	console.log("NodeInfoMap", allNodes);
	return allNodes;
}

function strMapToObj(temp) {
	let obj = Object.create(null);
	for (let [k,v] of temp) {
		obj[k] = v;
	}
	return obj;
}

module.exports = {getNodeInfo};