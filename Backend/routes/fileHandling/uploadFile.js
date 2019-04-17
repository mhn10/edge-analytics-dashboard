const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileType = require("file-type");
const multiparty = require("multiparty");


router.post("/", (request, response) => {
	console.log("test upload data", request);
	const form = new multiparty.Form();
	form.parse(request, async (error, fields, files) => {
		if (error) throw new Error(error);
		try {
			const path = files.file[0].path;
			const buffer = fs.readFileSync(path);
			const type = fileType(buffer);
			const timestamp = Date.now().toString();
			const fileName = `Data/001/${timestamp}-lg`;
			const data = await uploadFile(buffer, fileName, type);
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