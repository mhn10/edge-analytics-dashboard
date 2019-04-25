const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
// const { getNodeDetail } = require('../../Mqtt/mqtt_sub');
const axios = require('axios');

router.get('/', async (req, res, next) => {
	console.log("Inside Node Detail API");
	var nodeId = req.body.nodeid;
	// create parameters
	var data = {
		nodeId: nodeId,
		action: "Info"
	}
	var dataTobeSent = JSON.stringify(data);
	var params = {
		MessageBody: dataTobeSent, // Its the name given by user for their upload
		QueueUrl: `${process.env.QUEUE_URL}NodeCommunication` // URL of our queue
	};
	await sqs.sendMessage(params, async (err, data) => {
		if (err) {
			console.log("Error", err);
			return res.status(400).send(err);
		} else {
			try {
				let result = await axios.get(`${process.env.PYTHON_BACKEND}node`);
				let data = await result.data;
				return res.status(200).send(data);
			}
			catch (e) {
				console.log(e);
			}
		}
	});
});

module.exports = router;