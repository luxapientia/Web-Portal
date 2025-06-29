'use client';

import { Box, Container, Typography, Paper, Button, useTheme, IconButton, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Stack, Alert, AlertTitle, TextField } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import QRCode from 'qrcode'
import toast from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import {
    AccountBalance as AccountBalanceIcon,
    ArrowBack as ArrowBackIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CentralWalletWithoutId } from '@/models/CentralWallet';
import { Transaction } from '@/models/Transaction';
import CopyButton from '@/components/common/CopyButton';

export default function DepositPage() {
    const theme = useTheme();
    const router = useRouter();
    const [pendingDeposit, setPendingDeposit] = useState<{ wallet: CentralWalletWithoutId, transaction: Transaction } | null>(null);
    const [supportedChain_Tokens, setSupportedChain_Tokens] = useState<{ chain: string, token: string }[]>([]);
    const [selectedChain_Token, setSelectedChain_Token] = useState<{ chain: string, token: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [txid, setTxid] = useState('');

    useEffect(() => {
        fetchWalletAddresses();
    }, []);

    const fetchWalletAddresses = async () => {
        try {
            const response = await fetch('/api/wallet/deposit');
            if (!response.ok) {
                toast.error('Failed to fetch wallet addresses');
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
                setPendingDeposit(data.data.pendingDeposit);
            }
        } catch (error) {
            console.error('Error fetching wallet addresses:', error);
            toast.error('Failed to fetch wallet addresses');
        }
    }


    const handleApplyDeposit = async () => {
        if (!selectedChain_Token) {
            toast.error('Please select a chain and token');
            return;
        }

        try {
            const response = await fetch('/api/wallet/deposit/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chain: selectedChain_Token.chain,
                    token: selectedChain_Token.token
                }),
            });

            if (!response.ok) {
                toast.error('Failed to apply deposit');
                return;
            }

            const data = await response.json();

            if (data.success) {
                toast.success('Deposit applied successfully');
                fetchWalletAddresses();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error applying deposit:', error);
            toast.error('Failed to apply deposit');
        }


    }

    const handleSubmitDeposit = async () => {
        if( !pendingDeposit) {
            toast.error('No applied deposit found');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/wallet/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chain: pendingDeposit.transaction.chain,
                    token: pendingDeposit.transaction.token,
                    toAddress: pendingDeposit.wallet.address,
                    txid: txid,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.data.error || 'Failed to submit transaction');
                return;
            }

            if (data.success) {
                toast.success('Transaction details submitted successfully!');
                setTxid('');
                fetchWalletAddresses();
            } else {
                toast.error(data.data.error || 'Failed to submit transaction details');
            }
        } catch (error) {
            console.error('Error submitting transaction:', error);
            toast.error('Failed to submit transaction details. Please try again.');
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
                                <AccountBalanceIcon
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
                                    Deposit Funds
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
                                Add funds to your account securely and instantly
                            </Typography>
                        </Box>

                        {/* Deposit Form */}
                        {!pendingDeposit && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    background: pendingDeposit ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: 4,
                                    transition: 'transform 0.2s ease',
                                    opacity: pendingDeposit ? 0.6 : 1,
                                    pointerEvents: pendingDeposit ? 'none' : 'auto',
                                }}
                            >
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel id="chain-token-select-label" shrink >Select Chain & Token</InputLabel>
                                    <Select
                                        labelId="chain-token-select-label"
                                        label="Select Chain & Token"
                                        value={
                                            selectedChain_Token
                                                ? JSON.stringify(selectedChain_Token)
                                                : ''
                                        }
                                        onChange={(e) => {
                                            const parsed = JSON.parse(e.target.value);
                                            setSelectedChain_Token(parsed);
                                        }}
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                    ''
                                                );
                                            }
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

                                {/* Deposit Button */}
                                {selectedChain_Token && (
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleApplyDeposit()}
                                        startIcon={<SendIcon />}
                                        sx={{
                                            mt: 3,
                                            mb: 3,
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
                                        Apply Deposit
                                    </Button>
                                )}

                            </Paper>
                        )}

                        {pendingDeposit && (
                            <Box sx={{ mt: 3 }}>
                                {!pendingDeposit.transaction.transactionId ? (
                                    <Box>
                                        <Alert 
                                            severity="success" 
                                            sx={{ 
                                                mb: 3,
                                                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                                '& .MuiAlert-icon': {
                                                    color: '#2e7d32'
                                                }
                                            }}
                                        >
                                            <AlertTitle sx={{ color: '#2e7d32', fontWeight: 600 }}>
                                                Deposit Applied Successfully
                                            </AlertTitle>
                                            <Typography variant="body2" sx={{ color: '#1b5e20' }}>
                                                Your deposit request has been applied. Please complete your deposit by sending {pendingDeposit.transaction.amount} {pendingDeposit.transaction.token} to the address below.
                                            </Typography>
                                        </Alert>

                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                backdropFilter: 'blur(5px)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 2,
                                                mb: 3
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    flex: 1,
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.9rem',
                                                    wordBreak: 'break-all'
                                                }}
                                            >
                                                {pendingDeposit.wallet.address}
                                            </Typography>
                                            <CopyButton text={pendingDeposit.wallet.address} />
                                        </Paper>

                                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                                            <QRCodeComponent address={pendingDeposit.wallet.address} />
                                        </Box>

                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                                Enter Transaction Details
                                            </Typography>
                                            <Stack spacing={2.5}>
                                                <TextField
                                                    fullWidth
                                                    label="Transaction ID (TXID)"
                                                    value={txid}
                                                    onChange={(e) => setTxid(e.target.value)}
                                                    required
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder="Enter your transaction ID"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        }
                                                    }}
                                                />
                                                {/* <TextField
                                                    fullWidth
                                                    label="From Wallet Address"
                                                    value={fromAddress}
                                                    onChange={(e) => setFromAddress(e.target.value)}
                                                    required
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder="Enter the sender's wallet address"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        }
                                                    }}
                                                /> */}
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={handleSubmitDeposit}
                                                    disabled={isSubmitting || !txid}
                                                    sx={{
                                                        py: 1.5,
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        backgroundColor: '#1976d2',
                                                        '&:hover': {
                                                            backgroundColor: '#1565c0',
                                                        },
                                                    }}
                                                >
                                                    {isSubmitting ? (
                                                        <CircularProgress size={22} color="inherit" />
                                                    ) : (
                                                        'Submit Transaction Details'
                                                    )}
                                                </Button>
                                            </Stack>
                                        </Box>

                                        <Box
                                            sx={{
                                                mt: 3,
                                                px: 2,
                                                py: 2,
                                                borderRadius: 2,
                                                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                                border: '1px solid rgba(255, 193, 7, 0.5)',
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    mb: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontWeight: 600,
                                                    color: '#ff9800',
                                                }}
                                            >
                                                <WarningAmberIcon sx={{ fontSize: 20 }} />
                                                Important Notice
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#5c4b00',
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                • Make sure you're sending {pendingDeposit.transaction.token} on the {pendingDeposit.transaction.chain} network.<br />
                                                • Sending from the wrong network may result in permanent loss of funds.<br />
                                                • The deposit will be processed after network confirmation.
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Alert 
                                        severity="info" 
                                        sx={{ 
                                            mb: 3,
                                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                            '& .MuiAlert-icon': {
                                                color: '#1976d2'
                                            }
                                        }}
                                    >
                                        <AlertTitle sx={{ color: '#1976d2', fontWeight: 600 }}>
                                            Transaction Submitted
                                        </AlertTitle>
                                        <Typography variant="body2" sx={{ color: '#0d47a1' }}>
                                            Your transaction has been submitted and is being processed. Transaction ID: {pendingDeposit.transaction.transactionId}
                                        </Typography>
                                    </Alert>
                                )}
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
}

const QRCodeComponent = ({ address }: { address: string }) => {
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    useEffect(() => {
        if (address) {
            QRCode.toDataURL(address)
                .then(url => setQrUrl(url))
                .catch(err => console.error('Error generating QR code:', err));
        }
    }, [address]);

    if (!qrUrl) return null;

    return (
        <img
            src={qrUrl}
            alt="Wallet Address QR Code"
            style={{
                width: '120px',
                height: '120px',
            }}
        />
    );
}; 