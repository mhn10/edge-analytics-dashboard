const express = require('express');
const router = express.Router();
const userModel = require('../../Model/User');

router.get('/', (req, res) => {
	console.log("Inside get all fileNames for logged in User, action type and task name");
	var username = req.query.username;
	var actionType = req.query.type;
	var taskName = req.query.name;
	userModel.find({email : username},(err, user) => {
		if(err) {
			var err = {
				message : `err`
			}
			return res.status(404).send(err);
		} else {
			var filesMap = new Map();
			if(actionType === "Classification") {
				user[0].classification.forEach(item =>{
					if(item.name === taskName){
						filesMap.set("requirements", item.requirement);
						filesMap.set("code", item.code);
						filesMap.set("model", item.model);
						filesMap.set("data", item.data);
						filesMap.set("input", item.input);
					}
				});
			} else {
				user[0].regression.forEach(item =>{
					if(item.name === taskName){
						filesMap.set("requirements", item.requirement);
						filesMap.set("code", item.code);
						filesMap.set("data", item.data);
						filesMap.set("input", item.input);
					}
				});
			}
			var result = strMapToObj(filesMap);
			return res.status(200).send(result);
		}
	})
});

function strMapToObj(temp) {
	let obj = Object.create(null);
	for (let [k,v] of temp) {
		obj[k] = v;
	}
	return obj;
}
module.exports = router;
