const mongoose = require("mongoose");

// Define the properties of your documents in mongodDB.
// Mongoose "validators" check to ensure the properties conform to the model.
const CourtCase = mongoose.model('court-doc', {
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    resource_uri: {
        type: String,
        minLength: 1,
        trim: true,
        required: true,
        unique: true
    },
    id: {
        type: Number,
        default: false,
        unique: true,
        required: true
    },
    absolute_url: {
        type: String,
        default: null,
        required: true,
        unique: true
    },
    date_created: {
        type: String,
        default: null,
        required: true
    },
    date_modified: {
        type: String,
        default: null,
        required: true
    },
    case_name: {
        type: String,
        defualt: null,
        required: true,
        unique: true
    }
}); // Mongooose automatically converts this to lowercase and pluralizes it as our collection.


module.exports = {
    CourtCase
}