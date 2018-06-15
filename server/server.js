const express = require("express");
const _ = require("lodash");
const config = require("./config/config.js");

const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { CourtCase } = require("./models/courtCase");
const { User } = require("./models/user");
const { ObjectID } = require("mongodb");
const { databaseCheck } = require("./utils/databaseCheck");

const { authenticate } = require("./middleware/authenticate");

const app = express();

app.use(bodyParser.json()); // Middlewear. Sets our headers to JSON.

// ROUTES
app.post("/cases", authenticate, (req,res) => {
    // Upon a POST method to /cases Url, get the body of the request, and get the text value. Use that to create a new ccase based on our mongo model.
    const ccase = new CourtCase({
        _creator: req.user._id,
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

app.get("/cases", authenticate, (req,res) => {
    CourtCase.find({ _creator: req.user._id }).then((cases) => {
        res.send({ // By using an object, we can add other information...
            cases
        });
    }, (e) => {
        res.status(400).send(e);
    })  // Returns all Cases.
});

app.get("/cases/:case", authenticate, (req,res) => {
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


app.delete("/cases/:case", authenticate, (req,res) => {
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

app.post("/users", (req,res) => {
    var body = _.pick(req.body, ['email', 'password']); // Creates an object using the properties passed into the array.
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post("/users/login", (req,res) => { // Will add logged in token to database for correct credentials.
    var { email, password } = _.pick(req.body, ['email', 'password']); // get data, find user
    User.findByCredentials(email,password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.get("/users/me", authenticate, (req,res) => { // Find associated user w/ token
    res.send(req.user);
});
app.delete("/users/logout", authenticate, (req, res) => {
  // Our req object comes in from our authenticate function...
  req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      res.staus(400).send();
    }
  );
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`**** server started on port ${port}.`);
});

module.exports = { app };