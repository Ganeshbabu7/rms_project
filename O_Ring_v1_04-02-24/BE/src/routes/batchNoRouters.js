const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const mysqlConnection = require("../config/mySqlConfig");
const { generateBatchCode } = require("../functions/batchCodeFunction");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Batch No Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, batchId, ...requestData } = req.body;

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
            const batchNo = await generateBatchCode();
            console.log("batchNo: ", batchNo);
            const batchData = { ...requestData, batchNo };

            // Insert a new batch record into the MySQL database
            mysqlConnection.query(
              "INSERT INTO batchNumbers SET ?",
              batchData,
              (err, result) => {
                if (err) {
                  console.error("Error creating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                // Fetch the last inserted record
                mysqlConnection.query(
                  "SELECT * FROM batchNumbers WHERE id = ?",
                  [result.insertId],
                  (err, batch) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(201).send({
                      message: "Batch Created Successfully",
                      result: batch[0],
                    });
                  }
                );
              }
            );
          } else if (action === "read") {
            // Fetch all batch records from the MySQL database
            mysqlConnection.query(
              "SELECT * FROM batchNumbers",
              (err, result) => {
                if (err) {
                  console.error("Error fetching batch list:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({ message: "Batch List", result });
              }
            );
          } else if (action === "readOne") {
            // Fetch a single batch record based on batchId from the MySQL database
            mysqlConnection.query(
              "SELECT * FROM batchNumbers WHERE id = ?",
              [batchId],
              (err, result) => {
                if (err) {
                  console.error("Error fetching batch details:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({ message: "Batch Details", result });
              }
            );
          } else if (action === "update") {
            // Update a batch record based on batchId in the MySQL database
            mysqlConnection.query(
              "UPDATE batchNumbers SET ? WHERE id = ?",
              [requestData, batchId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }

                // Fetch the Updated record
                mysqlConnection.query(
                  "SELECT * FROM batchNumbers WHERE id = ?",
                  [batchId],
                  (err, batch) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(200).send({
                      message: "Batch Updated Successfully",
                      result: batch[0],
                    });
                  }
                );
              }
            );
          } else if (action === "delete") {
            mysqlConnection.query(
              "DELETE FROM batchNumbers WHERE id = ?",
              [batchId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({
                  message: "Batch Deleted Successfully",
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
