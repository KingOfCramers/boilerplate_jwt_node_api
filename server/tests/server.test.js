const expect = require("expect");
const supertest = require("supertest");
const { ObjectID } = require("mongodb");
const { app } = require("../server.js");
const { CourtCase } = require("../models/courtCase");
const { User } = require("../models/user");

// Dummy data of todos.
const newCases = [{
    _id: new ObjectID(),
    id: 91573,
    absolute_url: "/docket/91573/kelly-v-morse/",
    date_created: "2014-10-30T06:30:40.548624Z",
    date_modified: "2014-10-30T06:30:40.548624Z",
    resource_uri: "https://www.courtlistener.com/api/rest/v3/dockets/91573/?format=json",
    case_name: "Kelly v. Morse"},{
    _id: new ObjectID(),
    id: 982793,
    absolute_url: "/docket/982793/second-case/",
    date_created: "2014-10-30T06:30:40.548624Z",
    date_modified: "2014-10-30T06:30:40.548624Z",
    resource_uri: "https://www.courtlistener.com/api/rest/v3/dockets/982793/?format=json",
    case_name: "Second Case"}];

// Dummy data of new users.
const newUsers = [{
    email: "oldemail@gmail.com",
    password: "testpassword"
    },{
    email: "newtestemail@gmail.com",
    password: "newtestpassword"}];

// Reset database for tests
beforeEach((done) => {
    CourtCase.remove({}).then(() => {  // Empties cases database.
        return CourtCase.insertMany(newCases[0]) // Inserts single dummy doc.
    }).then(() => {
        User.remove({}).then(() => { // Empties Users database.
            return User.insertMany(newUsers[0]) // Inserts single user doc.
        }).then(() => done());
    });
});

describe("POST /cases", () => {
    it("Should POST a new courtCase", (done) => {

        supertest(app)
            .post("/cases")
            .send(newCases[1])
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toBeA('number');
                expect(res.body.date_created).toBeA('string')
                expect(res.body.date_modified).toBeA('string')
                expect(res.body.resource_uri).toBeA('string')
                expect(res.body.case_name).toBeA('string')
            })
            .end(done);
    });

    it("Should not POST courtCase with invalid body data", (done) => {
        supertest(app)
            .post("/cases")
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                CourtCase.find().then((cases) => {
                    expect(cases.length).toBe(1);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it("Should not POST a duplicate courtCase", (done) => {
        supertest(app)
            .post("/cases")
            .send(newCases[0])
            .expect(400)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                CourtCase.find().then((cases) => {
                    expect(cases.length).toBe(1);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe("GET /cases", () => {
    it("Should GET all cases", (done) => {
        supertest(app)
            .get("/cases")
            .expect(200)
            .expect((res) => {
                expect(res.body.cases.length).toBe(1);
            })
            .end(done);
    });

    it("Should not GET a non-existent court case", (done) => {
        const fakeID = new ObjectID();
        supertest(app)
            .get(`/cases/${fakeID.toHexString()}`)
            .expect(404)
            .end(done)
    });

    it("Should GET a single case", (done) => {
        supertest(app)
            .get(`/cases/${newCases[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.the_case.id).toBe(newCases[0].id);
                expect(res.body.the_case.absolute_url).toBe(newCases[0].absolute_url);
                expect(res.body.the_case.date_created).toBe(newCases[0].date_created);
                expect(res.body.the_case.date_modified).toBe(newCases[0].date_modified);
                expect(res.body.the_case.resource_uri).toBe(newCases[0].resource_uri);
                expect(res.body.the_case.case_name).toBe(newCases[0].case_name);
            })
            .end(done);
    });
});

describe("DELETE /cases", () => {
    it("Should delete a single case", (done) => {
        supertest(app)
            .delete(`/cases/${newCases[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.the_case.id).toBe(newCases[0].id);
                expect(res.body.the_case.absolute_url).toBe(newCases[0].absolute_url);
                expect(res.body.the_case.date_created).toBe(newCases[0].date_created);
                expect(res.body.the_case.date_modified).toBe(newCases[0].date_modified);
                expect(res.body.the_case.resource_uri).toBe(newCases[0].resource_uri);
                expect(res.body.the_case.case_name).toBe(newCases[0].case_name);
            })
            .end(done);
    });

    it("Should not delete a non-existent court case", (done) => {
        const fakeID = new ObjectID();
        supertest(app)
            .delete(`/cases/${fakeID.toHexString()}`)
            .expect(404)
            .end(done)
    });
});

describe("POST /user", () => {
    it("Should post a new user", (done) => {
        supertest(app)
            .post("/users") // Post request to the /todos URL
            .send(newUsers[1])
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(newUsers[1].email);
                expect(res.body.password).toBe(newUsers[1].password);
            })
            .end(done)
    });
    it("Should not post a duplicate user", (done) => {
        supertest(app)
            .post("/users")
            .send(newUsers[0]) // Try to post old data
            .expect(400)
            .end(done)
    });
});