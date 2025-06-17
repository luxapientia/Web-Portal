'use client';

import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import InterestMatrixTable from '@/components/admin/platform-setting/InterestMatrixTable';
import TrustPlanTable from '@/components/admin/platform-setting/TrustPlanTable';
import TransferSetting from '@/components/admin/platform-setting/TransferSetting';
import WithdrawSetting from '@/components/admin/platform-setting/WithdrawSetting';
import PromotionSetting from '@/components/admin/platform-setting/PromotionSetting';
import DomainSetting from '@/components/admin/platform-setting/DomainSetting';
import SystemWalletSetting from '@/components/admin/platform-setting/SystemWalletSetting';
import AdminLayout from '@/components/admin/AdminLayout';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`interest-tabpanel-${index}`}
            aria-labelledby={`interest-tab-${index}`}
            {...other}
            sx={{ pt: 3 }}
        >
            {value === index && children}
        </Box>
    );
}

export default function InterestSetupPage() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const tabConfig = [
        { label: "Interest Matrix", component: <InterestMatrixTable /> },
        { label: "Trust Plans", component: <TrustPlanTable /> },
        { label: "Transfer Settings", component: <TransferSetting /> },
        { label: "Withdraw Settings", component: <WithdrawSetting /> },
        { label: "Promotion Settings", component: <PromotionSetting /> },
        { label: "Domain Settings", component: <DomainSetting /> },
        { label: "System Wallets", component: <SystemWalletSetting /> },
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <Box py={4}>
                    <Typography variant="h5" fontWeight="bold" mb={3}>
                        Platform Settings
                    </Typography>
                    
                    <Box sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        width: '100%',
                        bgcolor: 'background.paper'
                    }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange}
                            aria-label="platform settings tabs"
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{
                                '& .MuiTabs-scrollButtons': {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                                '& .MuiTab-root': {
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    minWidth: { xs: 'auto', sm: 160 },
                                    px: { xs: 1, sm: 2 },
                                    minHeight: { xs: 48, sm: 56 },
                                },
                            }}
                        >
                            {tabConfig.map((tab, index) => (
                                <Tab 
                                    key={index}
                                    label={tab.label}
                                    id={`interest-tab-${index}`}
                                    aria-controls={`interest-tabpanel-${index}`}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {tabConfig.map((tab, index) => (
                        <TabPanel key={index} value={tabValue} index={index}>
                            {tab.component}
                        </TabPanel>
                    ))}
                </Box>
            </Container>
        </AdminLayout>
    );
}
