'use client';

import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import InterestMatrixTable from '@/components/admin/interest-setup/InterestMatrixTable';
import TrustPlanTable from '@/components/admin/interest-setup/TrustPlanTable';
import FeeSetting from '@/components/admin/interest-setup/FeeSetting';
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
                                label="Platform Fees" 
                                id="interest-tab-2"
                                aria-controls="interest-tabpanel-2"
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
                        <FeeSetting />
                    </TabPanel>
                </Box>
            </Container>
        </AdminLayout>
    );
}
