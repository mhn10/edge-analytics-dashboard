var mongoose = require("mongoose");
var utility = require("../utility");

var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    set: utility.capitalizeFirstLetter,
    default: ""
  },
  lastName: {
    type: String,
    required: true,
    set: utility.capitalizeFirstLetter,
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
    model: [
        {
            name: { type: String, required: false, default: "" },
            timeStamp: {type: Date, default: Date.now},
            type: { type: String, required: false, default: "" },

            data: [{
                name: { type: String, required: false, default: "" },
                timeStamp: {type: Date, default: Date.now},
                result: {
                  remark: { type: String, required: false, default: "" },
                  timeStamp: {type: Date, default: Date.now},
                  accuracy: {type: Number, default: 0},

              }
            }],
            
        }
    ],
  profileImage: {
    type: String,
    required: false,
    default: ""
  },
  
  gender: {
    type: String,
    required: false,
    set: utility.capitalizeFirstLetter,
    default: ""
  },
  memberSince: {
    type: Date,
    default: Date.now
  }

  
});

module.exports = mongoose.model('Users', userSchema);
