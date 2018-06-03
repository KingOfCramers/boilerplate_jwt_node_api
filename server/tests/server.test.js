const expect = require("expect");
const supertest = require("supertest");
const { ObjectID } = require("mongodb");
const { app } = require("../server.js");
const { CourtCase } = require("../models/courtCase");

// Dummy data of todos.
const newCase = [{
            _id: new ObjectID(),
            id: 91573,
            absolute_url: "/docket/91573/kelly-v-morse/",
            date_created: "2014-10-30T06:30:40.548624Z",
            date_modified: "2014-10-30T06:30:40.548624Z",
            resource_uri: "https://www.courtlistener.com/api/rest/v3/dockets/91573/?format=json",
            case_name: "Kelly v. Morse"
        }]

// This function runs before every test case.
beforeEach((done) => {
    CourtCase.remove({}).then(() => {  // Empties database.
        return CourtCase.insertMany(newCase) // Inserts dummy data (to ensure GET requests works).
        }).then(() => done());
});

describe("POST /cases", () => {
    it("Should POST a new courtCase", (done) => {

        // Using supertest...
        supertest(app)
            .post("/cases") // Post request to the /todos URL
            .send(newCase[0])
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toBeA('number');
                expect(res.body.date_created).toBeA('string')
                expect(res.body.date_modified).toBeA('string')
                expect(res.body.resource_uri).toBeA('string')
                expect(res.body.case_name).toBeA('string')
            })
            .end((err, res) => {
                if (err){
                   return done(err);
                }
                CourtCase.findById(newCase[0]._id).then((the_case) => {
                    expect(the_case.id).toBe(newCase[0].id);
                    expect(the_case.absolute_url).toBe(newCase[0].absolute_url);
                    expect(the_case.date_created).toBe(newCase[0].date_created);
                    expect(the_case.date_modified).toBe(newCase[0].date_modified);
                    expect(the_case.resource_uri).toBe(newCase[0].resource_uri);
                    expect(the_case.case_name).toBe(newCase[0].case_name);
                    done(); // Call done to end the checks.
                }).catch((e) => done(e));
            }) // Instead of passing done, we use a function
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

    it("Should GET a single case", (done) => {
        var theurl = `/cases/${newCase[0]._id.toHexString()}`
        supertest(app)
            .get(`/cases/${newCase[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.the_case.id).toBe(newCase[0].id);
                expect(res.body.the_case.absolute_url).toBe(newCase[0].absolute_url);
                expect(res.body.the_case.date_created).toBe(newCase[0].date_created);
                expect(res.body.the_case.date_modified).toBe(newCase[0].date_modified);
                expect(res.body.the_case.resource_uri).toBe(newCase[0].resource_uri);
                expect(res.body.the_case.case_name).toBe(newCase[0].case_name);
            })
            .end(done);
    });
})