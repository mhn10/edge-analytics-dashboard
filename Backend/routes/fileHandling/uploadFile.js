const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileType = require("file-type");
const multiparty = require("multiparty");
const AWS = require("aws-sdk");
const bluebird = require("bluebird");
AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3();

router.post('/', (req, res) => {
	const form = new multiparty.Form();
	form.parse(req, async(error, fields, files) => {
		if (error) throw new Error(error);
		try {
			// Parse the username
			// const username = fields.username[0];
			const username = "raghav";
			console.log("username", username);

			//parse the type of action and taskname 
			const actionType = fields.type[0];
			const taskName = fields.taskname[0];

			// //parse the files from the request
			const codeFilePath = files.code[0];
			const dataFilePath = files.data[0];
			const inputFilePath = files.input[0];
			const modelFilePath= files.model[0];
			const requirementFilePath = files.requirement[0];

			//Create a Map and store the values
			var filesArrPath = [];
			filesArrPath.push(codeFilePath);
			filesArrPath.push(dataFilePath);
			filesArrPath.push(inputFilePath);
			filesArrPath.push(requirementFilePath);

			//Push the extra model file if the actionType is classification
			if(actionType === 'classification'){
				filesArrPath.push(modelFilePath);
			}
			
			for (let value of filesArrPath) {
				// const path = files.requirement[0].path;
				var path = value.path;
				var buffer = await fs.readFileSync(path);
				var type = fileType(buffer);
				var fileName = value.originalFilename;
				var filePath = `${username}/${actionType}/${taskName}/${fileName}`;
				var data = await uploadFile(buffer, filePath);
			};
			return res.status(200).send(data);
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
		Bucket: process.env.S3_BUCKET,
		Key: `${name}`
	};
	console.log("params: ", params);
	return s3.upload(params).promise();
};

module.exports = router;