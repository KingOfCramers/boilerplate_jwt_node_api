const nodemailer = require('nodemailer');
const keys = require("../config/keys");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: keys.email,
    pass: keys.email_password
  }
});

const mailer = (url,caseName) => {

    let message = `Hello ${"USERNAME"}, there has been an update to ${caseName}. \n https://www.courtlistener.com${url}`
    const mailOptions = {
    from: keys.email,
    to: "hcramer@nationaljournal.com",
    subject: `PACER: Update to ${caseName}`,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  mailer
}