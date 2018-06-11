const { ObjectID } = require("mongodb");
const { CourtCase } = require("../../models/courtCase");
const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// Dummy User data.
const users = [{
    _id: userOneId,
    email: "example@example.com",
    password: "useronepass",
    tokens: [{
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: 'auth'}, "abc123").toString()
    }]
},{
    _id: userTwoId,
    email: "exampletwo@example.com",
    password: "usertwopassword"
}];

// Dummy data of todos.
const cases = [{
    _id: new ObjectID(),
    _creator: userOneId,
    id: 91573,
    absolute_url: "/docket/91573/kelly-v-morse/",
    date_created: "2014-10-30T06:30:40.548624Z",
    date_modified: "2014-10-30T06:30:40.548624Z",
    resource_uri: "https://www.courtlistener.com/api/rest/v3/dockets/91573/?format=json",
    case_name: "Kelly v. Morse"
    },{
    _id: new ObjectID(),
    _creator: userTwoId,
    id: 982793,
    absolute_url: "/docket/982793/second-case/",
    date_created: "2014-10-30T06:30:40.548624Z",
    date_modified: "2014-10-30T06:30:40.548624Z",
    resource_uri: "https://www.courtlistener.com/api/rest/v3/dockets/982793/?format=json",
    case_name: "Second Case"
}];

const populate = (done) => {
    CourtCase.remove({}).then(() => {  // Empties database.
        return CourtCase.insertMany(cases[0]) // Inserts dummy data (to ensure GET requests works).
        }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {  // Empties database.
        var userOne = new User(users[0]).save(); // Save the first user.
        var userTwo = new User(users[1]).save(); // Save #2 (returns promise)
        return Promise.all([userOne, userTwo]).then(() => done());
    });
}

module.exports = {
    cases,
    users,
    populate,
    populateUsers
}