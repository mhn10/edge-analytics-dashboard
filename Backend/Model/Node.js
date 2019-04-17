var mongoose = require("mongoose");
var utility = require("../utility");

var nodeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  active: {
    type: Boolean,
    default: true
  },
  lastlogged: { type: Date, required: false, default: "" },

  startDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Nodes", nodeSchema);
