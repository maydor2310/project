import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import HelpIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { ThemeModeContext } from "../context/ThemeModeContext";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const { mode, toggleTheme } = useContext(ThemeModeContext);
  const { user, loading, logout } = useAuth();

  const go = (path: string): void => {
    navigate(path);
    setOpen(false);
  };

  const onLogout = async (): Promise<void> => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  const onLogin = (): void => {
    setOpen(false);
    navigate("/login");
  };

  const isLoggedIn = Boolean(user);

  return (
    <>
      <AppBar position="static">
        {loading ? <LinearProgress /> : null}
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
            Project System
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            {isLoggedIn ? (
              <>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user?.email}
                </Typography>
                <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => void onLogout()}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" startIcon={<LoginIcon />} onClick={onLogin} disabled={loading}>
                Login
              </Button>
            )}

            <IconButton color="inherit" aria-label="toggle theme" onClick={toggleTheme}>
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Stack>
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
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>

            {isLoggedIn ? (
              <>
                <ListItemButton onClick={() => go("/courses")}>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText primary="Courses" />
                </ListItemButton>

                <ListItemButton onClick={() => go("/teachers")}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Teachers" />
                </ListItemButton>

                <ListItemButton onClick={() => go("/files")}>
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText primary="Files" />
                </ListItemButton>

                <ListItemButton onClick={() => go("/forms")}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Users Management" />
                </ListItemButton>
              </>
            ) : null}

            <ListItemButton onClick={() => go("/help")}>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {isLoggedIn ? (
              <ListItemButton onClick={() => void onLogout()}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            ) : (
              <ListItemButton onClick={onLogin} disabled={loading}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
