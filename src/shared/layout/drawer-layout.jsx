import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  getToken,
  getUser,
  isNotEmpty,
  getPermission,
  getRole
} from './../../utility';
import LOGO from "../../assets/Buenavista-sm.png";
import { BiEdit, BiBell, BiBarChartAlt2, BiInfoCircle, BiUser, BiWallet } from "react-icons/bi";
const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window, content, onLogout } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const url = useLocation();


  const user = getUser();
  let drawerItems = [
    { caption: "Dashboard", icon: () => <BiBarChartAlt2 className="mr-2 text-2xl" />, href: "dashboard" },
    { caption: "User Management", icon: () => <BiUser className="mr-2 text-2xl" />, href: "user-management" },
    { caption: "Profile Management", icon: () => <BiEdit className="mr-2 text-2xl" />, href: "profiling" },
    { caption: "Payments Management", icon: () => <BiWallet className="mr-2 text-2xl" />, href: "payments" },
    { caption: "Notification", icon: () => <BiBell className="mr-2 text-2xl" />, href: "notification" },
    { caption: "Reports", icon: () => <BiBarChartAlt2 className="mr-2 text-2xl" />, href: "reports" },
    { caption: "Logs", icon: () => <BiInfoCircle className="mr-2 text-2xl" />, href: "logs" },
  ];

  if (user.accountType === "treasurer") {
    drawerItems = [
      { caption: "Profile Management", icon: () => <BiEdit className="mr-2 text-2xl" />, href: "profiling" },
      { caption: "Payments", icon: () => <BiWallet className="mr-2 text-2xl" />, href: "payments" },
      { caption: "Notification", icon: () => <BiBell className="mr-2 text-2xl" />, href: "notification" },
      { caption: "Reports", icon: () => <BiBarChartAlt2 className="mr-2 text-2xl" />, href: "reports" },
    ];
  }

  if (user.accountType === "enterprise") {
    drawerItems = [
      { caption: "Profile Management", icon: () => <BiEdit className="mr-2 text-2xl" />, href: "profiling" },
      // Uncomment the following lines if needed
      // { caption: "Notification", icon: () => <BiBell className="mr-2 text-2xl" />, href: "notification" },
      // { caption: "Reports", icon: () => <BiBarChartAlt2 className="mr-2 text-2xl" />, href: "reports" },
    ];
  }


  if (user.accountType === "guest") {
    drawerItems = [
      { caption: "Profile Management", icon: () => <BiEdit className="mr-2 text-2xl" />, href: "profiling" },
      // Uncomment the following lines if needed
      // { caption: "Notification", icon: () => <BiBell className="mr-2 text-2xl" />, href: "notification" },
      // { caption: "Reports", icon: () => <BiBarChartAlt2 className="mr-2 text-2xl" />, href: "reports" },
    ];
  }

  //enterprise

  const [activeItem, setActiveItem] = React.useState(drawerItems[0]?.href || "");

  const handleItemClick = (href) => {
    setActiveItem(href); // Update active item
  };

  const location = useLocation();

  const drawer = (
    <div className="flex flex-col h-full bg-slate-800 shadow-lg rounded-r-lg text-white">
      {/* Centered Logo with white background and larger size */}


      <div className="flex justify-center items-center bg-white rounded-full w-20 h-20 mt-8 mb-6 mx-auto">
        <img src={LOGO} alt="Logo" className="w-16 h-16" />
      </div>
      <div className="flex flex-col justify-center items-center mx-auto mb-4">
        <div className="text-xl font-semibold">
          Hi {user.firstName} {user.lastName}
        </div>
        <div className="mt-2 px-4 py-1 text-white bg-blue-500 rounded-full text-sm">
          {user.role} {/* Assuming 'role' is a string, like 'Admin' or 'User' */}
        </div>
      </div>
      <Divider />

      <List className="space-y-1 text-white">
        {drawerItems.map((item) => {
          const isActive = location.pathname.includes(item.href); // Check if the current path includes the item's href
          return <div key={item.caption} className="flex items-center">
            <a
              onClick={() => handleItemClick(item.href)}
              href={item.href}
              className={`flex items-center rounded-lg px-4 py-2 mx-2  transition w-full
                duration-300 ease-in-out transform hover:scale-105 ${isActive ? "bg-slate-600" : ""
                }`}
            >
              {/* Render Icon */}
              {item.icon && item.icon()}
              <span className="ml-2 font-medium">{item.caption}</span>
            </a>
          </div>

        })}
      </List>

    </div>
  );


  let navbartext = url.pathname.split("/").pop();

  if (navbartext === 'profiling') {
    navbartext = 'Profile Management'
  }

  if (navbartext === 'payments') {
    navbartext = 'Payments Management'
  }

  return (
    <Box className="flex">
      <CssBaseline />
      <AppBar
        position="fixed"
        className="bg-white shadow-md border-b border-gray-200 z-10 "
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="flex justify-between px-4">
          <Typography variant="h6" className="text-white-800 font-bold first-letter:uppercase">
            {navbartext}
          </Typography>
          <button
            onClick={onLogout}
            className="bg-blue-500 text-white border-2 border-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Logout
          </button >
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          className="bg-white shadow-lg"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        className="flex-grow p-8 bg-gray-50"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <div className="shadow-xl rounded-lg p-6 bg-white">
          {content}
        </div>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
  content: PropTypes.node,
  onLogout: PropTypes.func.isRequired,
};

export default ResponsiveDrawer;
