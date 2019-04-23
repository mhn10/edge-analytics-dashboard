const express = require("express");
const router = express.Router();
const userModel = require("../../Model/User");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { extractNameFromEmail } = require("../../utility");

router.get("/", async (req, res) => {
    console.log(
        "Inside get all fileNames for logged in User and corresponding task"
    );
    //Get the details of the filenames for each task from S3 bucket.
    var username = req.query.username;
    var userFirstName = extractNameFromEmail(username).toLowerCase();
    var data = await getFilesWithTaskNameFromS3(userFirstName);
    console.log("Data", data);
    //and push the output file with name and link of S3 and return the updated content for logged in User
    data.map(obj => {
        if (obj.actionType === "classification") {
            var query = {};
            query[`${obj.actionType}.${obj.taskName}.result`] = obj.resultPath;
            userModel.findOneAndUpdate(
                {
                    $and: [
                        { email: username },
                        { classification: { name: obj.taskName } }
                    ]
                },
                { $set: { query: obj.resultPath } },
                (err, success) => {
                    if (err) {
                        var err = {
                            message: `err`
                        };
                        console.log(`${taskName} record didn't updated ${err}`);
                    } else {
                        console.log(success);
                    }
                }
            );
        } else {
            userModel.findOneAndUpdate(
                {
                    $and: [
                        { email: username },
                        { regression: { name: obj.taskName } }
                    ]
                },
                { $set: { "regression.result": obj.resultPath } },
                (err, success) => {
                    if (err) {
                        var err = {
                            message: `err`
                        };
                        console.log(`${taskName} record didn't updated ${err}`);
                    } else {
                        console.log(success);
                    }
                }
            );
        }
    });
    userModel.find({ email: username }, (err, user) => {
        if (err) {
            var err = {
                message: `err`
            };
            console.log(`${taskName} record didn't updated ${err}`);
            return res.status(400).send(err);
        } else {
            console.log(`Record for user :  ${username} found`);
            return res.status(200).send(user);
        }
    });
});

//Get the files name for S3 bucket
const getFilesWithTaskNameFromS3 = parentFolder => {
    return new Promise((resolve, reject) => {
        console.log("entered getFiles with task name from s3");
        s3.listObjects(
            { Bucket: process.env.S3_BUCKET, Prefix: parentFolder },
            function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                    //res.status(400).json({ success: false });
                } else {
                    console.log("success", data);
                    var result = [];
                    data.Contents.map(eachKey => {
                        var temp = eachKey.Key;
                        var tempSplit = temp.split("/");
                        if (tempSplit[3] === "Results" && tempSplit[4] !== "") {
                            var taskName = tempSplit[2];
                            var fileName = tempSplit[4];
                            var actionType = tempSplit[1];
                            var resultPath = `${process.env.S3_PREFIX_PATH}${
                                process.env.S3_BUCKET
                            }/${temp}`;
                            var fileObj = {
                                result: fileName,
                                resultPath: resultPath,
                                actionType: actionType,
                                taskName: taskName
                            };
                            result.push(fileObj);
                        }
                    });
                    console.log(JSON.stringify(result));
                    resolve(result);
                }
            }
        );
    });
};

module.exports = router;
