// MongoDB Configurations :
require('dotenv').config();
const mongodb = require('mongodb')
const dbUrl = process.env.MONGO_DB_URL
const MongoClient = mongodb.MongoClient

module.exports = {dbUrl,MongoClient}