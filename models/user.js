const mongoose = require('mongoose');
require('mongoose-type-email');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {type: mongoose.SchemaTypes.Email, required: true},
  password: {type: String, required: true},
  username: {type: String},
  role: {type: String, default: "user"},
  is_active: {type: Boolean, default: false},
  created: {type: Date}
});

module.exports = mongoose.model('user',userSchema);
