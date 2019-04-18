const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileType = require("file-type");
const multiparty = require("multiparty");


router.post("/", (req, res) => {
	console.log("test upload data", request);
	//Parse the username
	const username = req.body.addState.username;

	//parse the type of action and taskname to be performed
	const type = req.body.addState.type;
	const taskName = req.body.addState.name;

	//parse the files from the request
	const codeFile = req.body.addState.code;
	const dataFile = req.body.addState.data;
	const inputFile = req.body.addState.input;
	const modelFile = req.body.addState.model;
	const requirementFile = req.body.addState.requirement;

	//Add the files in the array
	var fileArray = [requirementFile,inputFile,dataFile, modelFile];

	var filesMap = {};
	filesMap["Code"].push(codeFile);
	filesMap["Data"].push(dataFile);
	filesMap["Input"].push(inputFile);
	filesMap["Requirement"].push(requirementFile);

	var keyNames = ["Code", "Data", "Input", "Requirement", "Model"];

	if(type === 'classification'){
		filesMap["Model"].push(modelFile);
	}
	const form = new multiparty.Form();
	form.parse(request, async (error, fields, files) => {
		if (error) throw new Error(error);
		try {
			console.log( "fields: ", fields );
			console.log( "files: ", files );
			const path = files.file[0].path;
			const buffer = fs.readFileSync(path);
			const type = fileType(buffer);
			const fileName = `${username}/${type}/${taskName}/`;
			// const fileName = `Data/001/${timestamp}-lg`;
			for(let [key, value] of filesMap){
				var temp = fileName + `${key}/${value[0]}`;
				var data = await uploadFile(buffer, temp, type);
			}
			return response.status(200).send(data);
		} catch (error) {
			return response.status(400).send(error);
		}
	});
});

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
	console.log("Uploading file to s3");
	const params = {
		ACL: "public-read",
		Body: buffer,
		Bucket: process.env.S3_BUCKET,
		Key: `${name}.${type.ext}`
	};
	console.log("params: ", params);
	return s3.upload(params).promise();
};

module.exports = router;