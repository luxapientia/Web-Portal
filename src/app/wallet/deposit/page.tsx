'use client';

import { Box, Container, Typography, Paper, TextField, Button, InputAdornment, useTheme, IconButton } from '@mui/material';
import Layout from '@/components/layout/Layout';
import { AccountBalance as AccountBalanceIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
    const theme = useTheme();
    const router = useRouter();
    const [amount, setAmount] = useState('');

    const handleDeposit = () => {
        // Handle deposit logic here
        console.log('Deposit amount:', amount);
    };

    return (
        <Layout>
            <Container
                maxWidth="sm"
                sx={{
                    py: { xs: 2, md: 4 },
                    position: 'relative',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 5,
                        background: `linear-gradient(135deg, rgba(16, 137, 223, 0.42), rgba(43, 216, 193, 0.29))`,
                        backdropFilter: 'blur(20px) saturate(1.5)',
                        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.57)',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
                            zIndex: 0,
                        }
                    }}
                >
                    <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
                        <IconButton
                            onClick={() => router.push('/wallet')}
                            sx={{
                                position: 'absolute',
                                left: { xs: 1, md: 2 },
                                top: { xs: 1, md: 2 },
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                                m: { xs: 3, md: 4 }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>

                        {/* Title Section */}
                        <Box sx={{ textAlign: 'center', mb: 4, mt: { xs: 3, md: 4 } }}>
                            <AccountBalanceIcon 
                                sx={{ 
                                    fontSize: 48, 
                                    color: 'primary.main',
                                    mb: 2,
                                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                                }} 
                            />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(90deg, #1976D2, #2E7D32)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    mb: 1,
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                Deposit Funds
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary"
                                sx={{
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                    lineHeight: 1.6,
                                }}
                            >
                                Add funds to your account securely and instantly
                            </Typography>
                        </Box>

                        {/* Deposit Form */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 4,
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                }
                            }}
                        >
                            <Box
                                component="form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleDeposit();
                                }}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    label="Amount"
                                    variant="outlined"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                            }
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        },
                                        '& .MuiInputAdornment-root': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        },
                                    }}
                                />

                                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                        sx={{
                                            py: 1.5,
                                            background: 'linear-gradient(90deg, #1976D2, #2E7D32)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(90deg, #1565C0, #2E7D32)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)',
                                            }
                                        }}
                                    >
                                        Deposit Now
                                    </Button>

                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            background: 'rgba(25, 118, 210, 0.1)',
                                            borderRadius: 2,
                                            border: '1px solid rgba(25, 118, 210, 0.2)',
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            💡 <strong>Minimum deposit:</strong> $10
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ⚡ Funds will be available instantly
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
} 