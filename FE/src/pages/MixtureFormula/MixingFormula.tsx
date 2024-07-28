import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

// Importing Components :
import MixtureFormulaForm from "./MixtureFormulaForm";
import { PostRequest } from "../../commonFunctions/Api";
import CommonTable, { Column } from "../../commonComponents/CommonTable";
import FixedNavBar from "../../commonComponents/FixedNavBar";

function MixtureFormula() {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;
  const [batchCode, setBatchCode] = useState([]);
  const [editBatchCode, setEditBatchCode] = useState({});
  
  console.log("batchCode: ", batchCode);
  // Get Raw Material Details:
  const getBatchCodes = async () => {
    try {
      const payload = { action: "read" };
      const res = await PostRequest(token, "/mixture", payload);
      const formattedData = res.data.result.map((item: any) => {
        const chemicalMixtures = JSON.parse(item.chemicalMixture || "[]");
        return {
          ...item,
          chemicalMixture: chemicalMixtures
            .map((cm: any) => cm.chemicalMixture)
            .join(", "),
          quantity: chemicalMixtures.map((cm: any) => cm.quantity).join(", "),
        };
      });
      setBatchCode(formattedData);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      getBatchCodes();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Column Preperation:
  const columns = [
    { id: "sNo", label: "S.No", minWidth: 100 },
    { id: "batchCode", label: "Batch Code", minWidth: 100 },
    {
      id: "chemicalMixture",
      label: "Chemical Name",
      minWidth: 100,
    },
    {
      id: "quantity",
      label: "Quantity",
      minWidth: 100,
    },
    userDetails.role === "admin"
      ? {
          id: "actions",
          label: "Actions",
          minWidth: 100,
        }
      : null,
  ];

  const filteredColumns = columns.filter(
    (column) => column !== null
  ) as Column[];

  return (
    <>
      <Box>
        <FixedNavBar />
        <Box
          sx={{
            // backgroundColor: "blueviolet",
            position: "relative",
            top: "4em",
            left: "15em",
            padding: 2,
            maxWidth: `calc(100% - 15em)`,
          }}
        >
          <MixtureFormulaForm
            editData={editBatchCode}
            setData={setEditBatchCode}
            setBatchCode={setBatchCode}
          />
          <CommonTable
            columns={filteredColumns}
            rows={batchCode}
            setData={setEditBatchCode}
            updateData={setBatchCode}
            apiName="mixture"
            editId="mixtureId"
          />
        </Box>
      </Box>
    </>
  );
}

export default MixtureFormula;
