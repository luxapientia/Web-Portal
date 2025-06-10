"use client";

import { Box, Typography, Card, CardContent, Stack, Container, Tabs, Tab, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useMotionValue, useAnimationFrame, animate } from 'framer-motion';
import TrustFundButton from '@/components/home/TrustFundButton';
import TasksForToday from '@/components/home/TasksForToday';
import VipPromotions from '@/components/home/VipPromotions';
import AssetAccountValue from '@/components/home/AssetAccountValue';
import TeamContribution from '@/components/home/TeamContribution';
import MarketSentiment from '@/components/home/MarketSentiment';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Layout from "@/components/layout/Layout";
import RewardReceiveSection from '@/components/home/RewardReceiveSection';

export default function HomePage() {
    const theme = useTheme();
    const [copied, setCopied] = useState(false);
    const [tab, setTab] = useState(0);
    const invitationCode = "aeryyeu76";
    const invitationLink = "https://yourapp.com/invite/aeryyeu76";
    const progressTarget = 71;
    const percent = useMotionValue(0);
    const [displayedPercent, setDisplayedPercent] = useState(0);
    const [pulse, setPulse] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    useEffect(() => {
        percent.set(0);
        animate(percent, progressTarget, { duration: 1.2, ease: 'easeOut' });
        setPulse(true);
        const pulseTimeout = setTimeout(() => setPulse(false), 1400);
        return () => clearTimeout(pulseTimeout);
    }, [progressTarget]);

    useAnimationFrame(() => {
        setDisplayedPercent(Math.round(percent.get()));
    });

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleTabChange = (_: any, newValue: number) => setTab(newValue);

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
                    <VipPromotions />

                    {/* Financial Overview */}
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        <AssetAccountValue />
                        <TeamContribution
                            invitationLink={invitationLink}
                            invitationCode={invitationCode}
                            copied={copied}
                            handleCopy={handleCopy}
                        />
                    </Stack>

                    {/* Invitation Section */}
                    <TrustFundButton />

                    {/* Tasks and Reward Section */}
                    <Box flex={1} minWidth={0}>
                        <Card sx={{ borderRadius: 4, boxShadow: 3, p: 0 }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                    <RocketLaunchIcon color="primary" />
                                    <Typography variant="h5" fontWeight={700}>Your tasks for today</Typography>
                                </Stack>
                                {loading ? (
                                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                                ) : (
                                    <TasksForToday
                                        displayedPercent={displayedPercent}
                                        pulse={pulse}
                                        progressTarget={progressTarget}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                    <RewardReceiveSection />

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
                                <>
                                    <Typography variant="h6" fontWeight={700} mb={2}>Live Activity</Typography>
                                    <Box
                                        sx={{
                                            mt: 1,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 2,
                                            justifyContent: { xs: 'flex-start', md: 'space-between' },
                                        }}
                                    >
                                        {[
                                            {
                                                color: 'success.main',
                                                domain: 'hs***.com',
                                                action: 'Deposited USDT 200.00',
                                                time: '3 minutes ago',
                                            },
                                            {
                                                color: 'warning.main',
                                                domain: 'gi***.online',
                                                action: 'Withdraw USDT 350.00',
                                                time: '10 minutes ago',
                                            },
                                            {
                                                color: 'info.main',
                                                domain: 'just****.sg',
                                                action: 'Deposited USD 400.00',
                                                time: '15 minutes ago',
                                            },
                                        ].map((item, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 2,
                                                    width: '100%',
                                                    boxShadow: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: item.color,
                                                        borderRadius: '50%',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="body1" fontWeight={700}>
                                                        {item.domain}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.action}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {item.time}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
        </Layout>
    );
}
