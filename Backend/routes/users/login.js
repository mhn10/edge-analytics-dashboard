const express = require('express');
const router = express.Router();
const userModel = require('../../Model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_KEY = "secret";

//Route to handle Post Request Call for Login
router.post('/', (req,res, next) => {
    console.log("Inside Login Post Request");
    var EMAIL = req.body.loginEmail;
    var PASSWORD = req.body.loginPassword;
    console.log("Email and Password:  : ",EMAIL, PASSWORD);
        //QUERY user_INFO Collection to get the email and password
        userModel.findOne({email: EMAIL})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(PASSWORD, user.password, (err,result)=>{
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed' 
                    });
                }
                if(result) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id,
                            firstName: user.firstName,
                            lastName:user.lastName,
                            memberSince: user.memberSince,
                        },
                        JWT_KEY,
                        {
                            expiresIn : "1h"
                        }
					);
					console.log("token", token);
					// res.status = 200;
					// res.token = token;
					// res.message = "Success";
					// return res;
                   return  res.status(200).json( {
                        message: "Auth Successful",
                        token : token
                        });
                }
                return res.status(401).json({
                    message: 'Auth failed' 
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
	})
});

module.exports = router;