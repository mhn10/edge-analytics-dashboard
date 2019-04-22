const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

router.post("/", (req, res) => {
	console.log("Inside run task API");

	//parse the details from the request object
	var username = req.body.userName;
	var model = req.body.model;
	var taskName = req.body.name;

	// create parameters
	var params = {
		DelaySeconds: 10,
		MessageAttributes: {
			User: {
				// First attribute name is username / UID
				DataType: "String",
				StringValue: username // Value is username or id
			},
			Type: {
				// Second attribute name is Type ( indicates if its classification or regression )
				DataType: "String",
				StringValue: model // Value is classification or regression
			}
		},
		MessageBody: taskName, // Its the name given by user for their upload
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