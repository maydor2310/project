import React, { useEffect, useState } from "react";
import { Box, Button, Divider, LinearProgress, Stack } from "@mui/material";
import PageLayout from "../components/PageLayout";
import UserForm from "../components/UserForm";
import UsersTable from "../components/UsersTable";

const Forms: React.FC = () => {
  const [refreshFlag, setRefreshFlag] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleSaved = (): void => {
    setIsRefreshing(true); // comment: start loader
    setRefreshFlag((x) => x + 1); // comment: trigger table remount
  };

  useEffect(() => {
    if (isRefreshing) {
      const timer = window.setTimeout(() => {
        setIsRefreshing(false); // comment: stop loader
      }, 600); // comment: small UX delay for visibility
      return () => window.clearTimeout(timer);
    }
    return;
  }, [isRefreshing]);

  return (
    <PageLayout title="ניהול משתמשים">
      {isRefreshing && <LinearProgress sx={{ mb: 2 }} />}

      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" href="#form">
            Go to Form
          </Button>
          <Button variant="outlined" href="#table">
            Go to Table
          </Button>
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
