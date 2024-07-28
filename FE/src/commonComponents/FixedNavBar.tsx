import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import CssBaseline from "@mui/material/CssBaseline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepOrange } from "@mui/material/colors";

const drawerWidth = "15em";

function FixedNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            O-Ring
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Stack direction="row" spacing={2}>
              <Avatar sx={{ bgcolor: deepOrange[500] }}>
                {userDetails.firstName[0]}
              </Avatar>
            </Stack>
            <Typography variant="body1" sx={{ mx: 2 }}>
              {`${userDetails.firstName} ${userDetails.lastName}`}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                localStorage.clear();
                navigate("/v1/sign-in");
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[
              {
                text: "Raw Material Registry",
                route: "/v1/rawmaterial-registry",
              },
              { text: "Batch Code Registry", route: "/v1/batch-code-registry" },
              { text: "Mixture Formula", route: "/v1/mixture-formula" },
              { text: "Mixing", route: "/v1/mixing" },
              { text: "Tools Registry", route: "/v1/tools-registry" },
              { text: "FAQ", route: "/v1/faq" },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.route}
                  selected={location.pathname === item.route}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      ></Box> */}
    </Box>
  );
}

export default FixedNavBar;
