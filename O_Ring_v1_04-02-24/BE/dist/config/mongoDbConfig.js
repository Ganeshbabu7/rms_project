"use strict";

// MongoDB Configurations :
require('dotenv').config();
var mongodb = require('mongodb');
var dbUrl = process.env.MONGO_DB_URL;
var MongoClient = mongodb.MongoClient;
module.exports = {
  dbUrl: dbUrl,
  MongoClient: MongoClient
};