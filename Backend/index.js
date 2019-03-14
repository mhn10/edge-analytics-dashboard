//import the require dependencies
require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

const mongoose = require("mongoose");
var cors = require("cors");


// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();



// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  console.log("Uploading file to s3");
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  console.log("params: ", params);
  return s3.upload(params).promise();
};


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

//index.js stores the homepage
// var index = require("./routes/api/index");
// var applicant = require("./routes/api/applicant");
// var jobs = require("./routes/api/jobs");
// var recruiter = require("./routes/api/recruiter");
// var graphs = require("./routes/api/graph");
// //app.use('/', index);
// app.use("/jobs", jobs);
// app.use("/applicants", applicant);
// app.use("/recruiters", recruiter);
// app.use("/graphs", graphs);
// app.use("/api/photos", photos);
// app.use("/api/documentsUpload", doc);
// app.use;

app.get("/healthcheck", (req, res) => {
  console.log("health check success");
  res.status(200);
  res.send();
});


// Define POST route
app.post('/test-upload', (request, response) => {
  console.log("tEst upload node", process.env.AWS_ACCESS_KEY_ID);
  const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = fileType(buffer);
        const timestamp = Date.now().toString();
        const fileName = `bucketFolder/${timestamp}-lg`;
        const data = await uploadFile(buffer, fileName, type);
        return response.status(200).send(data);
      } catch (error) {
        return response.status(400).send(error);
      }
    });
});


app.listen(3001);
console.log("Server Listening on port 3001");
