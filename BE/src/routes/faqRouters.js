const express = require("express");
const router = express.Router();
const { tokenValidation } = require("../auth/auth");
const mysqlConnection = require("../config/mySqlConfig");

// User or Data Collector Signup Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, faqId, ...requestData } = req.body;

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
            const faqData = { ...requestData };

            // Insert a new batch record into the MySQL database
            mysqlConnection.query(
              "INSERT INTO faq SET ?",
              faqData,
              (err, result) => {
                if (err) {
                  console.error("Error creating FAQ:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                // Fetch the last inserted record
                mysqlConnection.query(
                  "SELECT * FROM faq WHERE id = ?",
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
                      message: "FAQ Created Successfully",
                      result: batch[0],
                    });
                  }
                );
              }
            );
          } else if (action === "read") {
            // Fetch all batch records from the MySQL database
            mysqlConnection.query("SELECT * FROM faq", (err, result) => {
              if (err) {
                console.error("Error fetching batch list:", err);
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }
              res.status(200).send({ message: "FAQ List", result });
            });
          } else if (action === "readOne") {
            // Fetch a single batch record based on batchId from the MySQL database
            mysqlConnection.query(
              "SELECT * FROM faq WHERE id = ?",
              [faqId],
              (err, result) => {
                if (err) {
                  console.error("Error fetching batch details:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({ message: "FAQ Details", result });
              }
            );
          } else if (action === "update") {
            // Update a batch record based on batchId in the MySQL database
            mysqlConnection.query(
              "UPDATE faq SET ? WHERE id = ?",
              [requestData, faqId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }

                // Fetch the Updated record
                mysqlConnection.query(
                  "SELECT * FROM faq WHERE id = ?",
                  [faqId],
                  (err, faq) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(200).send({
                      message: "FAQ Updated Successfully",
                      result: faq[0],
                    });
                  }
                );
              }
            );
          } else if (action === "delete") {
            mysqlConnection.query(
              "DELETE FROM faq WHERE id = ?",
              [faqId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({
                  message: "FAQ Deleted Successfully",
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
