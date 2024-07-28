import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { PostRequest } from "../../commonFunctions/Api";

// Importing Components :
import MixingForm from "./MixingForm";
import CommonTable from "../../commonComponents/CommonTable";
import FixedNavBar from "../../commonComponents/FixedNavBar";

function Mixing() {
  const token = localStorage.getItem("token");
  const [mixing, setMixing] = useState([]);
  const [editMixing, setEditMixing] = useState({});

  // Get Raw Material Deatails :
  const getRawMaterial = async () => {
    try {
      const payload = {
        action: "read",
      };
      const res = await PostRequest(token, "/mixing", payload);
      setMixing(res.data.result);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      getRawMaterial();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Column Preperation :
  const columns = [
    { id: "sNo", label: "S.No", minWidth: 100 },
    { id: "createdAt", label: "Date", minWidth: 100 },
    {
      id: "batchNo",
      label: "Batch Number",
      minWidth: 100,
    },
    {
      id: "batchCode",
      label: "Batch Code",
      minWidth: 100,
    },
    {
      id: "item",
      label: "Item",
      minWidth: 100,
    },
    {
      id: "party",
      label: "Party",
      minWidth: 100,
      // align: "left",
      // format: (value: number) => value.toFixed(2),
    },
    {
      id: "jobType",
      label: "Job Type",
      minWidth: 100,
    },
    {
      id: "totalKgs",
      label: "Total (Kgs)",
      minWidth: 100,
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 100,
    },
  ];

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
          <MixingForm
            editData={editMixing}
            setData={setEditMixing}
            setMixing={setMixing}
          />
          {mixing.length > 0 && (
            <CommonTable
              columns={columns}
              rows={mixing}
              setData={setEditMixing}
              updateData={setMixing}
              apiName="mixing"
              editId="mixingId"
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default Mixing;
