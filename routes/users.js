var express = require('express');
var mongoose = require('mongoose');
var User = require("../models/user")
var session = require('client-sessions');
var cors = require('../cors');
var encrypt = require('password-hash');

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
  if(!req.session.user) {
    return res.json({error: "yes"});
  }
  else{
    return res.json({username: req.session.user.username});
  }
});

router.post('/', cors, function(req, res) {
  console.log('connected');
  var password = encrypt.generate(req.body.password);
  User.findOne({username: req.body.username}, function(err, user) {
    if(!req.body.email) {
      if(!user || !encrypt.verify(req.body.password, user.password)) {
        res.send({error: 'invalid'});
      }
      else {
        req.session.user = user;
        res.send({error: "no"});
      }
    }
    else {
      if(!user) {
        var newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: password
        });
        newUser.save(function(err2, list) {
          if(err2) {
            console.log(err2);
          }
          req.session.user = newUser;
          res.json({error: "no"});
        });
      }
      else {
        res.json({error: "yes"});
      }
    }
  });
});

module.exports = router;
