// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-1'});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Lists for testing
var users = ['Afla','Dick','Peter','Harry','John'];
var types = ['regression', 'classification', 'classification', 'regression','classification'];
var body = ['My Model 01','mooodal 1','something 02','test 001','class 01'];

var i;

// Loop to send items from list
for ( i = 0; i < 5; i++ ) {
    // create parameters
    var params = {
    DelaySeconds: 10,
    MessageAttributes: {
        "User": {               // First attribute name is username / UID
        DataType: "String",
        StringValue: users[i]   // Value is username or id
        },
        "Type": {               // Second attribute name is Type ( indicates if its classification or regression )
        DataType: "String",
        StringValue: types[i]   // Value is classification or regression
        }
    },
    MessageBody: body[i],       // Its the name given by user for their upload
    QueueUrl: "https://sqs.us-west-1.amazonaws.com/121636399828/taskQ1"     // URL of our queue
    };

    sqs.sendMessage(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.MessageId);
    }
    });
}