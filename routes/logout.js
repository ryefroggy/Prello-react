var express = require('express');
var mongoose = require('mongoose');
var User = require("../models/user")
var session = require('client-sessions');
var cors = require('../cors');

var router = express.Router();

router.use(session({
  cookieName: 'session',
  secret: 'HairballGooseRyeFamily',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
}));

router.get('/', cors, function(req, res) {
  req.session.reset();
  res.json({});
});

module.exports = router;
