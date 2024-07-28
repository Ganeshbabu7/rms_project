import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { PostRequest } from "../../commonFunctions/Api";

// Importing Components :
import RawMaterialForm from "./RawMaterialForm";
import CommonTable, { Column } from "../../commonComponents/CommonTable";
import FixedNavBar from "../../commonComponents/FixedNavBar";

function RawMaterial() {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  const [rawMaterials, setRawMaterials] = useState([]);
  const [editRawMaterials, setEditRawMaterials] = useState({});

  // Get Raw Material Deatails :
  const getRawMaterial = async () => {
    try {
      const payload = {
        action: "read",
      };
      const res = await PostRequest(token, "/rawMaterial", payload);
      setRawMaterials(res.data.result);
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
      id: "materialItem",
      label: "Material Name",
      minWidth: 100,
    },
    {
      id: "supplier",
      label: "Supplier",
      minWidth: 100,
    },
    {
      id: "currentQuantity",
      label: "Current Quantity (Kgs)",
      minWidth: 100,
    },
    {
      id: "thresholdQuantity",
      label: "Threshold Quantity (Kgs)",
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
          // backgroundColor: "blueviolet",
          position: "relative",
          top: "4em",
          left: "15em",
          padding: 2,
          maxWidth: `calc(100% - 15em)`,
        }}
      >
        <RawMaterialForm
          editData={editRawMaterials}
          setData={setEditRawMaterials}
          setRawMaterials={setRawMaterials}
        />
        {rawMaterials.length > 0 && (
          <CommonTable
            columns={filteredColumns}
            rows={rawMaterials}
            setData={setEditRawMaterials}
            updateData={setRawMaterials}
            apiName="rawMaterial"
            editId="rawMaterialId"
          />
        )}
      </Box>
    </Box>
  );
}

export default RawMaterial;

// import {useState} from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import CssBaseline from "@mui/material/CssBaseline";
// import Divider from "@mui/material/Divider";
// import Drawer from "@mui/material/Drawer";
// import IconButton from "@mui/material/IconButton";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import MailIcon from "@mui/icons-material/Mail";
// import MenuIcon from "@mui/icons-material/Menu";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";

// const drawerWidth = 240;

// interface Props {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * Remove this when copying and pasting into your project.
//    */
//   window?: () => Window;
// }

// export default function ResponsiveDrawer(props: Props) {
//   const { window } = props;
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const drawer = (
//     <div>
//       <Toolbar />
//       <Divider />
//       <List>
//         {[
//           "Raw Material Registry",
//           "Batch Code Registry",
//           "Mixture Formula",
//           "Mixing",
//           "Tools Registry",
//           "FAQ",
//         ].map((text, index) => (
//           <ListItem key={text} disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//               </ListItemIcon>
//               <ListItemText primary={text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   // Remove this const when copying and pasting into your project.
//   const container =
//     window !== undefined ? () => window().document.body : undefined;

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{
//           zIndex: 2,
//           width: { sm: `calc(100% - ${drawerWidth}px)`, lg: "100%" },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             Responsive drawer
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//         aria-label="mailbox folders"
//       >
//         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
//         <Drawer
//           container={container}
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile.
//           }}
//           sx={{
//             display: { xs: "block", sm: "none" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: drawerWidth,
//             },
//           }}
//         >
//           {drawer}
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", sm: "block" },
//             position: "fixed",
//             bottom: 0,
//             zIndex: 1,
//             width: { xs: 500, sm: drawerWidth },
//           }}
//           // sx={{
//           //   display: { xs: "none", sm: "block" },
//           //   "& .MuiDrawer-paper": {
//           //     boxSizing: "border-box",
//           //     width: drawerWidth,
//           //   },
//           // }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>
//     </Box>
//   );
// }
