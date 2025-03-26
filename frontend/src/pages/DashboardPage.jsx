import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import BlogList from '../components/blog/BlogList';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Box padding={3} >
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.email}
      </Typography>
      <BlogList />
    </Box>
  );
};

export default DashboardPage;