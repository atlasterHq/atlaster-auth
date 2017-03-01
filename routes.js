const express = require('express');
const helper  = require('./helper/helper');
var route = express.Router();

route.post("/",(req,res,next)=>{
  helper.hashPassword(req.body)
    .then(helper.signup)
    .then(()=>{
      res.status(200).end();
    })
    .catch((err)=>{
      res.status(400).json(err);
    });
});

route.post("/token",(req,res,next)=>{
  helper.getUser(req.body)
    .then(helper.validatePassword)
    .then(helper.genToken)
    .then((resp)=>{
      res.status(200).json(resp);
    })
    .catch((err)=>{
      res.status(400).json(err);
    });
});

module.exports = route;
