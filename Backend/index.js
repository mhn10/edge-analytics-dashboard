//import the require dependencies
require("dotenv").config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const fs = require("fs");
const fileType = require("file-type");
const bluebird = require("bluebird");
const multiparty = require("multiparty");

var cors = require("cors");
var {mongoose} = require("./Mongo/connect");

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-1'
});

// configure AWS tqqo work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  console.log("Uploading file to s3");
  const params = {
    ACL: "public-read",
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    
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
var user = require("./routes/users/user.js");
app.use("/users", user);
// var jobs = require("./routes/api/jobs");
// var recruiter = require("./routes/api/recruiter");
// var graphs = require("./routes/api/graph");
// //app.use('/', index);
// app.use("/jobs", jobs);

// app.use("/recruiters", recruiter);
// app.use("/graphs", graphs);
// app.use("/api/photos", photos);
// app.use("/api/documentsUpload", doc);
app.use;

app.get("/healthcheck", (req, res) => {
  console.log("health check success");
  res.status(200);
  res.send();

});

// Define POST route
app.post("/uploaddata", (request, response) => {
  console.log("tEst upload data", request);
  const form = new multiparty.Form();
  form.parse(request, async (error, fields, files) => {
    if (error) throw new Error(error);
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `Data/001/${timestamp}-lg`;
      const data = await uploadFile(buffer, fileName, type);
      return response.status(200).send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
  });
});

app.post("/uploadmodel", (request, response) => {
  console.log("tEst upload model", process.env.AWS_ACCESS_KEY_ID);
  const form = new multiparty.Form();
  form.parse(request, async (error, fields, files) => {
    if (error) throw new Error(error);
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `Models/001/${timestamp}-lg`;
      const data = await uploadFile(buffer, fileName, type);
      return response.status(200).send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
  });
});

// Define POST route
app.get("/output", (req, res) => {
  console.log("get output data", process.env.S3_BUCKET);
  // var params = {Bucket: process.env.S3_BUCKET, Key: 'user1/data/1552948993601-lg.png'};
  // s3.getSignedUrl('putObject', params, function (err, url) {
  //   console.log('The URL is', url);
  // });

  s3.listObjects({ Bucket: process.env.S3_BUCKET, Prefix:'Results/' }, function(err, data) {
    if (err) {
      console.log(err);
      res.status(400).json({ success: false });
    } else {
      console.log("success", data);
      let keys = data.Contents.map(eachKey => eachKey.Key);
      console.log("Keys array map", keys);
      res.status(200);
      res.send({ data: keys });
      // "https://jetsons3test.s3.amazonaws.com"+data.key
    }
  });
});

// var amqp = require("amqplib/callback_api");
// app.post("/sendtask", (request, response) => {
//   console.log("req: ", request.data);

//   amqp.connect("amqp://jetson:jetson@73.92.205.30:5672", function(err, conn) {
//     conn.createChannel(function(err, ch) {
//       var q = "task_queue";
//       console.log("Process argv ", process.argv);
//       var msg = "001 IRIS.csv model";

//       ch.assertQueue(q, { durable: true });
//       ch.sendToQueue(q, Buffer.from(msg), { persistent: true });
//       console.log(" [x] Sent '%s'", msg);
//       return response.status(200).send(msg);
//     });
//     setTimeout(function() {
//       conn.close();
//     }, 500);
//   });
// });

app.listen(3001);
console.log("Server Listening on port 3001");
