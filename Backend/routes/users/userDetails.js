const express = require('express');
const router = express.Router();
const userModel = require('../../Model/User');

router.get('/', (req, res) => {
	console.log("Inside get all fileNames for logged in User and corresponding task");
	var username = req.query.username;
	userModel.find({email : username},(err, user) => {
		if(err) {
			var err = {
				message : `err`
			}
			return res.status(404).send(err);
		} else {
			return res.status(200).send(user);
		}
	})
});
module.exports = router;
