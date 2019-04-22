const express = require('express');
const router = express.Router();
const fs = require('fs');
const multiparty = require("multiparty");
const AWS = require("aws-sdk");
const bluebird = require("bluebird");
AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3();
const userModel = require('../../Model/User');
const utility = require('../../utility');

router.post('/', (req, res) => {
	const form = new multiparty.Form();
	form.parse(req, (error, fields, files) => {
		if (error) throw new Error(error);
		try {
			//parse the username, type of action and taskname 
			const username = fields.username[0];
			const userFirstName = utility.extractNameFromEmail(username);
			const actionType = fields.type[0];
			console.log(typeof(actionType));
			const taskName = fields.taskname[0];

			//if taskName exists already then it's a update request
			// var temp = (actionType === 'classification')? classification : regression;
			userModel.findOne({actionType : {$elemMatch:{name: taskName}}}, function (err, task) {
				if (task) {
					//Same task cannot be added
					console.log(`Taskname : ${taskName} already exists, edit the existing task`);
					var err = {message: `Taskname : ${taskName} already exists, edit the existing task`}
					return res.status(409).send(err);
				} else if (err) {
					console.log(`Error : ${err}`);
					var err = {message: `${err}`}
					return res.status(400).send(err);
				} else {
					//This is a new task, and needs to be uploaded in S3 as well as mongoDB
					console.log(`Creating the new task :${taskName}`);
					//parse the files from the request
					const codeFilePath = files.code[0];
					const dataFilePath = files.data[0];
					const inputFilePath = files.input[0];
					const requirementFilePath = files.requirement[0];

					//Create a Map and store the values
					var filesMap = new Map();
					filesMap.set("Code", codeFilePath);
					filesMap.set("Data", dataFilePath);
					filesMap.set("Input", inputFilePath);
					filesMap.set("Requirement", requirementFilePath);

					//Push the extra model file if the actionType is classification
					if (actionType === 'classification') {
						const modelFilePath = files.model[0];
						filesMap.set("Model", modelFilePath);
					}
					var fileNamesMap = new Map();
					//Loop through each file object and upload in S3 bucket
					for (let [key, value] of filesMap) {
						var path = value.path;
						var buffer = fs.readFileSync(path);
						var fileName = value.originalFilename;
						var filePath = `${userFirstName}/${actionType}/${taskName}/${key}/${fileName}`;
						var data = uploadFile(buffer, filePath);
						fileNamesMap.set(key, fileName);
					};
					uploadFilesInSchema(fileNamesMap, username, actionType, taskName);
					return res.status(200).send(data);
				}
			});
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	});
});

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name) => {
	console.log("Uploading file to s3");
	const params = {
		ACL: "public-read",
		Body: buffer,
		Bucket: process.env.S3_BUCKET_BAK,
		Key: `${name}`
	};
	console.log("params: ", params);
	return s3.upload(params).promise();
};

//Upload the files in the User Model
const uploadFilesInSchema = (fileNamesMap, username, actionType, taskName) => {
	console.log("Inside Uploading FilesInSchema");
	var obj = {}
	obj.name = taskName;
	obj.timeStamp = Date.now();
	for (let [key, val] of fileNamesMap) {
		obj[key.toLowerCase()] = val;
	}
	console.log("Obj: ", obj);
	if (actionType === "classification") {
		userModel.findOneAndUpdate({ email: username },
			{ $push: { classification: obj } },
			function (error, success) {
				if (error) {
					console.log(error);
				} else {
					console.log(success);
				}
			});
	} else {
		userModel.findOneAndUpdate({ email: username },
			{ $push: { regression: obj } },
			function (error, success) {
				if (error) {
					console.log(error);
				} else {
					console.log(success);
				}
			});
	}
}

module.exports = router;