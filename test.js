const express = require('express');
const mongoose = require('mongoose');
const parser   = require('body-parser');

process.env.authSecret = "testSecret";
process.env.rounds = 8;

mongoose.connect('mongodb://localhost/test');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();

app.use(parser.json());

app.use("/user",require('./routes.js'));

app.listen(3000);
