'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { fetchWithAuth } from '@/lib/api';
import Layout from '@/components/layout/Layout';


export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetchWithAuth('/api/auth/me', { requireAuth: true });
        if (response) {
          // const data = await response.json();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
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
            Welcome back, {user?.fullName || user?.fullName || 'Investor'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your investments and track your earnings
          </Typography>
        </Box>
      </Paper>
    </Layout>
  );
}