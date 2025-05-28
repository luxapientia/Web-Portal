'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Card, CardContent, Button } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { fetchWithAuth } from '@/lib/api';

interface UserData {
  id: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: 4,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
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
              Welcome back, {user?.fullName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your investments and track your earnings
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={logout}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </Paper>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Account Overview */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
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
          </Box>

          {/* Quick Actions */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
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
        </Box>
      </Container>
    </Box>
  );
} 