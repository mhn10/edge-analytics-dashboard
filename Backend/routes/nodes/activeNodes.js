const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const Node = require('../../Mqtt/mqtt_sub');

router.get('/', (req, res, next) => {
	console.log("Inside active Nodes API");
	// create parameters
	var data = {
		action : "Active"
	}
	var dataTobeSent = JSON.stringify(data);
	var params = {
		MessageBody: dataTobeSent, // Its the name given by user for their upload
		QueueUrl: `${process.env.QUEUE_URL}NodeCommunication` // URL of our queue
	};
	sqs.sendMessage(params, (err, data) => {
		if (err) {
			console.log("Error", err);
			return res.status(400).send(err);
		} else {
			// console.log("Success", data.MessageId);
			var result = Node.getNodesInfo();
			return res.status(200).send(result);
		}
	});
});

module.exports = router;