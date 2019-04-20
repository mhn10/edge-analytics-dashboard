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
	// console.log("test upload data", req);

	// //parse the files from the request
	// const codeFile = req.body.addState.code;
	// const dataFile = req.body.addState.data;
	// const inputFile = req.body.addState.input;
	// const modelFile = req.body.addState.model;
	// const requirementFile = req.body.addState.requirement;

	// //Add the files in the array
	// var fileArray = [requirementFile,inputFile,dataFile, modelFile];

	// var filesMap = {};
	// filesMap["Code"].push(codeFile);
	// filesMap["Data"].push(dataFile);
	// filesMap["Input"].push(inputFile);
	// filesMap["Requirement"].push(requirementFile);

	// var keyNames = ["Code", "Data", "Input", "Requirement", "Model"];

	// if(type === 'classification'){
	// 	filesMap["Model"].push(modelFile);
	// }
	const form = new multiparty.Form();
	form.parse(req, async(error, fields, files) => {
		if (error) throw new Error(error);
		try {
			console.log( "fields: ", fields );
			console.log( "files: ", files );

			// Parse the username
			// const username = fields.username[0];
			const username = "raghav";
			console.log("username", username);

			//parse the type of action and taskname to be performed
			const actionType = fields.type[0];
			const taskName = fields.taskname[0];
			const fileName = files.requirement[0].originalFilename;

			const path = files.requirement[0].path;
			const buffer = fs.readFileSync(path);
			console.log("Buffer: ", buffer);
			const type = fileType(buffer);
			console.log("type: ", type);
			const filePath = `${username}/${actionType}/${taskName}/${fileName}`;
			console.log("fileName", filePath);
			// const fileName = `Data/001/${timestamp}-lg`;
			// for(let [key, value] of filesMap){
			// 	var temp = fileName + `${key}/${value[0]}`;
			const data = await uploadFile(buffer, filePath);
			// }
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
		// ACL: "public-read",
		Body: buffer,
		Bucket: process.env.S3_BUCKET,
		Key: `${name}`
	};
	console.log("params: ", params);
	return s3.upload(params).promise();
};

module.exports = router;