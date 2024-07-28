const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

// MySQL Importing :
const mysqlConnection = require("./config/mySqlConfig");

// Routers :
const faqRouters = require("./routes/faqRouters");
const loginRouters = require("./routes/loginRouters");
const toolsRouters = require("./routes/toolsRouters");
const mixingRouters = require("./routes/mixingRouters");
const mixtureRouters = require("./routes/mixtureRouters");
const batchNoRouters = require("./routes/batchNoRouters");
const rawMaterialRouters = require("./routes/rawMaterialRouters");

const app = express();

// #!/usr/bin/env node

/**
 * Module dependencies.
 */

const debug = require("debug")("api:server");
const http = require("http");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "7000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log("Server is listening :", port));
server.on("error", onError);
server.on("listening", onListening);

// MySQL Connection :
mysqlConnection.getConnection((err, connection) => {
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
  const port = parseInt(val, 10);

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

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

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
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
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
