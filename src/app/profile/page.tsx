'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  Chip,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Stack
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  AccountCircle,
  Security,
  Wallet,
  PhotoCamera,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { fetchWithAuth } from '@/lib/api';
import Layout from '@/components/layout/Layout';
import VerificationCard from '@/components/profile/VerificationCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idPassport: ''
  });
  const [walletData, setWalletData] = useState({
    walletType: '',
    walletId: ''
  });
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize form data from user context
  useEffect(() => {
    if (user) {
        console.log(user)
      // Set form data from user context
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        idPassport: user.idPassport || ''
      });
      
      // Set wallet data if available
      if (user.withdrawalWallet) {
        setWalletData({
          walletType: user.withdrawalWallet.type || '',
          walletId: user.withdrawalWallet.id || ''
        });
      }
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWalletData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset form data to current user data when entering edit mode
      if (user) {
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          idPassport: user.idPassport || ''
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchWithAuth('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          withdrawalWallet: walletData.walletType && walletData.walletId ? walletData : undefined
        }),
        requireAuth: true
      });

      if (response) {
        const data = await response.json();
        if (data.success) {
          setMessage({ text: 'Profile updated successfully!', severity: 'success' });
          setOpenSnackbar(true);
          setEditMode(false);
          
          // Update auth context with new user data
          if (user && data.user) {
            login(localStorage.getItem('token') || '', data.user);
          }
        } else {
          throw new Error(data.error || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: 'Failed to update profile. Please try again.', 
        severity: 'error' 
      });
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getStatusColor = (status: string | undefined) => {
    if (status === 'active') return 'success';
    if (status === 'suspended') return 'error';
    return 'warning';
  };

  const handleEmailVerification = () => {
    setMessage({ text: 'Verification email sent!', severity: 'info' });
    setOpenSnackbar(true);
  };

  const handlePhoneVerification = () => {
    setMessage({ text: 'Verification SMS sent!', severity: 'info' });
    setOpenSnackbar(true);
  };

  if (!user) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please log in to view your profile.
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme => theme.shadows[3]
          }}
        >
          {/* Header with background */}
          <Box 
            sx={{ 
              p: { xs: 2, md: 3 }, 
              background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: 'white',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="500">
              My Profile
            </Typography>
            <Button
              variant={editMode ? "outlined" : "contained"}
              color={editMode ? "inherit" : "primary"}
              startIcon={editMode ? <CancelIcon /> : <EditIcon />}
              onClick={handleEditToggle}
              disabled={loading}
              sx={{ 
                color: editMode ? 'white' : 'inherit',
                borderColor: editMode ? 'white' : 'inherit'
              }}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              variant={isMobile ? "fullWidth" : "standard"}
              centered={!isMobile}
              sx={{ 
                '& .MuiTab-root': { 
                  minHeight: { xs: '48px', md: '64px' },
                  fontSize: { xs: '0.8rem', md: '0.9rem' }
                }
              }}
            >
              <Tab icon={<AccountCircle />} label="Personal Info" />
              <Tab icon={<Security />} label="Verification" />
              <Tab icon={<Wallet />} label="Withdrawal" />
            </Tabs>
          </Box>

          <form onSubmit={handleSubmit}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3
              }}>
                {/* Left column - Avatar and status */}
                <Box sx={{ 
                  width: { xs: '100%', md: '30%' },
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{ 
                        width: { xs: 100, md: 140 }, 
                        height: { xs: 100, md: 140 }, 
                        mb: 1,
                        boxShadow: 2
                      }}
                      alt={user.fullName}
                      src="/placeholder-avatar.jpg"
                    />
                    {editMode && (
                      <IconButton 
                        sx={{ 
                          position: 'absolute', 
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          }
                        }}
                        aria-label="upload picture"
                        component="label"
                      >
                        <input hidden accept="image/*" type="file" />
                        <PhotoCamera />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="500">
                    {user.fullName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={user.role?.toUpperCase() || 'USER'} 
                      color={user.role === 'admin' ? 'secondary' : 'primary'} 
                      size="small" 
                      sx={{ fontWeight: 500 }}
                    />
                    <Chip 
                      label={user.status?.toUpperCase() || 'PENDING'} 
                      color={getStatusColor(user.status)} 
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </Box>
                
                {/* Right column - Form fields */}
                <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                  <Card sx={{ boxShadow: 1 }}>
                    <CardHeader 
                      title="Personal Information" 
                      titleTypographyProps={{ variant: 'h6', fontWeight: 500 }}
                    />
                    <CardContent>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          disabled={!editMode || loading}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2
                        }}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!editMode || loading}
                            required
                            variant="outlined"
                            InputProps={{
                              sx: { borderRadius: 1 }
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!editMode || loading}
                            required
                            variant="outlined"
                            InputProps={{
                              sx: { borderRadius: 1 }
                            }}
                          />
                        </Box>
                        
                        <TextField
                          fullWidth
                          label="ID/Passport Number"
                          name="idPassport"
                          value={formData.idPassport}
                          onChange={handleInputChange}
                          disabled={!editMode || loading}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3
              }}>
                <Box sx={{ 
                  width: { xs: '100%', md: '33.33%' }
                }}>
                  <VerificationCard
                    title="Email Verification"
                    isVerified={user.isEmailVerified}
                    value={user.email}
                    verifyAction={handleEmailVerification}
                  />
                </Box>

                <Box sx={{ 
                  width: { xs: '100%', md: '33.33%' }
                }}>
                  <VerificationCard
                    title="Phone Verification"
                    isVerified={user.isPhoneVerified}
                    value={user.phone}
                    verifyAction={handlePhoneVerification}
                  />
                </Box>

                <Box sx={{ 
                  width: { xs: '100%', md: '33.33%' }
                }}>
                  <VerificationCard
                    title="ID Verification"
                    isVerified={user.isIdVerified}
                    value={user.idPassport}
                    verifyButtonText="Upload Documents"
                    verifyButtonLink="/verification/id"
                  />
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3
              }}>
                <Box sx={{ 
                  width: { xs: '100%', md: '50%' }
                }}>
                  <Card sx={{ boxShadow: 1 }}>
                    <CardHeader 
                      title="Withdrawal Wallet" 
                      titleTypographyProps={{ variant: 'h6', fontWeight: 500 }}
                    />
                    <CardContent>
                      <Stack spacing={2}>
                        <TextField
                          select
                          fullWidth
                          label="Wallet Type"
                          name="walletType"
                          value={walletData.walletType}
                          onChange={handleWalletChange}
                          disabled={!editMode || loading}
                          SelectProps={{
                            native: true,
                          }}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        >
                          <option value=""></option>
                          <option value="crypto">USDT(Ethereum), USDT(Tron)</option>
                        </TextField>
                        <TextField
                          fullWidth
                          label="Wallet ID / Account Number"
                          name="walletId"
                          value={walletData.walletId}
                          onChange={handleWalletChange}
                          disabled={!editMode || loading}
                          helperText="Enter your wallet address, bank account, or mobile money number"
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ 
                  width: { xs: '100%', md: '50%' }
                }}>
                  <Card sx={{ boxShadow: 1 }}>
                    <CardHeader 
                      title="Withdrawal Information" 
                      titleTypographyProps={{ variant: 'h6', fontWeight: 500 }}
                    />
                    <CardContent>
                      <Typography variant="body2" paragraph>
                        Set up your withdrawal wallet to receive payments and withdrawals from your account.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Make sure to provide accurate information to avoid delays in processing your withdrawals.
                      </Typography>
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Your withdrawal wallet information will be verified before you can make withdrawals.
                      </Alert>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </TabPanel>

            {editMode && (
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                display: 'flex', 
                justifyContent: 'flex-end',
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </form>
        </Paper>
      </Container>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={message.severity as 'success' | 'error' | 'info' | 'warning'} 
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Layout>
  );
}