const mongoose = require("mongoose");

// Define the properties of your documents in mongodDB.
// Mongoose "validators" check to ensure the properties conform to the model.
const CourtCase = mongoose.model('court-doc', {
    resource_uri: {
        type: String,
        minLength: 1,
        trim: true,
        required: true
    },
    id: {
        type: Number,
        default: false,
        required: true
    },
    absolute_url: {
        type: String,
        default: null,
        required: true
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
        required: true
    }
}); // Mongooose automatically converts this to lowercase and pluralizes it as our collection.


module.exports = {
    CourtCase
}