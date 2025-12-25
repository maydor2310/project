import React, { useState } from "react"; // comment: React + state
import { useNavigate } from "react-router-dom"; // comment: programmatic navigation
import AppBar from "@mui/material/AppBar"; // comment: top bar
import Toolbar from "@mui/material/Toolbar"; // comment: toolbar
import Typography from "@mui/material/Typography"; // comment: title
import IconButton from "@mui/material/IconButton"; // comment: icon button
import Drawer from "@mui/material/Drawer"; // comment: side drawer
import List from "@mui/material/List"; // comment: list
import ListItemButton from "@mui/material/ListItemButton"; // comment: list item button
import ListItemIcon from "@mui/material/ListItemIcon"; // comment: icon wrapper
import ListItemText from "@mui/material/ListItemText"; // comment: item text
import Box from "@mui/material/Box"; // comment: layout
import Divider from "@mui/material/Divider"; // comment: divider
import MenuIcon from "@mui/icons-material/Menu"; // comment: menu icon
import HomeIcon from "@mui/icons-material/Home"; // comment: home icon
import SchoolIcon from "@mui/icons-material/School"; // comment: courses icon
import PersonIcon from "@mui/icons-material/Person"; // comment: teachers icon
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // comment: files icon
import DescriptionIcon from "@mui/icons-material/Description"; // comment: forms icon
import HelpIcon from "@mui/icons-material/Help"; // comment: help icon
import SettingsIcon from "@mui/icons-material/Settings"; // comment: management icon

const Header: React.FC = () => { // comment: header component
  const [open, setOpen] = useState<boolean>(false); // comment: drawer state
  const navigate = useNavigate(); // comment: router navigate

  const go = (path: string): void => { // comment: navigate helper
    navigate(path); // comment: navigate
    setOpen(false); // comment: close drawer
  }; // comment: end helper

  return (
    <>
      <AppBar position="static"> {/* comment: app bar */}
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ ml: 2 }}>
            Project System
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260, p: 1 }}>
          <Typography variant="subtitle1" sx={{ p: 1 }}>
            Navigation
          </Typography>

          <Divider />

          <List>
            <ListItemButton onClick={() => go("/")}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton onClick={() => go("/courses")}>
              <ListItemIcon><SchoolIcon /></ListItemIcon>
              <ListItemText primary="Courses" />
            </ListItemButton>

            <ListItemButton onClick={() => go("/teachers")}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Teachers" />
            </ListItemButton>

            <ListItemButton onClick={() => go("/files")}>
              <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
              <ListItemText primary="Files" />
            </ListItemButton>

            <ListItemButton onClick={() => go("/management")}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Management" />
            </ListItemButton>

            <ListItemButton onClick={() => go("/help")}>
              <ListItemIcon><HelpIcon /></ListItemIcon>
              <ListItemText primary="Help" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;

