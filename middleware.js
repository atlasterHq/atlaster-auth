var jwt = require('jsonwebtoken');
var response = require('response');
var secret = process.env.authSecret;

var helper = {};

helper.getUser = function(req,res,next){
  var token = req.header.authorization;
  if(token){
    jwt.verify(token,secret,function(err,decoded){
      if(err){
        req.authenticated = false;
        next();
      }
      else{
        req.user = decoded;
        req.authenticated = true;
        next();
      }
    });
  }else{
    req.authenticated = false;
    next();
  }
};

helper.allowIfAuthenticated = function(req,res,next){
  var respCtx = new response(req,res);
  if(req.authenticated){
    next();
  }
  else{
    respCtx.customResponse(401,"Unauthorized",null);
  }
};

helper.allowByRole = function(roleList){
  return function(req,res,next){
    var respCtx = new response(req,res);
    if(roleList.indexOf(req.user.role) > -1){
      next();
    }
    else{
      respCtx.customResponse(401,"Unauthorized",null);
    }
  };
};

module.exports = helper;
