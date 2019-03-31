const mongoose = require("mongoose");
require("dotenv").config();

// Connect to Mongo Db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected!!"))
    .catch(err => console.log(err));