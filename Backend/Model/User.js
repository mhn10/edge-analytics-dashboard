var mongoose = require("mongoose");
var utility = require("../utility");

var userSchema = new mongoose.Schema({

	_id: mongoose.Schema.Types.ObjectId,
	firstName: {
		type: String,
		required: true,
		// set: utility.capitalizeFirstLetter,
		default: ""
	},
	lastName: {
		type: String,
		required: true,
		// set: utility.capitalizeFirstLetter,
		default: ""
	},
	email: {
		type: String,
		// set: utility.toLower,
		lowercase: true,
		required: true,
		default: ""
	},
	password: {
		type: String,
		required: true
	},
	classification: [{
		name: { type: String, required: false, default: "" },
		timeStamp: { type: Date, default: Date.now() },

		requirement: { type: String, required: false, default: "" },
		code: { type: String, required: false, default: "" },
		model: { type: String, required: false, default: "" },
		data: { type: String, required: false, default: "" },
		input: { type: String, required: false, default: "" },
		result: { type: String, required: false, default: "" },

	}
	],
	regression: [{
		name: { type: String, required: false, default: "" },
		timeStamp: { type: Date, default: Date.now() },

		requirement: { type: String, required: false, default: "" },
		code: { type: String, required: false, default: "" },
		data: { type: String, required: false, default: "" },
		input: { type: String, required: false, default: "" },
		result: { type: String, required: false, default: "" },

	}
	],
	memberSince: {
		type: Date,
		default: Date.now
	}


});

module.exports = mongoose.model('Users', userSchema);
