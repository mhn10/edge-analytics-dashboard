const express = require('express');
const router = express.Router();
const userModel = require('../../Model/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

//Route to handle Post Request Call for SignUp
router.post('/', function (req, res) {
	console.log("Inside Signup Request Handler");
	var EMAIL = req.body.signUpEmail;
	var PASSWORD = req.body.signUpPassword;
	//Insert the record in User Table
	console.log("Inside User Signup request");
	var newUser = new userModel();
	userModel.findOne({ email: EMAIL }, function (err, user) {
		console.log("Checking if the email already exists");
		if (user) {
			console.log("user already exists");
			res.sendStatus(409);
		} else {
			console.log("email not found, creating new user");
			bcrypt.hash(PASSWORD, 10, (err, hash) => {
				if (err) {
					return res.status(500).json({
						error: err
					});
				} else {
					newUser._id = new mongoose.Types.ObjectId();
					newUser.firstName = req.body.firstName;
					newUser.lastName = req.body.lastName;
					newUser.email = EMAIL;
					newUser.password = hash;
					newUser.memberSince = req.body.memberSince || Date.now();
					newUser.save()
					.then(user => {
						console.log("User record created: ", user);
						res.sendStatus(201).end();
					})
					.catch(err => {
						console.log(err);
						res.sendStatus(400).end();
					});
				}
			})
		}
	})
});

module.exports = router;