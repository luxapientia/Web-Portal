'use client';

import { Box, Container, Typography, Paper, TextField, Button, InputAdornment, MenuItem, useTheme, IconButton, Alert, Snackbar } from '@mui/material';
import Layout from '@/components/layout/Layout';
import { 
    SwapHoriz as TransferIcon, 
    ArrowBack as ArrowBackIcon,
    AccountBalance as AccountBalanceIcon,
    Loop as LoopIcon,
    Payments as PaymentsIcon,
    Receipt as ReceiptIcon,
    AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TransferPage() {
    const theme = useTheme();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [note, setNote] = useState('');
    const [transferable, setTransferable] = useState<boolean>(false);
    const [transferFee, setTransferFee] = useState<number>(0);
    const [transferableAmount, setTransferableAmount] = useState<number>(0);
    const [dailyTransferMaxLimit, setDailyTransferMaxLimit] = useState<number>(0);
    const [dailyNumOfTransferLimit, setDailyNumOfTransferLimit] = useState<number>(0);
    const [availableTransferCount, setAvailableTransferCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchTransferInfo();
    }, []);

    const fetchTransferInfo = async () => {
        try {
            const response = await fetch('/api/wallet/transfer');
            if(!response.ok) {
                toast.error('Failed to fetch transfer info');
                return;
            }
            const data = await response.json();
            if (data.success) {
                setTransferFee(data.data.transferFee);
                setDailyTransferMaxLimit(data.data.dailyTransferMaxLimit);
                setDailyNumOfTransferLimit(data.data.dailyNumOfTransferLimit);
                setAvailableTransferCount(data.data.availableTransferCount);
                setTransferable(data.data.transferable);
                setTransferableAmount(data.data.transferableAmount);
            }
        } catch (error) {
            console.error('Error fetching transfer info:', error);
            toast.error('Failed to fetch transfer info');
        }
    };

    const handleTransfer = async () => {
        if (!recipientEmail || !amount) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/wallet/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientEmail,
                    amount: parseFloat(amount),
                    note
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Transfer Successfully');
                // Clear form
                setAmount('');
                setRecipientEmail('');
                setNote('');
                fetchTransferInfo();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Transfer error:', error);
            toast.error('Transfer Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotalAmount = () => {
        if (!amount) return 0;
        const amountNum = parseFloat(amount);
        return amountNum + transferFee;
    };

    // Mock data for recent recipients
    const recentRecipients = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    ];

    return (
        <Layout>
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!success} 
                autoHideDuration={6000} 
                onClose={() => setSuccess(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>

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
                                    fullWidth
                                    label="Recipient Email"
                                    type="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
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
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Amount"
                                    variant="outlined"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            background: 'rgba(25, 118, 210, 0.1)',
                                            borderRadius: 2,
                                            border: '1px solid rgba(25, 118, 210, 0.2)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <WalletIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Available to transfer:</strong> ${transferableAmount.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <AccountBalanceIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Daily Transfer limit:</strong> ${dailyTransferMaxLimit.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <LoopIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Daily transfers remaining:</strong> {availableTransferCount} of {dailyNumOfTransferLimit}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <PaymentsIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Transfer fee:</strong> {transferFee}$
                                            </Typography>
                                        </Box>
                                        {amount && (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ReceiptIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Total amount (including fee):</strong> ${calculateTotalAmount().toFixed(2)}
                                                </Typography>
                                            </Box>
                                        )}
                                        {!transferable && (
                                            <Alert severity="warning" sx={{ mt: 2 }}>
                                                Transfers are currently disabled. You may have pending withdrawals or have reached your daily transfer limit.
                                            </Alert>
                                        )}
                                    </Paper>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                        disabled={isLoading || !amount || !recipientEmail || !transferable || calculateTotalAmount() > dailyTransferMaxLimit || calculateTotalAmount() > transferableAmount}
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
                                        {isLoading ? 'Processing...' : 
                                         !transferable ? 'Transfers Disabled' :
                                         calculateTotalAmount() > dailyTransferMaxLimit ? 'Amount Exceeds Daily Limit' :
                                         calculateTotalAmount() > transferableAmount ? 'Insufficient Balance' :
                                         'Transfer Now'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
} 