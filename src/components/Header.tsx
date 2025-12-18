import React, { useState } from "react"; // comment: React + state
import { useNavigate } from "react-router-dom"; // comment: programmatic navigation
import AppBar from "@mui/material/AppBar"; // comment: top app bar
import Toolbar from "@mui/material/Toolbar"; // comment: app bar layout
import Typography from "@mui/material/Typography"; // comment: text component
import IconButton from "@mui/material/IconButton"; // comment: icon button
import Drawer from "@mui/material/Drawer"; // comment: side drawer
import List from "@mui/material/List"; // comment: list container
import ListItemButton from "@mui/material/ListItemButton"; // comment: clickable list item
import ListItemIcon from "@mui/material/ListItemIcon"; // comment: icon wrapper
import ListItemText from "@mui/material/ListItemText"; // comment: text wrapper
import Box from "@mui/material/Box"; // comment: layout box
import Divider from "@mui/material/Divider"; // comment: separator
import MenuIcon from "@mui/icons-material/Menu"; // comment: hamburger icon
import HomeIcon from "@mui/icons-material/Home"; // comment: home icon
import PeopleIcon from "@mui/icons-material/People"; // comment: users icon
import SchoolIcon from "@mui/icons-material/School"; // comment: courses icon
import PersonIcon from "@mui/icons-material/Person"; // comment: teachers icon
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // comment: files icon
import HelpIcon from "@mui/icons-material/Help"; // comment: help icon
import LogoutIcon from "@mui/icons-material/Logout"; // comment: logout icon

type NavItem = { // comment: nav item type
  label: string; // comment: item label
  path: string; // comment: route path
  icon: React.ReactNode; // comment: item icon
}; // comment: end type

const drawerWidth = 280; // comment: drawer width

const Header: React.FC = () => { // comment: header component
  const navigate = useNavigate(); // comment: navigation function
  const [open, setOpen] = useState<boolean>(false); // comment: drawer state

  const navItems: NavItem[] = [ // comment: menu items
    { label: "בית", path: "/", icon: <HomeIcon /> }, // comment: home
    { label: "טפסים", path: "/forms", icon: <SchoolIcon /> }, // comment: forms
    { label: "ניהול משתמשים", path: "/management", icon: <PeopleIcon /> }, // comment: users management
    { label: "ניהול קורסים", path: "/courses", icon: <SchoolIcon /> }, // comment: courses management
    { label: "ניהול מרצים", path: "/teachers", icon: <PersonIcon /> }, // comment: teachers management
    { label: "ניהול קבצים", path: "/files", icon: <InsertDriveFileIcon /> }, // comment: files management
    { label: "עזרה", path: "/help", icon: <HelpIcon /> }, // comment: help
  ]; // comment: end items

  const handleOpen = (): void => { // comment: open drawer
    setOpen(true); // comment: open
  }; // comment: end handler

  const handleClose = (): void => { // comment: close drawer
    setOpen(false); // comment: close
  }; // comment: end handler

  const goTo = (path: string): void => { // comment: navigate and close
    navigate(path); // comment: navigate
    handleClose(); // comment: close drawer
  }; // comment: end goTo

  return ( // comment: render
    <> {/* comment: wrapper */}
      <AppBar position="sticky"> {/* comment: top bar */}
        <Toolbar> {/* comment: layout */}
          <IconButton
            edge="start" // comment: align to start
            color="inherit" // comment: inherit color
            aria-label="open navigation drawer" // comment: accessibility
            onClick={handleOpen} // comment: open drawer
            sx={{ mr: 2 }} // comment: spacing
          >
            <MenuIcon /> {/* comment: menu icon */}
          </IconButton>

          <Typography
            variant="h6" // comment: title size
            component="div" // comment: render element
            onClick={() => navigate("/")} // comment: title goes home
            sx={{ cursor: "pointer", userSelect: "none" }} // comment: clickable style
          >
            Course Management System {/* comment: app title */}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left" // comment: left side drawer
        open={open} // comment: controlled open state
        onClose={handleClose} // comment: close on backdrop / ESC
      >
        <Box sx={{ width: drawerWidth }} role="presentation"> {/* comment: drawer layout */}
          <Typography variant="h6" sx={{ p: 2 }}> {/* comment: drawer title */}
            תפריט ניווט
          </Typography>

          <Divider /> {/* comment: separator */}

          <List> {/* comment: menu list */}
            {navItems.map((item) => ( // comment: render items
              <ListItemButton key={item.path} onClick={() => goTo(item.path)}> {/* comment: navigate */}
                <ListItemIcon>{item.icon}</ListItemIcon> {/* comment: icon */}
                <ListItemText primary={item.label} /> {/* comment: text */}
              </ListItemButton>
            ))} {/* comment: end map */}
          </List>

          <Divider /> {/* comment: separator */}

          <List> {/* comment: bottom actions */}
            <ListItemButton onClick={() => goTo("/login")}> {/* comment: logout route */}
              <ListItemIcon><LogoutIcon /></ListItemIcon> {/* comment: icon */}
              <ListItemText primary="יציאה" /> {/* comment: label */}
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </> // comment: end wrapper
  ); // comment: end return
}; // comment: end component

export default Header; // comment: export
