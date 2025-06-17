'use client';

import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import InterestMatrixTable from '@/components/admin/platform-setting/InterestMatrixTable';
import TrustPlanTable from '@/components/admin/platform-setting/TrustPlanTable';
import TransferSetting from '@/components/admin/platform-setting/TransferSetting';
import WithdrawSetting from '@/components/admin/platform-setting/WithdrawSetting';
import PromotionSetting from '@/components/admin/platform-setting/PromotionSetting';
import DomainSetting from '@/components/admin/platform-setting/DomainSetting';
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

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <Box py={4}>
                    <Typography variant="h5" fontWeight="bold" mb={3}>
                        Platform Settings
                    </Typography>
                    
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange}
                            aria-label="platform settings tabs"
                        >
                            <Tab 
                                label="Interest Matrix" 
                                id="interest-tab-0"
                                aria-controls="interest-tabpanel-0"
                            />
                            <Tab 
                                label="Trust Plans" 
                                id="interest-tab-1"
                                aria-controls="interest-tabpanel-1"
                            />
                            <Tab 
                                label="Transfer Settings" 
                                id="interest-tab-2"
                                aria-controls="interest-tabpanel-2"
                            />
                            <Tab 
                                label="Withdraw Settings" 
                                id="interest-tab-3"
                                aria-controls="interest-tabpanel-3"
                            />
                            <Tab 
                                label="Promotion Settings" 
                                id="interest-tab-4"
                                aria-controls="interest-tabpanel-4"
                            />
                            <Tab 
                                label="Domain Settings" 
                                id="interest-tab-5"
                                aria-controls="interest-tabpanel-5"
                            />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <InterestMatrixTable />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <TrustPlanTable />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <TransferSetting />
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <WithdrawSetting />
                    </TabPanel>
                    <TabPanel value={tabValue} index={4}>
                        <PromotionSetting />
                    </TabPanel>
                    <TabPanel value={tabValue} index={5}>
                        <DomainSetting />
                    </TabPanel>
                </Box>
            </Container>
        </AdminLayout>
    );
}
