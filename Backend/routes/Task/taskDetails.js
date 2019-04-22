const express = require('express');
const router = express.Router();
const userModel = require('../../Model/User');

router.get('/', (req, res) => {
	console.log("Inside get all taskNames for logged in User and action type selected");
	var username = req.query.username;
	var actionType = req.query.type;
	userModel.find({email : username}, (err, user) =>{
		if(err){
			var err = {
				message : `err`
			}
			return res.status(404).send(err);
		} else {
			var tasks = [];
			if(actionType === "classification") {
				user[0].classification.forEach(item =>{
					var task = item.name;
					tasks.push(task); 
				});
			} else {
				user[0].regression.forEach(item =>{
					var task = item.name;
					tasks.push(task);
				});
			}
			return res.status(200).send(tasks);
		}
	})
});
module.exports = router;
