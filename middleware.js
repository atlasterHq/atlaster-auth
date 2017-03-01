const jwt = require('jsonwebtoken');
const secret = process.env.authSecret;

var helper = {};

helper.getUser = (req,res,next)=>{
  var token = req.header.authorization;
  if(token){
    jwt.verify(token,secret,(err,decoded)=>{
      if(err){
        req.authenticated = false;
        next();
      }
      else{
        req.user = decoded;
        req.authenticated = true;
        next();
      }
    }
  }else{
    req.authenticated = false;
    next();
  }
}

helper.allowIfAuthenticated = (req,res,next)=>{
  if(req.authenticated)
    next();
  else{
    res.status(401).json({err: "Unauthorized"});
  }
}

helper.allowByRole = function(roleList){
  return (req,res,next)=>{
    if(roleList.indexOf(req.user.role) > -1)
      next();
    else{
      res.status(401).json(err: "Unauthorized"});
    }
  }
}

module.exports = helper;
