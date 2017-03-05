const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('mailer');

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

helper.signupVerificationToken = (body)=>{
  return new Promise((fullfill,reject)=>{
    crypto.randomBytes(60,(err,buffer)=>{
      if(err) reject(err);
      else{
        body.signup_token = buffer.toString('hex');
        body.created = new Date();
        fullfill(body);
      }
    });
  });
}

helper.sendVerificationMail = (body)=>{
  return new Promise((fullfill,reject)=>{
    var ctx = {};
    ctx.from = "signup";
    ctx.to_email = body.email;
    ctx.token = body.signup_token;
    mailer(ctx,'high',4)
      .then(fullfill(body))
      .catch(reject);
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

helper.verifyUser = (body)=>{
  return new Promise((fullfill,reject)=>{
    if(body.signup_token == body.user.signup_token){
      body.user.is_active = true;
      body.user.save();
      fullfill();
    }
    else
      reject(new Error("Invalid user token"));
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

helper.isActive = (user)=>{
  return new Promise((fullfill,reject)=>{
    if(user.is_active)
      fullfill(user);
    else
      reject(new Error("NOT ACTIVE"));
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
