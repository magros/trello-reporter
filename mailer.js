'use strict';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'marco@empleosti.com.mx',
    pass: '',
  },
});
//
// const mailOptions = ;

const sendEmail = function(html, subject) {
  transporter.sendMail({
    from: 'marco@empleosti.com.mx',
    to: 'marco@empleosti.com.mx, antonio@empleosti.com.mx, rafael@empleosti.com.mx',
    subject,
    html
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {sendEmail};
