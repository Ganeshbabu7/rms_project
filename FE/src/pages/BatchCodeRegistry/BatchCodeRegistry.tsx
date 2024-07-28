import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Column } from "../../commonComponents/CommonTable";

// Importing Components :
import BatchCodeForm from "./BatchCodeForm";
import { PostRequest } from "../../commonFunctions/Api";
import CommonTable from "../../commonComponents/CommonTable";
import FixedNavBar from "../../commonComponents/FixedNavBar";

function BatchCodeRegistry() {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;
  const [batchCode, setBatchCode] = useState([]);
  const [editBatchCode, setEditBatchCode] = useState({});

  // Get Raw Material Deatails :
  const getBatchCodes = async () => {
    try {
      const payload = {
        action: "read",
      };
      const res = await PostRequest(token, "/batchNo", payload);
      setBatchCode(res.data.result);
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

  // Column Preperation :
  const columns = [
    { id: "sNo", label: "S.No", minWidth: 100 },
    { id: "batchNo", label: "Batch No", minWidth: 100 },
    { id: "batchCode", label: "Batch Code", minWidth: 100 },
    {
      id: "itemName",
      label: "Item Name",
      minWidth: 100,
    },
    {
      id: "quantity",
      label: "Quantity",
      minWidth: 100,
    },
    userDetails.role == "admin"
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
          <BatchCodeForm
            editData={editBatchCode}
            setData={setEditBatchCode}
            setBatchCode={setBatchCode}
          />
          <CommonTable
            columns={filteredColumns}
            rows={batchCode}
            setData={setEditBatchCode}
            updateData={setBatchCode}
            apiName="batchNo"
            editId="batchId"
          />
        </Box>
      </Box>
    </>
  );
}

export default BatchCodeRegistry;
