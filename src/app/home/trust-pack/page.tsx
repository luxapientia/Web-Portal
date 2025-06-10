"use client";

import { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Stack, Container, useTheme, Paper, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import LockClockIcon from '@mui/icons-material/LockClock';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import VipPromotions from '@/components/home/VipPromotions';

const MotionPaper = motion(Paper);
const MotionContainer = motion(Container);

export default function TrustPackPage() {
    const theme = useTheme();
    const router = useRouter();
    const [fundValue, setFundValue] = useState<string>('0.00');
    const maxAvailable = 1200;

    const handleBack = () => {
        router.back();
    };

    const handleClose = () => {
        router.push('/home');
    };

    const handleActivate = (days: number) => {
        // TODO: Implement activation logic
        console.log(`Activating for ${days} days with value ${fundValue}`);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    return (
        <Layout>
            <MotionContainer
                maxWidth="md"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                sx={{
                    py: { xs: 2, md: 4 },
                    borderRadius: 5,
                    background: `linear-gradient(135deg, rgba(189, 207, 187, 0.38) 60%, ${theme.palette.primary.light} 100%)`,
                    backdropFilter: 'blur(16px) saturate(1.2)',
                    WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
                    boxShadow: '0 8px 32px 0 rgba(165, 195, 55, 0.12)',
                    border: '1px solid rgba(231, 133, 36, 0.44)',
                }}
            >
                {/* Header */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton 
                            onClick={handleBack}
                            sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight={600}>Home &gt; Trust Pack</Typography>
                    </Stack>
                    <IconButton 
                        onClick={handleClose}
                        sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>

                <VipPromotions />

                {/* Main Content */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" fontWeight={700} mb={2}>
                        Trust Fund Packages
                    </Typography>
                    
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3, 
                            mb: 4, 
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 3
                        }}
                    >
                        <Stack spacing={3}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                                <AttachMoneyIcon color="success" sx={{ fontSize: 32 }} />
                                <Typography variant="h5" fontWeight={600}>
                                    Max Available: <span style={{ color: '#4CAF50' }}>${maxAvailable}</span>
                                </Typography>
                            </Stack>

                            <Box>
                                <Typography variant="h6" mb={2} fontWeight={600}>
                                    Add Fund Value
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={fundValue}
                                    onChange={(e) => setFundValue(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Package Options */}
                    <Stack spacing={3}>
                        {[
                            { days: 30, reward: 0.100, rate: 0.001 },
                            { days: 60, reward: 0.200, rate: 0.001 },
                            { days: 90, reward: 0.300, rate: 0.001 }
                        ].map((option, index) => (
                            <MotionPaper
                                key={option.days}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                transition={{ delay: index * 0.1 }}
                                elevation={2}
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 3,
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    border: '1px solid rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <Stack spacing={2}>
                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                        <LockClockIcon color="primary" />
                                        <Typography variant="h6" fontWeight={600}>
                                            {option.days} Days Lock Period
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                                        <TrendingUpIcon color="success" />
                                        <Typography>
                                            {(option.rate * 100).toFixed(3)}% Daily Return
                                        </Typography>
                                    </Stack>

                                    <Box sx={{ py: 1 }}>
                                        <Typography color="text.secondary" mb={1}>
                                            Expected reward in {option.days} days
                                        </Typography>
                                        <Typography variant="h5" color="warning.main" fontWeight={700}>
                                            ${option.reward.toFixed(3)}
                                        </Typography>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handleActivate(option.days)}
                                        sx={{
                                            bgcolor: '#8BC34A',
                                            color: 'white',
                                            borderRadius: 3,
                                            py: 1.5,
                                            fontWeight: 600,
                                            '&:hover': {
                                                bgcolor: '#7CB342',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(139, 195, 74, 0.3)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        Activate {option.days}-Day Plan
                                    </Button>
                                </Stack>
                            </MotionPaper>
                        ))}
                    </Stack>
                </Box>
            </MotionContainer>
        </Layout>
    );
}
