const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const { userModel } = require("../schema/userSchema");
const { toolsModel } = require("../schema/toolsSchema");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Tools Registry Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, toolId } = req.body;
    const user = await userModel.findOne({ _id: id });
    if (user) {
      if (action == "create") {
        const result = new toolsModel(req.body);
        await result.save();
        res.status(201).send({ message: "Tools Created Successfully", result });
      } else if (action == "read") {
        const result = await toolsModel.find({});
        res.status(200).send({ message: "Tools List", result });
      } else if (action == "readOne") {
        const result = await toolsModel.findOne({ _id: toolId });
        res.status(200).send({ message: "Tools List", result });
      } else if (action == "update") {
        const result = await toolsModel.findOneAndUpdate(
          { _id: toolId },
          { $set: req.body },
          { new: true }
        );
        res.status(200).send({ message: "Tools Updated Successfully", result });
      } else if (action == "delete") {
        const result = await toolsModel.findOneAndDelete({ _id: toolId });
        res.status(200).send({ message: "Tools Deleted Successfully", result });
      } else res.status(400).send({ message: "Action Does Not Exists" });
    } else res.status(400).send({ message: "User Does Not Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

module.exports = router;
