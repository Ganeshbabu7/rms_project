const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const { userModel } = require("../schema/userSchema");
const { mixingModel } = require("../schema/mixingSchema");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Mixing Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, mixingId } = req.body;
    const user = await userModel.findOne({ _id: id });
    if (user) {
      if (action == "create") {
        const result = new mixingModel(req.body);
        await result.save();
        res
          .status(201)
          .send({ message: "Mixing Created Successfully", result });
      } else if (action == "read") {
        const result = await mixingModel.find({});
        res.status(200).send({ message: "Mixing List", result });
      } else if (action == "readOne") {
        const result = await mixingModel.findOne({ _id: mixingId });
        res.status(200).send({ message: "Mixing List", result });
      } else if (action == "update") {
        const result = await mixingModel.findOneAndUpdate(
          { _id: mixingId },
          { $set: req.body },
          { new: true }
        );
        res
          .status(200)
          .send({ message: "Mixing Updated Successfully", result });
      } else if (action == "delete") {
        const result = await mixingModel.findOneAndDelete({ _id: mixingId });
        res
          .status(200)
          .send({ message: "Mixing Deleted Successfully", result });
      } else res.status(400).send({ message: "Action Does Not Exists" });
    } else res.status(400).send({ message: "User Does Not Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

module.exports = router;
