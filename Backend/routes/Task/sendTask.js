const express = require('express');
const router = express.Router();
const AWS = require("aws-sdk");
// create S3 instance
const s3 = new AWS.S3();
// Create an SQS service object
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const { CONSTANTS } = require('../../Constants');

router.post("/", (req, res) => {
	console.log("Inside send task API");

	//parse the details from the request object
	var USER = req.body.userName;
	var MODEL = req.body.model;
	var TASKNAME = req.body.taskName;

	// create parameters
	var params = {
		DelaySeconds: 10,
		MessageAttributes: {
			User: {
				// First attribute name is username / UID
				DataType: "String",
				StringValue: USER // Value is username or id
			},
			Type: {
				// Second attribute name is Type ( indicates if its classification or regression )
				DataType: "String",
				StringValue: MODEL // Value is classification or regression
			}
		},
		MessageBody: TASKNAME, // Its the name given by user for their upload
		QueueUrl: `${CONSTANTS.QUEUE_URL}+taskQ1` // URL of our queue
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