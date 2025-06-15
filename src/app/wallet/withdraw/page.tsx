'use client';

import { Box, Container, Typography, Paper, TextField, Button, InputAdornment, MenuItem, useTheme, IconButton, FormControl, InputLabel, Select, CircularProgress } from '@mui/material';
import Layout from '@/components/layout/Layout';
import { 
    MoneyOff as WithdrawIcon, 
    ArrowBack as ArrowBackIcon,
    AccountBalance as BalanceIcon,
    AccessTime as TimeIcon 
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User } from '@/models/User';

interface WithdrawalWallet {
    chain: string;
    address: string;
}

export default function WithdrawPage() {
    const theme = useTheme();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userWallets, setUserWallets] = useState<WithdrawalWallet[]>([]);
    const [supportedChain_Tokens, setSupportedChain_Tokens] = useState<{ chain: string, token: string }[]>([]);
    const [selectedChain_Token, setSelectedChain_Token] = useState<{ chain: string, token: string } | null>(null);
    const [withdrawableBalance, setWithdrawableBalance] = useState(0);

    useEffect(() => {
        fetchWithdrawWallets();
        fetchSupportedChains();
        fetchUserData();
    }, []);

    const fetchWithdrawWallets = async () => {
        try {
            const response = await fetch('/api/profile/wallet');
            if (!response.ok) {
                toast.error('Failed to fetch user data');
                return;
            }
            const data = await response.json();
            if (data.success) {
                if (data.data.withdrawalWallet) {
                    setUserWallets(data.data.withdrawalWallet);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to fetch user data');
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (!response.ok) {
                toast.error('Failed to fetch user data');
                return;
            }
            const data = await response.json();
            const userData = data as User;
            setWithdrawableBalance(userData.accountValue.totalWithdrawable);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    const fetchSupportedChains = async () => {
        try {
            const response = await fetch('/api/wallet');
            if (!response.ok) {
                toast.error('Failed to fetch supported chains');
                return;
            }
            const data = await response.json();
            if (data.success) {
                const newSupportedChain_Tokens: { chain: string, token: string }[] = [];
                data.data.supportedChains.forEach((chain: { chain: string, tokens: string[] }) => {
                    chain.tokens.forEach((token: string) => {
                        newSupportedChain_Tokens.push({ chain: chain.chain, token: token });
                    });
                });
                setSupportedChain_Tokens(newSupportedChain_Tokens);
            }
        } catch (error) {
            console.error('Error fetching supported chains:', error);
            toast.error('Failed to fetch supported chains');
        }
    };

    useEffect(() => {
        if (selectedChain_Token && userWallets.length > 0) {
            const savedWallet = userWallets.find(wallet => wallet.chain === selectedChain_Token.chain);
            if (savedWallet) {
                setWalletAddress(savedWallet.address);
            } else {
                setWalletAddress('');
            }
        }
    }, [selectedChain_Token, userWallets]);

    const handleWithdrawRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChain_Token || !amount || !walletAddress) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Check if amount is greater than balance
        if (parseFloat(amount) > withdrawableBalance) {
            toast.error('Insufficient balance');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chain: selectedChain_Token.chain,
                    token: selectedChain_Token.token,
                    amount: parseFloat(amount),
                    toAddress: walletAddress.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Withdraw request submitted successfully');
                router.push('/wallet/history');
            } else {
                toast.error(data.error || 'Failed to submit withdraw request');
            }
        } catch (error) {
            console.error('Error submitting withdrawal:', error);
            toast.error('Failed to submit withdraw request');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <Box sx={{
                            textAlign: 'center',
                            mb: 4,
                            mt: { xs: 3, md: 4 },
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
                        }}>
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
                                <WithdrawIcon
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
                                    Withdraw Funds
                                </Typography>
                            </Box>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                    mt: 2,
                                    fontSize: { xs: '0.875rem', md: '1rem' },
                                    fontWeight: 500,
                                    letterSpacing: '0.3px',
                                    lineHeight: 1.6,
                                    opacity: 0.85
                                }}
                            >
                                Withdraw your funds to your wallet address
                            </Typography>
                        </Box>

                        {/* Withdraw Form */}
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
                                onSubmit={handleWithdrawRequest}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                }}
                            >
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel id="chain-token-select-label" shrink>Select Chain & Token</InputLabel>
                                    <Select
                                        labelId="chain-token-select-label"
                                        label="Select Chain & Token"
                                        value={selectedChain_Token ? JSON.stringify(selectedChain_Token) : ''}
                                        onChange={(e) => {
                                            const parsed = JSON.parse(e.target.value);
                                            setSelectedChain_Token(parsed);
                                        }}
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) return '';
                                            const { chain, token } = JSON.parse(selected as string);
                                            return (
                                                <div>
                                                    <strong>{chain}</strong> – {token}
                                                </div>
                                            );
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 300,
                                                    borderRadius: 8,
                                                },
                                            },
                                        }}
                                    >
                                        {supportedChain_Tokens.map((ct, index) => (
                                            <MenuItem key={index} value={JSON.stringify(ct)}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 600 }}>{ct.chain}</span>
                                                    <span style={{ fontSize: 12, color: '#666' }}>{ct.token}</span>
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Amount"
                                    variant="outlined"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isSubmitting}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                $
                                            </InputAdornment>
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
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Wallet Address"
                                    variant="outlined"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    disabled={isSubmitting}
                                    placeholder={`Enter your ${selectedChain_Token?.chain || ''} wallet address`}
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
                                        }
                                    }}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={isSubmitting || !selectedChain_Token || !amount || !walletAddress}
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
                                    {isSubmitting ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Request Withdraw'
                                    )}
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <BalanceIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Withdrawable balance:</strong> ${withdrawableBalance.toFixed(2)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TimeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Processing time:</strong> 1-2 business days
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Paper>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
} 