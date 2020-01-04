const express = require('express');
const router = express.Router();
const rand = require('csprng');

/* GET listing */
router.get('/', function (req, res, next) {
  const salt = rand(256, 16); // Create random salt
  const ticket = `salt.${rand(128, 16)}`; // Create ticket
  req.cache.set(ticket, salt, 1); // Cache this salt, Use ticket as key
  res.body.status = 200;
  res.body.statusText = 'Success';
  res.body.message = 'Get salt success';
  res.body.data = {
    ticket: ticket,
    salt: salt
  };
  res.send(res.body);
});

module.exports = router;