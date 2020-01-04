const mailer = require('nodemailer');
require('dotenv').config();

const transporter = mailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

/**
 * Sends an email using the preselected transport object 
 * @param {any} options Mail Options
 * @param {Function} callback (err, res) => {}
 */
function sendMail(options, callback) {
  const mailOptions = {};
  mailOptions.from = process.env.MAIL_USER;
  mailOptions.to = options.email;
  mailOptions.subject = options.subject;
  mailOptions.html = options.template;
  transporter.sendMail(mailOptions, callback);
}

module.exports = {
  transporter: transporter,
  sendMail: sendMail
};
