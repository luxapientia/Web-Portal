'use client';

import { Container, Typography, Box, useTheme, useMediaQuery, Paper, Tab, Tabs } from '@mui/material';
import Layout from '@/components/layout/Layout';
import DepositSection from '@/components/help/DepositSection';
import VIPLevelSection from '@/components/help/VIPLevelSection';
import TeamCommissionSection from '@/components/help/TeamCommissionSection';
import DailyTaskSection from '@/components/help/DailyTaskSection';
import AuthenticationSection from '@/components/help/AuthenticationSection';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from 'react';

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
      id={`help-tabpanel-${index}`}
      aria-labelledby={`help-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `help-tab-${index}`,
    'aria-controls': `help-tabpanel-${index}`,
  };
}

export default function HelpPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    { label: 'Authentication', icon: <LockIcon />, component: <AuthenticationSection /> },
    { label: 'Deposits', icon: <AccountBalanceWalletIcon />, component: <DepositSection /> },
    { label: 'VIP Levels', icon: <WorkspacePremiumIcon />, component: <VIPLevelSection /> },
    { label: 'Team Commission', icon: <GroupsIcon />, component: <TeamCommissionSection /> },
    { label: 'Daily Tasks', icon: <AssignmentTurnedInIcon />, component: <DailyTaskSection /> },
  ];

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
          pt: { xs: 2, sm: 4 },
          pb: { xs: 4, sm: 6 }
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Paper 
            elevation={0}
            sx={{
              p: { xs: 2, sm: 4 },
              mb: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <HelpCenterIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="h1" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Help Center
              </Typography>
              <Typography variant="body1">
                Everything you need to know about our platform and services
              </Typography>
            </Box>
          </Paper>

          {/* Tabs Navigation */}
          <Paper 
            sx={{ 
              borderRadius: 2,
              mb: 2,
              position: 'sticky',
              top: 16,
              zIndex: 10,
              boxShadow: theme.shadows[3]
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minHeight: 72,
                  py: 2
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  label={tab.label}
                  {...a11yProps(index)}
                  sx={{
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                    '& .MuiSvgIcon-root': {
                      mb: 1
                    }
                  }}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <Box sx={{ mt: 2 }}>
            {tabs.map((tab, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                {tab.component}
              </TabPanel>
            ))}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
} 