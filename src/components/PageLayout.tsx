import React from "react"; // comment: react import
import Container from "@mui/material/Container"; // comment: page container
import Typography from "@mui/material/Typography"; // comment: title
import Box from "@mui/material/Box"; // comment: layout spacing

type Props = { // comment: props
  title?: string; // comment: optional title
  children: React.ReactNode; // comment: page content
};

const PageLayout: React.FC<Props> = ({ title, children }) => { // comment: layout component
  return (
    <Container maxWidth="lg">
      {title && (
        <Box sx={{ mt: 4, mb: 3 }}>
          <Typography variant="h4">{title}</Typography>
        </Box>
      )}

      <Box sx={{ pb: 6 }}>
        {children}
      </Box>
    </Container>
  );
};

export default PageLayout;
// REVIEW: included for peer review
