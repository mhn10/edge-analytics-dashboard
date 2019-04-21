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
	console.log( 'Message received:' );
	js = JSON.parse( message )
	for ( key in js ) {
		console.log( '%s: %s', key, js[key] );
	}
}

function handleActiveNodes( message ) {
	console.log( 'Message received for Active Node %s', message );
}

function handleResults( message ) {
	console.log( 'Message received for Resutls %s', message );
}