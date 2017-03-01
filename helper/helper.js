const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = process.env.authSecret;
const rounds = parseInt(process.env.hashRounds);

var helper = {};

helper.hashPassword = (body)=>{
  return new Promise((fullfill,reject)=>{
    bcrypt.hash(body.password,rounds,(err,hash)=>{
      if(err) reject(err);
      else{
        body.password = hash;
        fullfill(body);
      }
    });
  });
}

helper.signup = (body)=>{
  return new Promise((fullfill,reject)=>{
    new user(body)
      .save()
      .then(fullfill)
      .catch(reject);
  });
}

helper.getUser = (body)=>{
  return new Promise((fullfill,reject)=>{
    user
      .findOne({email: body.email})
      .then((user)=>{
        if(user == null)
          reject(new Error("No user found"));
        else{
          body.user = user;
          fullfill(body);
        }
      })
      .catch(reject);
  });
}

helper.validatePassword = (body)=>{
  return new Promise((fullfill,reject)=>{
    bcrypt.compare(body.password,body.user.password,(err,res)=>{
      if(err || res == false) reject(new Error("Invalid credentials"));
      else fullfill(body.user.toObject());
    });
  });
}

helper.genToken = (user)=>{
  return new Promise((fullfill,reject)=>{
    try{
      var token = jwt.sign(user,secret);
      var resp = {key: token,role: user.role};
      fullfill(resp);
    }catch(ex){
      reject(ex);
    }
  });
}

module.exports = helper;
