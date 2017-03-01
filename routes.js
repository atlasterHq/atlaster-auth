const express  = require('express');
const helper   = require('./helper/helper');
const response = require('response');
var route = express.Router();

route.post("/",(req,res,next)=>{
  var respCtx = new response(req,res);
  helper.hashPassword(req.body)
    .then(helper.signup)
    .then(respCtx.insert)
    .catch(respCtx.err);
});

route.post("/token",(req,res,next)=>{
  var respCtx = new response(req,res);
  helper.getUser(req.body)
    .then(helper.validatePassword)
    .then(helper.genToken)
    .then(respCtx.list)
    .catch(respCtx.err);
});

module.exports = route;