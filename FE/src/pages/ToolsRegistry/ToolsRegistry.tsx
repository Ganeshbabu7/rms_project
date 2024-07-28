import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
// Importing Components :
import ToolRegistryForm from "./ToolRegistryForm";
import CommonTable, { Column } from "../../commonComponents/CommonTable";
import FixedNavBar from "../../commonComponents/FixedNavBar";
import { PostRequest } from "../../commonFunctions/Api";

function ToolsRegistry() {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  const [tools, setTools] = useState([]);
  const [editTools, setEditTools] = useState({});

  // Get Tools Deatails :
  const getTools = async () => {
    try {
      const payload = {
        action: "read",
      };
      const res = await PostRequest(token, "/tools", payload);
      setTools(res.data.result);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      getTools();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const columns = [
    { id: "sNo", label: "S.No", minWidth: 100 },
    { id: "createdAt", label: "Date", minWidth: 100 },
    {
      id: "materialItem",
      label: "Tool Name",
      minWidth: 100,
    },
    {
      id: "currentQuantity",
      label: "Current Quantity",
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
    <Box>
      <FixedNavBar />
      <Box
        sx={{
          position: "relative",
          top: "4em",
          left: "15em",
          padding: 2,
          maxWidth: `calc(100% - 15em)`,
        }}
      >
        <ToolRegistryForm
          editData={editTools}
          setData={setEditTools}
          setRawMaterials={setTools}
        />
        <CommonTable
          columns={filteredColumns}
          rows={tools}
          setData={setEditTools}
          updateData={setTools}
          apiName="tools"
          editId="toolId"
        />
      </Box>
    </Box>
  );
}

export default ToolsRegistry;
