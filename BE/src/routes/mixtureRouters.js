const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const mysqlConnection = require("../config/mySqlConfig");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

/**
 * @typedef {Object} ChemicalMixture
 * @property {string} chemicalMixture
 * @property {string} quantity
 */

// Mixture Registry Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, mixtureId, ...requestData } = req.body;

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
            console.log("batchData1234: ", batchData);

            // Insert a new batch record into the MySQL database
            mysqlConnection.query(
              "INSERT INTO mixture SET ?",
              batchData,
              (err, result) => {
                if (err) {
                  console.error("Error creating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                // Fetch the last inserted record
                mysqlConnection.query(
                  "SELECT * FROM mixture WHERE id = ?",
                  [result.insertId],
                  (err, mixture) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(201).send({
                      message: "Mixture Created Successfully",
                      result: mixture[0],
                    });
                  }
                );
              }
            );
            // Parse the chemicalMixture field
            /** @type {ChemicalMixture[]} */
            const chemicalMixtures = JSON.parse(batchData.chemicalMixture);

            // Reduce Raw material quantity for each chemical mixture
            chemicalMixtures.forEach((cm) => {
              mysqlConnection.query(
                `
                UPDATE rawMaterials
                SET currentQuantity = currentQuantity - ?
                WHERE materialItem = ?;
                `,
                [cm.quantity, cm.chemicalMixture],
                (err, result) => {
                  if (err) {
                    console.error("Error updating raw_material:", err);
                    res.status(500).send({ message: "Internal Server Error" });
                    return;
                  }
                  console.log(
                    "Raw material updated successfully for",
                    cm.chemicalMixture
                  );
                  console.log("result: ", result);
                }
              );
            });
          } else if (action === "read") {
            // Fetch all batch records from the MySQL database
            mysqlConnection.query("SELECT * FROM mixture", (err, result) => {
              if (err) {
                console.error("Error fetching batch list:", err);
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }
              res.status(200).send({ message: "Mixture List", result });
            });
          } else if (action === "readOne") {
            // Fetch a single batch record based on mixtureId from the MySQL database
            mysqlConnection.query(
              "SELECT * FROM mixture WHERE id = ?",
              [mixtureId],
              (err, result) => {
                if (err) {
                  console.error("Error fetching batch details:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({ message: "Mixture Details", result });
              }
            );
          } else if (action === "update") {
            // Update a batch record based on mixtureId in the MySQL database
            mysqlConnection.query(
              "UPDATE mixture SET ? WHERE id = ?",
              [requestData, mixtureId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }

                // Fetch the Updated record
                mysqlConnection.query(
                  "SELECT * FROM mixture WHERE id = ?",
                  [mixtureId],
                  (err, mixture) => {
                    if (err) {
                      console.error("Error fetching user:", err);
                      res
                        .status(500)
                        .send({ message: "Internal Server Error" });
                      return;
                    }
                    res.status(200).send({
                      message: "Mixture Updated Successfully",
                      result: mixture[0],
                    });
                  }
                );
              }
            );
          } else if (action === "delete") {
            mysqlConnection.query(
              "DELETE FROM mixture WHERE id = ?",
              [mixtureId],
              (err, result) => {
                if (err) {
                  console.error("Error updating batch:", err);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                }
                res.status(200).send({
                  message: "Mixture Deleted Successfully",
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
