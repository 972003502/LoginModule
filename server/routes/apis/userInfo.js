const express = require('express');
const router = express.Router();
const mongodb = require('../../lib/mongodb');

/* GET listing */
router.get('/', function (req, res, next) {
  // Find user from database
  mongodb.db('findOne', {
    collection: 'userInfo',
    conditions: {
      email: req.query.email
    }
  }, function (err, docs) {
    if (err) {
      res.body.status = 500;
      res.body.statusText = 'Failed';
      res.body.message = err.name;
      res.body.data = err;
    } else if (docs) { // The user exists
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = 'Get userInfo Success';
      res.body.data = {
        email: docs.email,
        nickname: docs.nickname,
        salt: docs.salt
      };
    } else { // The user not exists
      res.body.status = 404;
      res.body.statusText = 'Failed';
      res.body.message = 'User does not exist';
    }
    res.send(res.body);
  });
});

module.exports = router;
