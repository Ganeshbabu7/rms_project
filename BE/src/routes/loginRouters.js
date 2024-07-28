const express = require("express");
const router = express.Router();
const {
  createToken,
  hashCompare,
  hashPassword,
  tokenValidation,
} = require("../auth/auth");
const mysqlConnection = require("../config/mySqlConfig");

// User or Data Collector Signup Router :
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if email already exists in MySQL database
    mysqlConnection.query(
      "SELECT * FROM userDetails WHERE email = ?",
      email,
      async (err, results) => {
        if (err) {
          console.error("Error checking email:", err);
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }

        if (results.length === 0) {
          // Email does not exist, proceed to create user
          const hashedPassword = await hashPassword(password);
          const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            role: role,
          };

          mysqlConnection.query(
            "INSERT INTO userDetails SET ?",
            userData,
            (err, result) => {
              if (err) {
                console.error("Error creating user:", err);
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }

              // Fetch the last inserted record
              mysqlConnection.query(
                "SELECT * FROM userDetails WHERE id = ?",
                result.insertId,
                (err, user) => {
                  if (err) {
                    console.error("Error fetching user:", err);
                    res.status(500).send({ message: "Internal Server Error" });
                    return;
                  }
                  res.status(201).send({
                    message: "User Created Successfully",
                    result: user[0],
                  });
                }
              );
            }
          );
        } else {
          res.status(400).send({ message: "Email Already Exists" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// User or Data Collector Login Router :
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with provided email exists in MySQL database
    mysqlConnection.query(
      "SELECT * FROM userDetails WHERE email = ?",
      email,
      async (err, results) => {
        if (err) {
          console.error("Error checking email:", err);
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }

        if (results.length === 1) {
          const user = results[0];

          // Compare hashed password from database with input password
          if (await hashCompare(password, user.password)) {
            const token = await createToken({
              id: user.id, // Assuming the primary key column is named 'id'
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            });
            res.status(200).send({
              message: "Login Successful",
              token,
              result: user,
            });
          } else {
            res.status(400).send({ message: "Invalid Credentials" });
          }
        } else {
          res.status(400).send({ message: "User Does Not Exists" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

// Forgot Password :
router.post("/forgetPassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if user with provided email exists in MySQL database
    mysqlConnection.query(
      "SELECT * FROM userDetails WHERE email = ?",
      email,
      async (err, results) => {
        if (err) {
          console.error("Error checking email:", err);
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }

        if (results.length === 1) {
          const user = results[0];
          const hash = await hashPassword(newPassword);

          // Update user's password in MySQL database
          mysqlConnection.query(
            "UPDATE userDetails SET password = ? WHERE email = ?",
            [hash, email],
            (err, result) => {
              if (err) {
                console.error("Error updating password:", err);
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }
              res.status(200).send({
                message: "Password Reset Successful",
                result,
              });
            }
          );
        } else {
          res.status(400).send({ message: "User Does Not Exists" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

// User or Data Collector Details Router :
router.post("/userDetails", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;

    // Check user details in MySQL database using the provided ID
    mysqlConnection.query(
      "SELECT * FROM userDetails WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error fetching user details:", err);
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }

        if (results.length === 1) {
          const user = results[0];
          res.status(200).send({ message: "User Details", result: user });
        } else {
          res.status(400).send({ message: "User Does Not Exist" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

module.exports = router;
