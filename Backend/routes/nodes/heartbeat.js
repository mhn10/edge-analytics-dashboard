const express = require("express");
const router = express.Router();
const healthCheck = require('express-healthcheck');

router.get('/', (req,res, next) => {
	console.log("Inside heartbeat API");
	return  res.status(200).json( {
		message: "Node is running",
		});
});

module.exports = router;