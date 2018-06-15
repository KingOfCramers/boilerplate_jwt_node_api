const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mailer = (url,caseName) => {

    let message = `Hello ${"USERNAME"}, there has been an update to ${caseName}. \n https://www.courtlistener.com${url}`
    const mailOptions = {
    from: process.env.EMAIL,
    to: "hcramer@nationaljournal.com", // From JWT
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