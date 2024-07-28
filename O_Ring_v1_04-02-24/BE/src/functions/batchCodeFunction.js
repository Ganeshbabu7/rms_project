const { batchNoModel } = require("../schema/batchNoSchema");

const generateBatchCode = async () => {
  try {
    // Fetch the latest document and get its batchNo
    const latestDocument = await batchNoModel.findOne(
      {},
      {},
      { sort: { batchNo: -1 } }
    );
    let batchNo = 1;

    if (latestDocument) {
      batchNo = parseInt(latestDocument.batchNo) + 1;
    }

    // Pad the batchNo with leading zeros if needed
    const paddedNumber = String(batchNo).padStart(5, "0");
    // const batchCode = `B${paddedNumber}`;
    return paddedNumber;
  } catch (error) {
    console.error("Error generating batch code:", error);
    throw new Error("Error generating batch code");
  }
};

module.exports = { generateBatchCode };
