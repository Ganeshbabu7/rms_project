require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRound = 8;
const secretKey = process.env.SECRET_KEY;

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRound);
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

const hashCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const createToken = async ({ id, firstName, lastName, email, role }) => {
  let token = jwt.sign({ id, firstName, lastName, email, role }, secretKey, {
    expiresIn: "30d",
  });
  return token;
};

const createAdminToken = async ({ id, firstName, lastName, email, role }) => {
  let token = jwt.sign({ id, firstName, lastName, email, role }, secretKey, {
    expiresIn: "30d",
  });
  return token;
};

const decodeToken = (token) => {
  let data = jwt.decode(token);
  let id = data ? data.id : null;
  let role = data ? data.role : null;
  return { id, role, data };
};

const tokenValidation = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      let { id, role, data } = decodeToken(token);
      if (Math.floor(Date.now() / 1000) <= data.exp) {
        req.userId = id;
        req.role = role;
        next();
      } else res.status(401).send({ message: "Token Expired" });
    } else {
      res.status(401).send({ message: "Token Not Found" });
    }
  } catch (error) {
    console.error("Internal Server Error Token Validation:", error);
    res
      .status(500)
      .send({ message: "Internal Server Error Token Validation", error });
  }
};

const adminTokenValidation = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      let { id, role } = decodeToken(token);
      if (role === "admin") {
        if (Math.floor(Date.now() / 1000) <= data.exp) {
          req.userId = id;
          next();
        } else res.status(401).send({ message: "Token Expired" });
      } else res.status(401).send({ message: "Only Admin can access" });
    } else res.status(401).send({ message: "Token Not Found" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

module.exports = {
  hashCompare,
  hashPassword,
  createToken,
  decodeToken,
  tokenValidation,
  createAdminToken,
  adminTokenValidation,
};
