const express = require('express');
const router = express.Router();
const fs = require('fs');
const multiparty = require("multiparty");
const AWS = require("aws-sdk");
const bluebird = require("bluebird");
AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3();
const userModel = require('../../Model/User');

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
			var filesMap = new Map();
			filesMap.set("Code",codeFilePath);
			filesMap.set("Data",dataFilePath);
			filesMap.set("Input",inputFilePath);
			filesMap.set("Requirement",requirementFilePath);

			//Push the extra model file if the actionType is classification
			if(actionType === 'classification'){
				// filesArrPath.push(modelFilePath);
				filesMap.set("Model",filesMap);
			}
			
			var fileNames = [];
			//Loop through each file object and upload in S3 bucket
			for (let [key, value] of filesMap) {
				var path = value.path;
				var buffer = await fs.readFileSync(path);
				var fileName = value.originalFilename;
				var filePath = `${username}/${actionType}/${taskName}/${key}/${fileName}`;
				var data = await uploadFile(buffer, filePath);
				fileNames.push(fileName);
			};
			// await uploadFilesInSchema(this.fileNames, username, actionType, taskName);
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

//Upload the files in the User Model
const uploadFilesInSchema = (fileNames, username, actionType, taskName) => {
	console.log("Inside Uploading FilesInSchema");
	//check if task exists
    userModel.find({
        $and:[
			{email: username},
			{},
            {propavaildate : {$lte: startDate}},
            {propavailtill : {$gte: endDate}},
            {isBooked : false}
        ], function(err, task){
			console.log("Task already exists, updating the files");
			if(task.length > 1){
				console.log(`Updating the task : ${actionType} for user : ${username}`);
				// remove old files and update the corresponding files under it with new files and update the time stamp as well
			} else {
				console.log(`Adding the new task : ${taskName} for user : ${username}`);
				
			}
		}
    })
	
}

module.exports = router;