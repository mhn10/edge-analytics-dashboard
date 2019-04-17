const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
	console.log("Inside get result API");
	console.log("output data", process.env.S3_BUCKET);
	s3.listObjects({ Bucket: process.env.S3_BUCKET, Prefix: 'Results/' }, function (err, data) {
		if (err) {
			console.log(err);
			res.status(400).json({ success: false });
		} else {
			console.log("success", data);
			let keys = data.Contents.map(eachKey => eachKey.Key);
			console.log("Keys array map", keys);
			res.status(200);
			res.send({ data: keys });
			// "https://jetsons3test.s3.amazonaws.com"+data.key
		}
	});
});

module.exports = router;