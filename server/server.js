const express = require("express");
const _ = require("lodash");
const config = require("./config/config.js");

const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { User } = require("./models/user");
const { ObjectID } = require("mongodb");
const { authenticate } = require("./middleware/authenticate");

const app = express();

app.use(bodyParser.json());

// ROUTES

app.post("/users", (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post("/users/login", (req,res) => {
    var { email, password } = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(email,password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.get("/users/me", authenticate, (req,res) => {
    res.send(req.user);
});
app.delete("/users/logout", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      res.staus(400).send();
    }
  );
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`___${process.env.NODE_ENV || "development"} server____ started on port ${port}.\n`);
});

module.exports = { app };