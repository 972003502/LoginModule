const express = require('express');
const router = express.Router();
const util = require('../../lib/util');
const jwt = require('express-jwt');
require('dotenv').config();

/* Create secret */
function secretCallback(req, payload, done) {
  const secret = util.encryptWithSalt(req.ip, process.env.SECRET_SEED, 'Hex');
  done(null, secret);
}

/* GET listing */
router.get('/',
  jwt({ secret: secretCallback }), // JWT token auth
  function (req, res, next) {
    res.body.status = 200;
    res.body.statusText = 'Success';
    res.body.message = 'Verify Success';
    res.send(res.body);
  });

module.exports = router;
