'use client';

import { Box, Container, Typography, Paper, TextField, Button, InputAdornment, MenuItem, useTheme, IconButton } from '@mui/material';
import Layout from '@/components/layout/Layout';
import { SwapHoriz as TransferIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TransferPage() {
    const theme = useTheme();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [note, setNote] = useState('');

    const handleTransfer = () => {
        // Handle transfer logic here
        console.log('Transfer details:', { amount, recipient, note });
    };

    // Mock data for recent recipients
    const recentRecipients = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    ];

    return (
        <Layout>
            <Container
                maxWidth="sm"
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
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 5,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px) saturate(1.5)',
                        WebkitBackdropFilter: 'blur(10px) saturate(1.5)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
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
                            <TransferIcon 
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
                                Transfer Funds
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
                                Send money to other accounts instantly and securely
                            </Typography>
                        </Box>

                        {/* Transfer Form */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 4,
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            <Box
                                component="form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleTransfer();
                                }}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                }}
                            >
                                <TextField
                                    select
                                    fullWidth
                                    label="Recipient"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
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
                                        '& .MuiSelect-icon': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        }
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Select a recipient</em>
                                    </MenuItem>
                                    {recentRecipients.map((recipient) => (
                                        <MenuItem key={recipient.id} value={recipient.id}>
                                            {recipient.name} ({recipient.email})
                                        </MenuItem>
                                    ))}
                                </TextField>

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

                                <TextField
                                    fullWidth
                                    label="Note (Optional)"
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
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
                                        Transfer Now
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
                                            💰 <strong>Daily limit:</strong> $10,000
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ⚡ Transfers are processed instantly
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