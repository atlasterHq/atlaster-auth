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
