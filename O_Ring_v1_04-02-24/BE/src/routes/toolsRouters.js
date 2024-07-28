const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const mysqlConnection = require("../config/mySqlConfig");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Tools Registry Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, toolId, ...requestData } = req.body;

    // Check if the user exists in the MySQL database
    mysqlConnection.query(
      "SELECT * FROM userDetails WHERE id = ?",
      [id],
      async (err, results) => {
        if (err) {
          console.error("Error fetching user:", err);
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }

        if (results.length === 1) {
          if (action === "create") {
            const batchData = { ...requestData };

            // Insert a new batch record into the MySQL database
            mysqlConnection.query(
              "INSERT INTO tools SET ?",
              batchData,
              (err, result) => {
                if (err) {
                  console.error("Error creating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                // Fetch the last inserted record
                mysqlConnection.query(
                  "SELECT * FROM tools WHERE id = ?",
                  [result.insertId],
                  (err, tools) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(201).send({
                      message: "Tools Created Successfully",
                      result: tools[0],
                    });
                  }
                );
              }
            );
          } else if (action === "read") {
            // Fetch all batch records from the MySQL database
            mysqlConnection.query("SELECT * FROM tools", (err, result) => {
              if (err) {
                console.error("Error fetching batch list:", err);
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }
              res.status(200).send({ message: "Tools List", result });
            });
          } else if (action === "readOne") {
            // Fetch a single batch record based on toolId from the MySQL database
            mysqlConnection.query(
              "SELECT * FROM tools WHERE id = ?",
              [toolId],
              (err, result) => {
                if (err) {
                  console.error("Error fetching batch details:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({ message: "Tools Details", result });
              }
            );
          } else if (action === "update") {
            // Update a batch record based on toolId in the MySQL database
            mysqlConnection.query(
              "UPDATE tools SET ? WHERE id = ?",
              [requestData, toolId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                // Fetch the Updated record
                mysqlConnection.query(
                  "SELECT * FROM tools WHERE id = ?",
                  [toolId],
                  (err, tools) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(200).send({
                      message: "Tools Updated Successfully",
                      result: tools[0],
                    });
                  }
                );
              }
            );
          } else if (action === "delete") {
            mysqlConnection.query(
              "DELETE FROM tools WHERE id = ?",
              [toolId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({
                  message: "Tools Deleted Successfully",
                  result,
                });
              }
            );
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

module.exports = router;
