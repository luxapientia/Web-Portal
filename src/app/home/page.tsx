"use client";

import { Box, Typography, Card, CardContent, Stack, Container, Tabs, Tab, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import TasksForToday from '@/components/home/TasksForToday';
import VipPromotions from '@/components/home/VipPromotions';
import AssetAccountValue from '@/components/home/AssetAccountValue';
import TeamContribution from '@/components/home/TeamContribution';
import MarketSentiment from '@/components/home/MarketSentiment';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Layout from "@/components/layout/Layout";
// import RewardReceiveSection from '@/components/home/RewardReceiveSection';
import TrustFundSection from '@/components/home/TrustFundSection';
import LiveActivity from '@/components/home/LiveActivity';

export default function HomePage() {
    const theme = useTheme();
    const [copied, setCopied] = useState(false);
    const [tab, setTab] = useState(0);
    const invitationLink = "https://yourapp.com/invite/aeryyeu76";
    const [loading, setLoading] = useState(true);
    const [assetValueKey, setAssetValueKey] = useState(0);
    const [vipLevelKey, setVipLevelKey] = useState(0);
    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleTabChange = (_: unknown, newValue: number) => setTab(newValue);

    const handleAccountValueChange = () => {
        setAssetValueKey(prev => prev + 1);
        setVipLevelKey(prev => prev + 1);
    };

    return (
        <Layout>
            <Container
                maxWidth="md"
                sx={{
                    py: { xs: 2, md: 4 },
                    borderRadius: 5,
                    background: `linear-gradient(135deg, rgba(140, 217, 133, 0.26) 60%, ${theme.palette.primary.light} 100%)`,
                    backdropFilter: 'blur(16px) saturate(1.2)',
                    WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
                    boxShadow: '0 8px 32px 0 rgba(165, 195, 55, 0.12)',
                    border: '1px solid rgba(231, 133, 36, 0.44)',
                }}
            >
                <Stack spacing={4}>
                    {/* VIP Promotions */}
                    <VipPromotions key={vipLevelKey} />

                    {/* Financial Overview */}
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        <AssetAccountValue key={assetValueKey} />
                        <TeamContribution
                            invitationLink={invitationLink}
                            copied={copied}
                            handleCopy={handleCopy}
                        />
                    </Stack>

                    {/* Trust Fund Section */}
                    <TrustFundSection />

                    {/* Tasks and Reward Section */}
                    <Box flex={1} minWidth={0}>
                        <Card sx={{ borderRadius: 4, boxShadow: 3, p: 0, backgroundColor: 'rgba(255, 255, 255, 0.42)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                    <RocketLaunchIcon color="primary" />
                                    <Typography variant="h5" fontWeight={700}>Your tasks for today</Typography>
                                </Stack>
                                {loading ? (
                                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                                ) : (
                                    <TasksForToday
                                        onAccountValueChange={handleAccountValueChange}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                    {/* <RewardReceiveSection /> */}

                    {/* Market Sentiment & Live Activity as Tabs */}
                    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab icon={<TrendingUpIcon />} label="Market Sentiment" />
                            <Tab icon={<LiveTvIcon />} label="Live Activity" />
                        </Tabs>
                        <CardContent>
                            {tab === 0 ? (
                                <MarketSentiment />
                            ) : (
                                <LiveActivity />
                            )}
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
        </Layout>
    );
}
