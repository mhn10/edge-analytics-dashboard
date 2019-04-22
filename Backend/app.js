const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { mongoose } = require('./Mongo/connect');
const AWS = require("aws-sdk");
const bluebird = require("bluebird");
const { CONSTANTS } = require('./Constants');
require("dotenv").config();


// configure the keys for accessing AWS
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID_BAK,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_BAK,
	region: 'us-west-1'
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

//Adding the Route Dependencies
const loginRoutes = require('./routes/users/login');
const signupRoutes = require('./routes/users/signup');
const uploadFile = require('./routes/fileHandling/uploadFile');
const downloadResult = require('./routes/fileHandling/downloadResult');
const runTask = require('./routes/Task/runTask');
const userDetail = require('./routes/users/userDetails');
const taskDetail = require('./routes/Task/taskDetails');
const fileDetail = require('./routes/fileHandling/fileDetails');
const activeNodes = require('./routes/nodes/activeNodes');
const nodeDetail = require('./routes/nodes/nodeDetail');

//Use middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cors({ origin: `${CONSTANTS.FRONT_END_URL}`, credentials: true }));
// app.use(formidable());
//Allow Access Control
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", `${CONSTANTS.FRONT_END_URL}`);
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

//Routes which should handle requests
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/uploadfile', uploadFile);
app.use('/output', downloadResult);
app.use('/runtask', runTask);
app.use('/userdetail', userDetail);
app.use('/taskdetail', taskDetail);
app.use('/filedetail', fileDetail);
app.use('/activenodes', activeNodes);
app.use('/nodedetail', nodeDetail);


//Handle the errors of the application
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
