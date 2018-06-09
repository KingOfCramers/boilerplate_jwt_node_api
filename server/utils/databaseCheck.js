const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("../db/mongoose");
const { CourtCase } = require("../models/courtCase");
const axios = require("axios");
const { mailer } = require("./mailer");

/*const databaseCheck = (username) => {
    console.log(`Checking data for ${username}`);
    CourtCase.find({}, (err,docs) => {
        if(err){
            return console.log("There was an error", err);
        }
        docs.forEach((doc) => {
            axios.get(`https://www.courtlistener.com/api/rest/v3/dockets/${doc.id}/?format=json`)
            .then((res) => {
                if(res.data.date_modified !== doc.date_modified){ // If the date modified has changed since last check...
                    mailer(res.data.absolute_url,res.data.case_name);
                    CourtCase.findOneAndUpdate({"id": res.data.id}, {date_modified: res.data.date_modified }, (err,newDoc) => { // Update Mlab.
                        if(err){
                            return console.log(err);
                        }
                    });
                } else {
                    console.log("No changes");
                }
            })
            .catch(e => {
                return console.log(e);
            });
        });
    });
}*/

const requestList = (items) => Promise.all(
  items.map(key => (
    axios.get(`https://www.courtlistener.com/api/rest/v3/dockets/${key.id}/?format=json`)
      .catch(err => console.error(err))
  )
));

CourtCase.find({}, (err,docs) => {
    requestList(docs)
        .then((results) => {


            /*results.forEach(the_case => {
                console.log(the_case.data.date_modified)
            });*/
        })
        .catch(err => console.log(err));
});
/*
module.exports = {
    databaseCheck
}*/