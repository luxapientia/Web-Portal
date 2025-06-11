"use client";

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Stack,
    Container,
    useTheme,
    Paper,
    InputAdornment,
    Chip,
    Tooltip,
    useMediaQuery,
    Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PercentIcon from '@mui/icons-material/Percent';
import StarIcon from '@mui/icons-material/Star';
import CalculateIcon from '@mui/icons-material/Calculate';  
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import VipPromotions from '@/components/home/VipPromotions';
import { TrustPlan } from '@/models/TrustPlan';

const MotionPaper = motion(Paper);
const MotionContainer = motion(Container);

export default function TrustPackPage() {
    const theme = useTheme();
    const router = useRouter();
    const [trustPlans, setTrustPlans] = useState<TrustPlan[]>([]);
    const [fundValue, setFundValue] = useState<string>('0.00');
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [availableFunds, setAvailableFunds] = useState<number>(0);

    useEffect(() => {
        fetchTrustPlans();
        fetchTrustFunds();
    }, []);

    const fetchTrustPlans = async () => {
        try {
            const response = await fetch('/api/trust-fund/plans');
            if (!response.ok) {
                toast.error('Failed to fetch trust plans');
                setTrustPlans([]);
                return;
            }
            const data = await response.json();
            if (data.success) {
                setTrustPlans(data.data);
            }
        } catch (error) {
            console.error('Error fetching trust plans:', error);
            toast.error('Error fetching trust plans');
            setTrustPlans([]);
        }
    };

    const fetchTrustFunds = async () => {
        try {
            const response = await fetch('/api/trust-fund');
            if (!response.ok) {
                toast.error('Failed to fetch trust funds');
                setAvailableFunds(0);
                return;
            }
            const data = await response.json();
            if (data.success) {
                setAvailableFunds(100);
            }
        } catch (error) {
            console.error('Error fetching trust funds:', error);
            toast.error('Error fetching trust funds');
            setAvailableFunds(0);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleClose = () => {
        router.push('/home');
    };

    const handleFundValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = parseFloat(value);

        if (value === '') {
            setFundValue('');
            setError('');
            return;
        }

        if (isNaN(numValue)) {
            setError('Please enter a valid number');
            return;
        }

        if (numValue > availableFunds) {
            setError(`Maximum available fund is $${availableFunds}`);
        } else if (numValue <= 0) {
            setError('Fund value must be greater than 0');
        } else {
            setError('');
        }

        setFundValue(value);
    };

    const calculateDailyReward = (dailyInterestRate: number): number => {
        const value = parseFloat(fundValue) || 0;
        return (value * dailyInterestRate) / 100;
    };

    const handleActivate = async (index: number) => {
        const value = parseFloat(fundValue);
        if (isNaN(value) || value <= 0) {
            toast.error('Please enter a valid fund value');
            return;
        }

        if (value > availableFunds) {
            toast.error(`Maximum available fund is $${availableFunds}`);
            return;
        }

        setSelectedPlan(index);

        try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/trust-fund/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: trustPlans[index].id,
                    fundValue: value
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to activate plan');
            }

            toast.success('Trust fund plan activated successfully!');
            // Optionally redirect to dashboard or refresh data
        } catch (error) {
            console.error('Error activating plan:', error);
            toast.error('Failed to activate plan. Please try again.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.02,
            boxShadow: '0 8px 32px 0 rgba(165, 195, 55, 0.2)',
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
                    py: { xs: 2, md: 3 },
                    px: { xs: 2, md: 3 },
                    borderRadius: 5,
                    background: `linear-gradient(135deg, 
                        rgba(23, 32, 42, 0.95) 0%,
                        rgba(44, 62, 80, 0.85) 50%,
                        rgba(52, 152, 219, 0.75) 100%)`,
                    backdropFilter: 'blur(20px) saturate(1.8)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}
            >
                {/* Header */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={4}
                    sx={{
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        gap: 2
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                            onClick={handleBack}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(8px)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography
                            variant={isMobile ? "subtitle1" : "h6"}
                            fontWeight={600}
                            sx={{
                                background: 'linear-gradient(45deg, #1a237e, #4CAF50)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            Trust Pack
                        </Typography>
                    </Stack>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>

                <VipPromotions />

                {/* Main Content */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant={isMobile ? "h5" : "h4"}
                        fontWeight={700}
                        mb={3}
                        sx={{
                            background: 'linear-gradient(45deg, #1a237e, #4CAF50)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textAlign: 'center',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '3px',
                                background: 'linear-gradient(45deg, #1a237e, #4CAF50)',
                                borderRadius: '2px',
                            }
                        }}
                    >
                        Trust Fund Packages
                    </Typography>

                    <MotionPaper
                        elevation={0}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        sx={{
                            p: { xs: 2, md: 3 },
                            mb: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 3,
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        <Stack spacing={3}>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems="center"
                                justifyContent="center"
                                spacing={2}
                            >
                                <Chip
                                    icon={<AttachMoneyIcon />}
                                    label={`Max Available: $${availableFunds}`}
                                    color="success"
                                    sx={{
                                        fontSize: '1.1rem',
                                        py: 2,
                                        bgcolor: 'rgba(76, 175, 79, 0.89)',
                                        '& .MuiChip-icon': { fontSize: '1.5rem' }
                                    }}
                                />
                            </Stack>

                            <Box>
                                <Typography
                                    variant="h6"
                                    mb={2}
                                    fontWeight={600}
                                    color="text.secondary"
                                >
                                    Add Fund Value
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={fundValue}
                                    onChange={handleFundValueChange}
                                    error={!!error}
                                    helperText={error}
                                    placeholder="Enter fund value"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title="Calculate potential rewards">
                                                    <CalculateIcon color="action" />
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            bgcolor: 'white',
                                            '&:hover': {
                                                '& fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </Stack>
                    </MotionPaper>

                    {/* Package Options */}
                    <Stack spacing={2}>
                        <AnimatePresence>
                            {trustPlans.map((plan: TrustPlan, index: number) => {
                                const dailyReward = calculateDailyReward(plan.dailyInterestRate);
                                const totalReward = dailyReward * plan.duration;
                                
                                return (
                                    <MotionPaper
                                        key={index}
                                        elevation={0}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        variants={cardVariants}
                                        sx={{
                                            p: { xs: 2, md: 2.5 },
                                            bgcolor: selectedPlan === index 
                                                ? 'rgba(52, 152, 219, 0.15)' 
                                                : 'rgba(236, 240, 241, 0.1)',
                                            borderRadius: 3,
                                            border: selectedPlan === index 
                                                ? '2px solid rgba(52, 152, 219, 0.8)'
                                                : '1px solid rgba(255, 255, 255, 0.2)',
                                            transition: 'all 0.3s ease-in-out',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: { xs: 'column', md: 'row' },
                                            alignItems: { xs: 'stretch', md: 'center' },
                                            gap: { xs: 2, md: 3 },
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                            '&:hover': {
                                                bgcolor: 'rgba(52, 152, 219, 0.2)',
                                                border: '1px solid rgba(52, 152, 219, 0.4)',
                                                boxShadow: '0 8px 32px 0 rgba(52, 152, 219, 0.15)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: 'linear-gradient(90deg, rgba(23, 32, 42, 0.8), rgba(52, 152, 219, 0.8))',
                                                opacity: selectedPlan === index ? 1 : 0,
                                                transition: 'opacity 0.3s ease-in-out',
                                            }
                                        }}
                                    >
                                        {index === 0 && (
                                            <Chip
                                                icon={<StarIcon />}
                                                label="RECOMMENDED"
                                                color="primary"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    bgcolor: 'rgba(50, 176, 207, 0.15)',
                                                    backdropFilter: 'blur(4px)',
                                                    border: '1px solid rgba(50, 176, 207, 0.3)',
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    '& .MuiChip-icon': {
                                                        color: 'rgba(50, 176, 207, 0.9)',
                                                    }
                                                }}
                                            />
                                        )}

                                        {/* Plan Info Section */}
                                        <Box sx={{ 
                                            flex: 1,
                                            minWidth: { xs: '100%', md: '30%' },
                                            textAlign: { xs: 'center', md: 'left' }
                                        }}>
                                            <Typography 
                                                variant="h6"
                                                fontWeight={600}
                                                color="rgba(255, 255, 255, 0.95)"
                                                gutterBottom
                                                sx={{
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                }}
                                            >
                                                {plan.name}
                                            </Typography>
                                            <Stack 
                                                direction={{ xs: 'row', md: 'column' }} 
                                                spacing={1}
                                                justifyContent={{ xs: 'center', md: 'flex-start' }}
                                                alignItems={{ xs: 'center', md: 'flex-start' }}
                                            >
                                                <Chip
                                                    icon={<AccessTimeIcon />}
                                                    label={`${plan.duration} days`}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ 
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        '& .MuiChip-icon': {
                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                        }
                                                    }}
                                                />
                                                <Chip
                                                    icon={<PercentIcon />}
                                                    label={`${plan.dailyInterestRate}% daily`}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ 
                                                        background: 'rgba(50, 176, 207, 0.1)',
                                                        border: '1px solid rgba(50, 176, 207, 0.3)',
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        '& .MuiChip-icon': {
                                                            color: 'rgba(50, 176, 207, 0.9)',
                                                        }
                                                    }}
                                                />
                                            </Stack>
                                        </Box>

                                        {/* Returns Section */}
                                        <Box sx={{ 
                                            flex: 2,
                                            display: 'flex',
                                            flexDirection: { xs: 'column', md: 'row' },
                                            alignItems: 'center',
                                            gap: 2,
                                            borderLeft: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.1)' },
                                            borderTop: { xs: '1px solid rgba(255, 255, 255, 0.1)', md: 'none' },
                                            pl: { xs: 0, md: 3 },
                                            pt: { xs: 2, md: 0 }
                                        }}>
                                            <Box sx={{ flex: 1, textAlign: 'center' }}>
                                                <Typography variant="overline" color="rgba(255, 255, 255, 0.7)">
                                                    Total Return
                                                </Typography>
                                                <Typography 
                                                    variant="h5" 
                                                    color="rgba(50, 176, 207, 0.9)"
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    }}
                                                >
                                                    {(plan.dailyInterestRate * plan.duration).toFixed(1)}%
                                                </Typography>
                                                {parseFloat(fundValue) > 0 && (
                                                    <Typography variant="body2" color="rgba(255, 255, 255, 0.9)">
                                                        ${totalReward.toFixed(2)}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {parseFloat(fundValue) > 0 && (
                                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                                    <Typography variant="overline" color="rgba(255, 255, 255, 0.7)">
                                                        Daily Reward
                                                    </Typography>
                                                    <Typography 
                                                        variant="h5" 
                                                        color="rgba(50, 176, 207, 0.9)"
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        }}
                                                    >
                                                        ${dailyReward.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Button
                                                variant="contained"
                                                onClick={() => handleActivate(index)}
                                                disabled={!!error || !fundValue || parseFloat(fundValue) <= 0}
                                                sx={{
                                                    minWidth: 120,
                                                    borderRadius: 2,
                                                    py: 1,
                                                    px: 3,
                                                    textTransform: 'none',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    boxShadow: 'none',
                                                    background: 'linear-gradient(135deg, rgba(37, 38, 89, 0.9), rgba(50, 176, 207, 0.9))',
                                                    color: 'rgba(255, 255, 255, 0.95)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    backdropFilter: 'blur(4px)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, rgba(37, 38, 89, 1), rgba(50, 176, 207, 1))',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                    '&:disabled': {
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        color: 'rgba(255, 255, 255, 0.3)',
                                                    },
                                                    transition: 'all 0.3s ease-in-out',
                                                }}
                                            >
                                                Activate Plan
                                            </Button>
                                        </Box>
                                    </MotionPaper>
                                );
                            })}
                        </AnimatePresence>
                    </Stack>
                </Box>
            </MotionContainer>
        </Layout>
    );
}
