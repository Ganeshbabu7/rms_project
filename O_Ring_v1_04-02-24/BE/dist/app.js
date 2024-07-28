"use strict";

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

// MySQL Importing :
var mysqlConnection = require("./config/mySqlConfig");

// Routers :
var faqRouters = require("./routes/faqRouters");
var loginRouters = require("./routes/loginRouters");
var toolsRouters = require("./routes/toolsRouters");
var mixingRouters = require("./routes/mixingRouters");
var mixtureRouters = require("./routes/mixtureRouters");
var batchNoRouters = require("./routes/batchNoRouters");
var rawMaterialRouters = require("./routes/rawMaterialRouters");
var app = express();

// #!/usr/bin/env node

/**
 * Module dependencies.
 */

var debug = require("debug")("api:server");
var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "7000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function () {
  return console.log("Server is listening :", port);
});
server.on("error", onError);
server.on("listening", onListening);

// MySQL Connection :
mysqlConnection.getConnection(function (err, connection) {
  if (err) {
    console.error("Error acquiring MySQL connection:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // Release the connection back to the pool when done
  connection.release();
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, "public")));
app.use(cors());
app.use("/api/v1/", loginRouters);
app.use("/api/v1/faq", faqRouters);
app.use("/api/v1/tools/", toolsRouters);
app.use("/api/v1/mixing/", mixingRouters);
app.use("/api/v1/mixture/", mixtureRouters);
app.use("/api/v1/batchNo/", batchNoRouters);
app.use("/api/v1/rawMaterial/", rawMaterialRouters);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;