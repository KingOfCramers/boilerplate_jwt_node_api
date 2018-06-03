const express = require("express");
const _ = require("lodash");
const { dev, port} = require("./config/portSetter");

const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { CourtCase } = require("./models/courtCase");
const { User } = require("./models/user");
const { ObjectID } = require("mongodb");
const { databaseCheck } = require("./utils/databaseCheck");

const app = express();

app.use(bodyParser.json()); // Middlewear. Sets our headers to JSON.

// ROUTES
app.post("/cases", (req,res) => {
    // Upon a POST method to /cases Url, get the body of the request, and get the text value. Use that to create a new ccase based on our mongo model.
    const ccase = new CourtCase({
        resource_uri: req.body.resource_uri,
        id: req.body.id,
        absolute_url: req.body.absolute_url,
        date_created: req.body.date_created,
        date_modified: req.body.date_modified,
        case_name: req.body.case_name
    });

    // Call the save method on our mongoose model to add it to the database.
    ccase.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get("/cases", (req,res) => {
    CourtCase.find().then((cases) => {
        res.send({ // By using an object, we can add other information...
            cases
        });
    }, (e) => {
        res.status(400).send(e);
    })  // Returns all Cases.
});

app.get("/cases/:case", (req,res) => {
    let id = req.params.case;
    if(!ObjectID.isValid(id)){
        return res.status(404).send(); // Pass nothing back
    }

    CourtCase.findById(id).then((the_case) => {
        if(!the_case){
            return res.status(404).send("Not found.");
        }
        res.status(200).send({
            the_case
        });
    }, (e) => {
        res.status(400).send(e);
    })  // Returns all Cases.
});


app.delete("/cases/:case", (req,res) => {
    let id = req.params.case;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    CourtCase.findByIdAndRemove(id).then((the_case) => {
        if(!the_case){
            return res.status(404).send();
        }
        res.send({the_case});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`**** ${dev} server started on port ${port}.`);
});

app.post("/users", (req,res) => {
    var body = _.pick(req.body, ['email', 'password']); // Creates an object using the properties passed into the array.

    const newUser = new User(body)

    newUser.save().then((user) => {
        res.send(user);
    }, (e) => {
        res.status(400).send(e);
    });
});

// Call database check here...

// Export app for testing purposes.
module.exports = { app };