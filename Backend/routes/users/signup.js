const express = require('express');
const router = express.Router();
const userModel = require('../../Model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Route to handle Post Request Call for SignUp
router.post('/',function(req,res){
    console.log("Inside Signup Request Handler");
    //Insert the record in User Table
        console.log("Inside Traveler Signup request");
        var newTraveler = new travelerModel();
        travelerModel.findOne({email: req.body.email}, function(err,traveler){
            console.log("Checking if the email already exists");
            if(traveler) {
                console.log("user already exists");
                res.send(400);
            } else {
                console.log("email not found, creating new user");
                // newTraveler = {
                    bcrypt.hash(req.body.password,10,(err,hash)=>{
                        if(err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            newTraveler._id = new mongoose.Types.ObjectId(),
                            newTraveler.firstname = req.body.firstName;
                            newTraveler.lastname = req.body.lastName;
                            newTraveler.email = req.body.email;
                            newTraveler.password = hash;
                            newTraveler.phonenumber =req.body.phonenumber||"";
                            newTraveler.profileimage =req.body.profileimage||"preview.jpg";
                            newTraveler.aboutme = req.body.aboutme||"";
                            newTraveler.city =req.body.city||"";
                            newTraveler.country =req.body.country||"";
                            newTraveler.company =req.body.company||"";
                            newTraveler.school =req.body.school||"";
                            newTraveler.hometown =req.body.hometown||"";
                            newTraveler.languages =req.body.languages||"";
                            newTraveler.gender =req.body.gender||"";
                            newTraveler.memberSince= req.body.memberSince||Date.now();
                            newTraveler.isTraveler = req.body.isTraveler||true;
                            newTraveler.save()
                            .then(traveler=>{
                                console.log("Traveler record created: ", traveler);
                                res.sendStatus(200).end();
                            })
                            .catch(err => {
                                console.log(err);
                                res.sendStatus(400).end();
                            });
                        }
                // };
            })
        }
    })
});
module.exports = router;