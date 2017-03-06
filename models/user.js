var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {type: String , required: true},
  password: {type: String, required: true},
  username: {type: String},
  role: {type: String, default: "user"},
  is_active: {type: Boolean, default: false},
  signup_token: {type: String},
  created: {type: Date}
});

module.exports = mongoose.model('user',userSchema);
