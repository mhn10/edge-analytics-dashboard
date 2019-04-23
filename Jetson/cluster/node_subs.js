const mqtt = require('mqtt')

var broker = 'mqtt://iot.eclipse.org:1883'
const client = mqtt.connect( broker )

console.log( 'Connected to broker at: %s', broker )

var server = ''

var topics = ['NodeInfo', 'ActiveNodes', 'TestResults'];

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
		case 'TestResults':
			return handleResults( message )
	}
	console.log( 'No handler for this topic %s', topic )
})

function handleNodeInfo( message ) {
	console.log( 'NODE INFO' );
	js = JSON.parse( message )
	for ( key in js ) {
		console.log( '%s: %s', key, js[key] );
	}
}

function handleActiveNodes( message ) {
	console.log( 'ACTIVE NODES' )
	js = JSON.parse( message )
	for ( i in js['Active'] ) {
		for ( key in js['Active'][i] ) {
			console.log( '%s: %s', key, js['Active'][i][key] );
		}
	}
}

function handleResults( message ) {
	console.log( 'Message received for Resutls %s', message );
}