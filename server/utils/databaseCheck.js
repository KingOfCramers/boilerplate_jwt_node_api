const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("../db/mongoose");
const { CourtCase } = require("../models/courtCase");
const axios = require("axios");
const { mailer } = require("./mailer");

const databaseCheck = (username) => {
    console.log(`Checking data for ${username}`);
    CourtCase.find({}, (err,docs) => {
        if(err){
            return console.log("There was an error", err);
        }
        docs.forEach((doc) => {
            // console.log(doc.id)
            axios.get(`https://www.courtlistener.com/api/rest/v3/dockets/${doc.id}/?format=json`)
            .then((res) => {
                if(res.data.date_modified !== doc.date_modified){
                    //console.log(res.data)
                    console.log(new Date(), `: ${doc.case_name}`);
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
            .then(() => {
               // mongoose.disconnect();
            })
            .catch(e => {
                // mongoose.disconnect();
                return console.log(e);
            });
        });
    });
}

module.exports = {
    databaseCheck
}