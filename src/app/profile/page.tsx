// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Alert,
  Tab,
  Tabs,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  AccountCircle,
  Wallet,
  Stars,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { User } from '@/schemas/auth.schema';
import { 
  PersonalInfoTab, 
  WalletInfoTab,
  VIPPlanTab
} from '@/components/profile';

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
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState<Partial<User> | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize user data from auth context
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
              <Tab icon={<Wallet />} label="Withdrawal" />
              <Tab icon={<Stars />} label="VIP Plan" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {userData && (
              <PersonalInfoTab />
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <WalletInfoTab />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <VIPPlanTab />
          </TabPanel>
        </Paper>
      </Container>
    </Layout>
  );
}