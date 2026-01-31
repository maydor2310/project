import React from "react";
import PageLayout from "../components/PageLayout";
import { Box, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";

const Help: React.FC = () => {
  return (
    <PageLayout title="Help">
      <Typography variant="body1" sx={{ mb: 3 }}>
        This system is a frontend project for managing courses, teachers, users and course files.
        All data is saved locally in your browser using LocalStorage.
      </Typography>

      <Typography variant="h6" sx={{ mb: 1 }}>
        What you can do in the system
      </Typography>

      <List>
        <ListItem>
          <ListItemText
            primary="Home"
            secondary="Shows a short summary: number of courses, teachers and files, with quick actions."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Courses"
            secondary="Add, edit and search courses by name or code."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Teachers"
            secondary="Manage teachers list and assign teachers to courses."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Course Files"
            secondary="Upload files to a selected course, view files and delete files."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="User Management"
            secondary="Create users, validate inputs and view saved users in a table."
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Notes & Limitations
      </Typography>

      <Box sx={{ pl: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Data is stored in LocalStorage (client-side only). Clearing browser data will remove everything.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • File uploads are stored as Base64 (Data URL), so large files are restricted.
        </Typography>
        <Typography variant="body2">
          • This project does not include a backend, authentication, or server database.
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Troubleshooting
      </Typography>

      <List>
        <ListItem>
          <ListItemText
            primary="My data disappeared"
            secondary="You probably cleared browser storage or used Incognito mode. LocalStorage is not permanent across all environments."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Files do not upload"
            secondary="The file may be too large for LocalStorage. Try a smaller file."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Page not found (404) on refresh"
            secondary="If you deployed to GitHub Pages, make sure your routing is configured correctly for SPA."
          />
        </ListItem>
      </List>
    </PageLayout>
  );
};

export default Help;
// REVIEW: included for peer review
