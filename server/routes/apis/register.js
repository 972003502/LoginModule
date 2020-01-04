const express = require('express');
const router = express.Router();
const mongodb = require('../../lib/mongodb');
const rand = require('csprng');
const mailer = require('../../lib/mailer');
const templ = require('../../emailTemplate/registerCaptcha.templ');

/* GET listing */
router.get('/captcha', function (req, res, next) {
  const email = req.query.email;
  if (!email) {
    res.body.status = 403;
    res.body.statusText = 'Failed';
    res.body.message = 'Please enter a valid Email';
    return res.send(res.body);
  } else if (req.cache.has(email)) { // The email exists in the cache
    res.body.status = 403;
    res.body.statusText = 'Failed';
    res.body.message = 'Please do not repeat the request';
    return res.send(res.body);
  } else { // The email not exists in the cache
    const ticket = `emailCaptcha.${rand(128, 16)}`; // Create ticket
    const captcha = rand(18, 10); // Create captcha
    req.cache.set(email, '', 1); // cache this email
    req.cache.set(ticket, captcha, 5); // Cache this captcha, Use ticket as key
    // Send email
    mailer.sendMail({
      email: email,
      subject: 'The captcha of register',
      template: templ(captcha) // Use HTML template
    }, function (err, result) {
      if (err) {
        res.body.status = 500;
        res.body.statusText = 'Failed';
        res.body.message = err.response;
        res.body.data = err
      } else { // Send success
        res.body.status = 200;
        res.body.statusText = 'Success';
        res.body.message = 'Captcha email sent success';
        res.body.data = {
          ticket: ticket
        };
      }
      res.send(res.body);
    });
  }
});

/* POST listing */
router.post('/', function (req, res, next) {
  const userCaptcha = req.query.emailCaptcha || req.body.emailCaptcha;
  const captchaKey = req.ticket('emailCaptcha'); // Get ticket on request
  const cacheCaptcha = req.cache.get(captchaKey); // Get ane delete captcha from cache
  if (userCaptcha != cacheCaptcha || !userCaptcha && !cacheCaptcha) { // If captcha are not equal
    res.body.status = 403;
    res.body.statusText = 'Failed';
    res.body.message = 'Captcha verification failed';
    res.body.data = { captchaVerify: false };
    return res.send(res.body);
  }
  req.cache.delete(captchaKey); // Delete captcha from cache
  // Create users from database
  mongodb.db('add', {
    collection: 'userInfo',
    data: {
      email: req.body.email,
      nickname: req.body.nickname,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      salt: req.cache.getAndDel(req.ticket('salt')) // Get ane delete salt from cache
    }
  }, function (err, docs) {
    if (err) {
      res.body.status = 500;
      res.body.statusText = 'Failed';
      res.body.message = err.name;
      res.body.data = err;
    } else { // Create success
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = 'Registration success';
    }
    res.send(res.body);
  });
});

module.exports = router;
