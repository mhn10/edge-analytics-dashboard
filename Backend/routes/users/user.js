const express = require("express");
const router = express.Router();


const Users = require("../../Model/User");

/*
********************************************************************************************************
handle cases for double url paramters like /applicants/{applicant_id}/jobs/{job_id}
********************************************************************************************************
*/
//Get Applicant details
router.get(
  "/:user_id",
//   passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    var responseRadis = {};
    var resP = {};

    Users.findOne({ email: req.params.applicant_id })
      .then(profile => {
        if (!profile) {
          resP.code = 404;
          resP.message = "User not found";
          res.status(resP.code).json(resP.message);
          res.end();
        }

        resP.code = 200;
        resP.message = profile;
        res.status(resP.code).json(resP.message);
        res.end();
      })
      .catch(function(err) {
        resP.message = err;
        resP.code = 400;
        res.status(resP.code).json(resP.message);
        res.end();
      });
  }
);

// //applicant login
// router.post("/login", (req, res) => {
//   kafka.make_request("applicant_login", req.body, function(err, results) {
//     console.log("in result");
//     console.log(results);
//     if (err) {
//       console.log("Inside err");
//       res.json({
//         status: "error",
//         msg: "System Error, Try Again."
//       });
//     } else {
//       console.log("Inside else", results);
//       if (results.code === 200) {
//         res.status(results.code).json({
//           success: true,
//           token: "Bearer " + results.token
//         });
//       } else {
//         res.status(results.code).json({
//           error: results.err
//         });
//       }

//       res.end();
//     }
//   });
// });

module.exports = router;