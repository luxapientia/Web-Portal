'use client';

import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  console.log(session);

  return (
    <Layout>
      {/* Welcome Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {session?.user?.name || 'Investor'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your investments and track your earnings
          </Typography>
        </Box>
      </Paper>
    </Layout>
  );
}