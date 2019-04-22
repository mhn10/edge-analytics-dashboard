const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

router.post("/", (req, res) => {
	console.log("Inside run task API");
	//parse the details from the request object
	var username = req.body.userName;
	var nodeid = req.body.nodeid;
	var taskname = req.body.name;
	var actiontype = req.body.type;
	var isCamera = req.body.isCamera;

	var data = {
		userName : username,
		taskName : taskname,
		nodeId : nodeid,
		actionType : actiontype,
		isCamera : isCamera
	}
	var dataTobeSent = JSON.stringify(data);
	// create parameters
	var params = {
		MessageBody: dataTobeSent,
		QueueUrl: `${process.env.QUEUE_URL}taskQ1` // URL of our queue
	};

	sqs.sendMessage(params, function (err, data) {
		if (err) {
			console.log("Error", err);
			return res.sendStatus(400).end(err);
		} else {
			console.log("Success", data.MessageId);
			return res.sendStatus(200).end(data.MessageId);
		}
	});
});

module.exports = router;