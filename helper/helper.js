var user = require('auth/models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var mailer = require('mailer');

var secret = process.env.authSecret;
var rounds = 8;

var Promise = global.promise;

var helper = {};

helper.hashPassword = function(body){
  return new Promise(function(fullfill,reject){
    bcrypt.hash(body.password,rounds,function(err,hash){
      if(err){
        reject(err);
      }
      else{
        body.password = hash;
        fullfill(body);
      }
    });
  });
};

helper.signupVerificationToken = function(body){
  return new Promise(function(fullfill,reject){
    crypto.randomBytes(60,function(err,buffer){
      if(err){
        reject(err);
      }
      else{
        body.signup_token = buffer.toString('hex');
        body.created = new Date();
        fullfill(body);
      }
    });
  });
};

helper.sendVerificationMail = function(body){
  return new Promise(function(fullfill,reject){
    var ctx = {};
    ctx.from = "signup";
    ctx.to_email = body.email;
    ctx.token = body.signup_token;
    console.log(ctx);
    mailer(ctx,'high',4)
      .then(fullfill(body))
      .catch(reject);
  });
};

helper.signup = function(body){
  return new Promise(function(fullfill,reject){
    new user(body)
      .save()
      .then(fullfill)
      .catch(reject);
  });
};

helper.getUser = function(body){
  return new Promise(function(fullfill,reject){
    user
      .findOne({email: body.email})
      .then(function(user){
        if(user === null){
          reject(new Error("No user found"));
        }
        else{
          body.user = user;
          fullfill(body);
        }
      })
      .catch(reject);
  });
};

helper.verifyUser = function(body){
  return new Promise(function(fullfill,reject){
    if(body.signup_token === body.user.signup_token){
      body.user.is_active = true;
      body.user.save();
      fullfill();
    }
    else{
      reject(new Error("Invalid user token"));
    }
  });
};

helper.validatePassword = function(body){
  return new Promise(function(fullfill,reject){
    bcrypt.compare(body.password,body.user.password,function(err,res){
      if(err || res === false){
        reject(new Error("Invalid credentials"));
      }
      else{
       fullfill(body.user.toObject());
      }
    });
  });
};

helper.isActive = function(user){
  return new Promise(function(fullfill,reject){
    if(user.is_active){
      fullfill(user);
    }
    else{
      reject(new Error("NOT ACTIVE"));
    }
  });
};

helper.genToken = function(user){
  return new Promise(function(fullfill,reject){
    try{
      var token = jwt.sign(user,secret);
      var resp = {key: token,role: user.role};
      fullfill(resp);
    }catch(ex){
      reject(ex);
    }
  });
};

module.exports = helper;
