const mongoose = require("mongoose");
const keys = require("../config/keys.js");
const { dev, port} = require("../config/portSetter");

mongoose.Promise = global.Promise; // Tell mongoose to use promises.

// Change database based on dev/production....

if(dev === "development"){
    mongoose.connect("mongodb://localhost:27017/RecapAppDev");
} else {
mongoose.connect(`mongodb://${keys.mongo_user}:${keys.mongo_password}@ds155191.mlab.com:55191/recap-node-app`);
}

module.exports = {
    mongoose
}

// wer80hwenaiYGLIa