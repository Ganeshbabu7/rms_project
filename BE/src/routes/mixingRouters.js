const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const mysqlConnection = require("../config/mySqlConfig");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Mixing Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, mixingId, ...requestData } = req.body;

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
              "INSERT INTO mixing SET ?",
              batchData,
              (err, result) => {
                if (err) {
                  console.error("Error creating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                // Fetch the last inserted record
                mysqlConnection.query(
                  "SELECT * FROM mixing WHERE id = ?",
                  [result.insertId],
                  (err, mixing) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(201).send({
                      message: "Mixing Created Successfully",
                      result: mixing[0],
                    });
                  }
                );
              }
            );
          } else if (action === "read") {
            // Fetch all batch records from the MySQL database
            mysqlConnection.query("SELECT * FROM mixing", (err, result) => {
              if (err) {
                console.error("Error fetching batch list:", err);
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }
              res.status(200).send({ message: "Mixing List", result });
            });
          } else if (action === "readOne") {
            // Fetch a single batch record based on mixingId from the MySQL database
            mysqlConnection.query(
              "SELECT * FROM mixing WHERE id = ?",
              [mixingId],
              (err, result) => {
                if (err) {
                  console.error("Error fetching batch details:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({ message: "Mixing Details", result });
              }
            );
          } else if (action === "update") {
            // Update a batch record based on mixingId in the MySQL database
            mysqlConnection.query(
              "UPDATE mixing SET ? WHERE id = ?",
              [requestData, mixingId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }

                // Fetch the Updated record
                mysqlConnection.query(
                  "SELECT * FROM mixing WHERE id = ?",
                  [mixingId],
                  (err, mixing) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(200).send({
                      message: "Mixing Updated Successfully",
                      result: mixing[0],
                    });
                  }
                );
              }
            );
          } else if (action === "delete") {
            mysqlConnection.query(
              "DELETE FROM mixing WHERE id = ?",
              [mixingId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({
                  message: "Mixing Deleted Successfully",
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
