'use client';

import { Box, Container, Typography, Paper, useTheme, Stack } from '@mui/material';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import {
    AccountBalanceWallet as WalletIcon,
    Send as SendIcon,
    Download as DepositIcon,
    Upload as WithdrawIcon,
    History as HistoryIcon,
    AccountBalance as BankIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { User } from '@/models/User';

export default function WalletPage() {
    const theme = useTheme();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [doubleBubbleAmount, setDoubleBubbleAmount] = useState(0);

    useEffect(() => {
        fetchUser();
        fetchDoubleBubble();
    }, []);
    
    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (!response.ok) {
                toast.error('Failed to fetch user');
                return;
            }
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to fetch user');
        }
    };

    const fetchDoubleBubble = async () => {
        try {
            const response = await fetch('/api/account-asset');
            if (!response.ok) {
                toast.error('Failed to fetch double bubble');
                return;
            }
            const data = await response.json();
            setDoubleBubbleAmount(data.doubleBubbleAmount);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to fetch double bubble');
        }
    }

    const actions = [
        {
            title: 'Deposit',
            description: 'Add funds to your wallet',
            icon: <DepositIcon sx={{ fontSize: 32 }} />,
            color: '#4CAF50',
            path: '/wallet/deposit'
        },
        {
            title: 'Transfer',
            description: 'Send money to other users',
            icon: <SendIcon sx={{ fontSize: 32 }} />,
            color: '#2196F3',
            path: '/wallet/transfer'
        },
        {
            title: 'Withdraw',
            description: 'Withdraw funds to your bank',
            icon: <WithdrawIcon sx={{ fontSize: 32 }} />,
            color: '#FF9800',
            path: '/wallet/withdraw'
        },
        {
            title: 'History',
            description: 'View your transactions',
            icon: <HistoryIcon sx={{ fontSize: 32 }} />,
            color: '#9C27B0',
            path: '/wallet/history'
        }
    ];

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
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {/* Page Title */}
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 6,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -16,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '120px',
                                height: '4px',
                                borderRadius: '2px',
                                background: 'linear-gradient(90deg, #2196F3, #66BB6A)',
                            }
                        }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 1,
                                px: 3,
                                py: 1.5,
                                borderRadius: '40px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            <WalletIcon
                                sx={{
                                    fontSize: { xs: 32, md: 36 },
                                    color: 'primary.main',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
                                }}
                            />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                                    background: 'linear-gradient(90deg, #1976D2, #2E7D32)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    letterSpacing: '0.5px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                My Wallet
                            </Typography>
                        </Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                maxWidth: '500px',
                                margin: '0 auto',
                                mt: 2,
                                fontWeight: 500,
                                letterSpacing: '0.3px',
                                lineHeight: 1.6,
                                opacity: 0.85
                            }}
                        >
                            Manage your funds, transfers, and track your financial growth
                        </Typography>
                    </Box>

                    {/* Double Bubble Section */}
                    {doubleBubbleAmount > 0 && (
                        <Box 
                            sx={{
                                mb: 4,
                                p: 2,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.3))',
                                border: '1px solid rgba(76, 175, 80, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                textAlign: 'center'
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: 'success.main',
                                    fontWeight: 600,
                                    mb: 1
                                }}
                            >
                                Double Bubble Bonus Available!
                            </Typography>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    color: 'success.main',
                                    fontWeight: 700
                                }}
                            >
                                ${doubleBubbleAmount.toFixed(2)}
                            </Typography>
                        </Box>
                    )}

                    {/* Balance Cards Section */}
                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 2, sm: 3 },
                        mb: { xs: 3, sm: 4 },
                        flexDirection: { xs: 'column', md: 'row' },
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: { xs: -10, sm: -20 },
                            left: { xs: -10, sm: -20 },
                            right: { xs: -10, sm: -20 },
                            bottom: { xs: -10, sm: -20 },
                            background: 'linear-gradient(120deg, rgba(16, 137, 223, 0.42), rgba(43, 216, 193, 0.29))',
                            borderRadius: { xs: '20px', sm: '30px' },
                            border: '1px solid rgba(255, 255, 255, 0.57)',
                            zIndex: 0
                        }
                    }}>
                        {/* Account Balance Card */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                flex: 1,
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95), rgba(25, 118, 210, 0.95))',
                                color: 'white',
                                backdropFilter: 'blur(16px) saturate(1.8)',
                                WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
                                border: '2px solid',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                zIndex: 1,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
                                    pointerEvents: 'none'
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -50,
                                    right: -50,
                                    width: '100px',
                                    height: '100px',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                    borderRadius: '50%'
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <WalletIcon sx={{ fontSize: 32, mr: 2, opacity: 0.9 }} />
                                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 600 }}>
                                        Account Value
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                                    <Typography variant="h4" fontWeight="bold">
                                        ${user?.accountValue.totalAssetValue?.toFixed(2) || '0.00'}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ ml: 1, opacity: 0.8 }}>
                                        USD
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                                    Available for withdrawal: ${user?.accountValue.totalWithdrawable?.toFixed(2) || '0.00'}
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Trust Fund Balance Card */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                flex: 1,
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(102, 187, 106, 0.95), rgba(67, 160, 71, 0.95))',
                                color: 'white',
                                backdropFilter: 'blur(16px) saturate(1.8)',
                                WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
                                border: '2px solid',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                zIndex: 1,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
                                    pointerEvents: 'none'
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -50,
                                    right: -50,
                                    width: '100px',
                                    height: '100px',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                    borderRadius: '50%'
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <BankIcon sx={{ fontSize: 32, mr: 2, opacity: 0.9 }} />
                                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 600 }}>
                                        Trust Fund Value
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                                    <Typography variant="h4" fontWeight="bold">
                                        ${user?.accountValue.totalInTrustFund?.toFixed(2) || '0.00'}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ ml: 1, opacity: 0.8 }}>
                                        USD
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                                    Released: ${user?.accountValue.totalTrustReleased?.toFixed(2) || '0.00'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: { xs: 2, sm: 3 },
                            justifyContent: 'space-between',
                            mt: 5,
                        }}
                    >
                        {actions.map((action) => (
                            <Paper
                                key={action.title}
                                onClick={() => router.push(action.path)}
                                sx={{
                                    flex: {
                                        
                                        xs: '0 1 100%', // 1 per row on mobile
                                        md: '0 1 45%',  // 2 per row on medium screens
                                        xl: '0 1 20%'   // 4 per row on xl
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 2,
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                        '& .action-icon': {
                                            transform: 'scale(1.1)',
                                            color: (theme) => theme.palette.primary.main,
                                        },
                                        '& .action-title': {
                                            color: (theme) => theme.palette.primary.main,
                                        },
                                    },
                                    '&:active': {
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                <Stack alignItems="center" spacing={1}>
                                    <Box
                                        className="action-icon"
                                        sx={{
                                            width: { xs: 44, sm: 52 },
                                            height: { xs: 44, sm: 52 },
                                            minWidth: { xs: 44, sm: 52 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: { xs: '12px', sm: '16px' },
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(5px)',
                                            transition: 'all 0.3s ease',
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            '& > svg': {
                                                fontSize: { xs: '1.5rem', sm: '1.75rem' }
                                            }
                                        }}
                                    >
                                        {action.icon}
                                    </Box>
                                    <Box sx={{
                                        textAlign: { xs: 'left', sm: 'center' },
                                        flex: { xs: 1, sm: 'unset' }
                                    }}>
                                        <Typography
                                            variant="h6"
                                            className="action-title"
                                            sx={{
                                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                                fontWeight: 600,
                                                mb: { xs: 0.25, sm: 0.5 },
                                                transition: 'color 0.3s ease',
                                                whiteSpace: { xs: 'nowrap', sm: 'normal' }
                                            }}
                                        >
                                            {action.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                opacity: 0.8,
                                                maxWidth: { xs: '100%', sm: '180px' },
                                                margin: { xs: 0, sm: '0 auto' },
                                                display: { xs: 'none', sm: 'block' }
                                            }}
                                        >
                                            {action.description}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
}
