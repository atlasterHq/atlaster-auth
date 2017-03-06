var express  = require('express');
var helper   = require('auth/helper/helper');
var response = require('response');
var route = express.Router();

route.post("/",function(req,res){
  var respCtx = new response(req,res);
  var ctx = {};
  ctx.email = req.body.email;
  ctx.password = req.body.password;
  helper.hashPassword(ctx)
    .then(helper.signupVerificationToken)
    .then(helper.signup)
    .then(helper.sendVerificationMail)
    .then(respCtx.insert)
    .catch(respCtx.err);
});

route.post("/verify",function(req,res){
  var respCtx = new response(req,res);
  helper.getUser(req.body)
    .then(helper.verifyUser)
    .then(respCtx.ok)
    .catch(respCtx.err);
});

route.post("/token",function(req,res){
  var respCtx = new response(req,res);
  helper.getUser(req.body)
    .then(helper.validatePassword)
    .then(helper.isActive)
    .then(helper.genToken)
    .then(respCtx.list)
    .catch(respCtx.err);
});

module.exports = route;
