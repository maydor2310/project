import React, { useState } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import PageLayout from "../components/PageLayout";
import UserForm from "../components/UserForm";
import UsersTable from "../components/UsersTable";

const Forms: React.FC = () => {
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  const handleSaved = (): void => {
    setRefreshFlag((x) => x + 1);
  };

  return (
    <PageLayout title="ניהול משתמשים">
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" href="#form">Go to Form</Button>
          <Button variant="outlined" href="#table">Go to Table</Button>
        </Stack>

        <Box id="form">
          <UserForm onSaved={handleSaved} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box id="table">
          <UsersTable key={refreshFlag} />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default Forms;
