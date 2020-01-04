const express = require('express');
const router = express.Router();
const mongodb = require('../../lib/mongodb');
const { encryptWithSalt, drawPic } = require('../../lib/util');
const rand = require('csprng');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* GET listing */
router.get('/captcha', function (req, res, next) {
  const width = +req.query.width;
  const height = +req.query.height;
  const captcha = drawPic(4, width, height); // Create captcha object
  const ticket = `captcha.${rand(128, 16)}`; // Create ticket
  req.cache.set(ticket, captcha.text, 3); // Cache this captcha, Use ticket as key
  res.body.status = 200;
  res.body.statusText = 'Success';
  res.body.message = 'Get captcha success';
  res.body.data = {
    ticket: ticket,
    captchaPic: captcha.body
  };
  res.send(res.body);
});


/* POST listing */
router.post('/', function (req, res, next) {
  const userCaptcha = req.query.captcha || req.body.captcha;
  const cacheCaptcha = req.cache.getAndDel(req.ticket('captcha')); // Get ane delete captcha from cache
  if (userCaptcha != cacheCaptcha || !userCaptcha && !cacheCaptcha) { // If captcha are not equal
    res.body.status = 403;
    res.body.statusText = 'Failed';
    res.body.message = 'Captcha verification failed';
    res.body.data = { captchaVerify: false };
    return res.send(res.body);
  }
  // Find user from database
  mongodb.db('findOne', {
    collection: 'userInfo',
    conditions: {
      email: req.body.email
    }
  }, function (err, docs) {
    if (err) {
      res.body.status = 500;
      res.body.statusText = 'Failed';
      res.body.message = err.name;
      res.body.data = err;
    } else if (docs) { // The user exists
      const password = docs.password;
      const cacheRandSalt = req.cache.getAndDel(req.ticket('salt')); // Get ane delete salt from cache
      const passwordSalt = encryptWithSalt(password, cacheRandSalt, 'Hex'); // Encrypt password with salt
      if (req.body.password == passwordSalt) { // If password are equal
        const payload = {
          user: req.body.email
        };
        const options = {
          algorithm: 'HS256',
          issuer: 'http://localhost:3000',
          expiresIn: '1d'
        };
        const secret = encryptWithSalt(req.ip, process.env.SECRET_SEED, 'Hex'); // Encrypt password with salt
        const token = jwt.sign(payload, secret, options); // Create JWT token
        res.body.status = 200;
        res.body.statusText = 'Success';
        res.body.message = 'Login success';
        res.body.data = { token: token };
      } else { // If password are not equal
        res.body.status = 401;
        res.body.statusText = 'Failed';
        res.body.message = 'Login failed';
      }
    } else { // The user not exists
      res.body.status = 401;
      res.body.statusText = 'Failed';
      res.body.message = 'Login failed';
    }
    res.send(res.body);
  })
});

module.exports = router;