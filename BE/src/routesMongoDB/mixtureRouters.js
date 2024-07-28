const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const { userModel } = require("../schema/userSchema");
const { mixtureModel } = require("../schema/mixtureSchema");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Mixture Registry Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, mixtureId } = req.body;
    const user = await userModel.findOne({ _id: id });
    if (user) {
      if (action == "create") {
        const result = new mixtureModel(req.body);
        await result.save();
        res
          .status(201)
          .send({ message: "Mixture Created Successfully", result });
      } else if (action == "read") {
        const result = await mixtureModel.find({});
        res.status(200).send({ message: "Mixture List", result });
      } else if (action == "readOne") {
        const result = await mixtureModel.findOne({ _id: mixtureId });
        res.status(200).send({ message: "Mixture List", result });
      } else if (action == "update") {
        const result = await mixtureModel.findOneAndUpdate(
          { _id: mixtureId },
          { $set: req.body },
          { new: true }
        );
        res
          .status(200)
          .send({ message: "Mixture Updated Successfully", result });
      } else if (action == "delete") {
        const result = await mixtureModel.findOneAndDelete({ _id: mixtureId });
        res
          .status(200)
          .send({ message: "Mixture Deleted Successfully", result });
      } else res.status(400).send({ message: "Action Does Not Exists" });
    } else res.status(400).send({ message: "User Does Not Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

module.exports = router;
