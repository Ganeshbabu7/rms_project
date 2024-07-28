const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const mysqlConnection = require("../config/mySqlConfig");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Raw Material Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, rawMaterialId, ...requestData } = req.body;

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
              "INSERT INTO rawMaterials SET ?",
              batchData,
              (err, result) => {
                if (err) {
                  console.error("Error creating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                // Fetch the last inserted record
                mysqlConnection.query(
                  "SELECT * FROM rawMaterials WHERE id = ?",
                  [result.insertId],
                  (err, rawMaterial) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(201).send({
                      message: "Raw Material Created Successfully",
                      result: rawMaterial[0],
                    });
                  }
                );
              }
            );
          } else if (action === "read") {
            // Fetch all batch records from the MySQL database
            mysqlConnection.query(
              "SELECT * FROM rawMaterials",
              (err, result) => {
                if (err) {
                  console.error("Error fetching batch list:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({ message: "Raw Material List", result });
              }
            );
          } else if (action === "readOne") {
            // Fetch a single batch record based on rawMaterialId from the MySQL database
            mysqlConnection.query(
              "SELECT * FROM rawMaterials WHERE id = ?",
              [rawMaterialId],
              (err, result) => {
                if (err) {
                  console.error("Error fetching batch details:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res
                  .status(200)
                  .send({ message: "Raw Material Details", result });
              }
            );
          } else if (action === "update") {
            // Update a batch record based on rawMaterialId in the MySQL database
            mysqlConnection.query(
              "UPDATE rawMaterials SET ? WHERE id = ?",
              [requestData, rawMaterialId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }

                // Fetch the Updated record
                mysqlConnection.query(
                  "SELECT * FROM rawMaterials WHERE id = ?",
                  [rawMaterialId],
                  (err, rawMaterial) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(200).send({
                      message: "Raw Material Updated Successfully",
                      result: rawMaterial[0],
                    });
                  }
                );
              }
            );
          } else if (action === "delete") {
            mysqlConnection.query(
              "DELETE FROM rawMaterials WHERE id = ?",
              [rawMaterialId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({
                  message: "Raw Material Deleted Successfully",
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
