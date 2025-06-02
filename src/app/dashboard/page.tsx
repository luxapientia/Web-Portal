'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { fetchWithAuth } from '@/lib/api';
import Layout from '@/components/layout/Layout';

interface UserData {
  id: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetchWithAuth('/api/auth/me', { requireAuth: true });
        if (response) {
          const data = await response.json();
          setUserData(data.user);
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

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        {/* Account Overview */}
        <Card sx={{ flex: 1, height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Overview
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {userData?.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Role:</strong> {userData?.role}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Account ID:</strong> {userData?.id}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ flex: 1, height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2, mb: 2 }}
              >
                View Investment Plans
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 2, mb: 2 }}
              >
                Make a Deposit
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ borderRadius: 2 }}
              >
                View Transaction History
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Recent Activity */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              No recent activity to display
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Layout>
  );
}