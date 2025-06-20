'use client';

import { Box, Container, Typography, Paper, TextField, Button, useTheme, IconButton, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import QRCode from 'qrcode'
import toast from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import {
    AccountBalance as AccountBalanceIcon,
    ArrowBack as ArrowBackIcon,
    ContentCopy as ContentCopyIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WithdrawWalletWithoutKeys } from '@/models/WithdrawWallet';

export default function DepositPage() {
    const theme = useTheme();
    const router = useRouter();
    const [walletAddresses, setWalletAddresses] = useState<WithdrawWalletWithoutKeys[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<WithdrawWalletWithoutKeys | null>(null);
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [supportedChain_Tokens, setSupportedChain_Tokens] = useState<{ chain: string, token: string }[]>([]);
    const [selectedChain_Token, setSelectedChain_Token] = useState<{ chain: string, token: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userWalletAddress, setUserWalletAddress] = useState('');

    useEffect(() => {
        fetchWalletAddresses();
    }, []);

    useEffect(() => {
        if (!selectedWallet) setQrUrl(null);
        else {
            QRCode.toDataURL(selectedWallet.address)
                .then(url => setQrUrl(url))
                .catch(err => console.error('Error generating QR code:', err));
        }
    }, [selectedWallet]);


    const handleCopyAddress = async () => {
        if (selectedWallet?.address) {
            try {
                await navigator.clipboard.writeText(selectedWallet.address);
                setCopied(true);
                toast.success('Address copied to clipboard!');
                setTimeout(() => setCopied(false), 2000);
            } catch {
                toast.error('Failed to copy address');
            }
        }
    };

    const fetchWalletAddresses = async () => {
        try {
            const response = await fetch('/api/wallet');
            if (!response.ok) {
                toast.error('Failed to fetch wallet addresses');
                return;
            }
            const data = await response.json();
            if (data.success) {
                setWalletAddresses(data.data.walletAddresses);
                const newSupportedChain_Tokens: { chain: string, token: string }[] = [];
                data.data.supportedChains.forEach((chain: { chain: string, tokens: string[] }) => {
                    chain.tokens.forEach((token: string) => {
                        newSupportedChain_Tokens.push({ chain: chain.chain, token: token });
                    });
                });
                setSupportedChain_Tokens(newSupportedChain_Tokens);
            }
        } catch (error) {
            console.error('Error fetching wallet addresses:', error);
            toast.error('Failed to fetch wallet addresses');
        }
    }

    const handleSubmitDeposit = async () => {
        if (!selectedWallet || !transactionId.trim() || !selectedChain_Token || !userWalletAddress.trim()) {
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
                    chain: selectedChain_Token.chain,
                    token: selectedChain_Token.token,
                    transactionId: transactionId.trim(),
                    fromAddress: userWalletAddress.trim(),
                    toAddress: selectedWallet.address,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.data.error || 'Failed to submit deposit');
                return;
            }

            if (data.success) {
                toast.success('Deposit submitted successfully!');
                setIsModalOpen(false);
                setTransactionId('');
                setUserWalletAddress('');
                // router.push('/wallet/transactions');
            } else {
                toast.error(data.data.error || 'Failed to submit deposit');
            }
        } catch (error) {
            console.error('Error submitting deposit:', error);
            toast.error('Failed to submit deposit. Please try again.');
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
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 4,
                                transition: 'transform 0.2s ease',
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
                                        setSelectedWallet(walletAddresses.find(walletAddresses => walletAddresses.chain === parsed.chain) || null);
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
                            {selectedWallet && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        Deposit Address
                                    </Typography>
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
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                            }
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
                                            {selectedWallet.address}
                                        </Typography>
                                        <IconButton
                                            onClick={handleCopyAddress}
                                            size="small"
                                            sx={{
                                                backgroundColor: copied ? 'success.main' : 'rgba(255, 255, 255, 0.1)',
                                                '&:hover': {
                                                    backgroundColor: copied ? 'success.dark' : 'rgba(255, 255, 255, 0.2)',
                                                },
                                                transition: 'all 0.2s ease',
                                                color: copied ? 'white' : 'inherit'
                                            }}
                                        >
                                            {copied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
                                        </IconButton>
                                    </Paper>
                                </Box>
                            )}
                            {qrUrl && (
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                    <img src={qrUrl} alt="Deposit QR Code" />
                                </Box>
                            )}

                            {/* Deposit Button */}
                            {selectedWallet && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={() => setIsModalOpen(true)}
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
                                    Deposit
                                </Button>
                            )}

                            {selectedWallet && (
                                <Box
                                    sx={{
                                        mt: 3,
                                        px: 2,
                                        py: 2,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                        border: '1px solid rgba(255, 193, 7, 0.5)',
                                        maxWidth: 480,
                                        margin: '0 auto',
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
                                        Warning
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#5c4b00',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Please make sure to send only <strong>{selectedChain_Token?.token}</strong> using the <strong>{selectedChain_Token?.chain}</strong> network. Sending from the wrong network may result in permanent loss of funds.
                                    </Typography>
                                </Box>
                            )}

                            

                            {/* Transaction ID Modal */}
                            <Dialog
                                open={isModalOpen}
                                onClose={() => !isSubmitting && setIsModalOpen(false)}
                                maxWidth="sm"
                                fullWidth
                                PaperProps={{
                                    sx: {
                                        borderRadius: 4,
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                    },
                                }}
                            >
                                <DialogTitle
                                    sx={{
                                        pb: 0.5,
                                        textAlign: 'center',
                                        fontSize: '1.6rem',
                                        fontWeight: 700,
                                        background: 'linear-gradient(90deg, #1976D2, #2E7D32)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Submit Transaction ID
                                </DialogTitle>

                                <DialogContent sx={{ pt: 1, px: 4 }}>
                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Your Wallet Address"
                                                variant="outlined"
                                                value={userWalletAddress}
                                                onChange={(e) => setUserWalletAddress(e.target.value)}
                                                disabled={isSubmitting}
                                                placeholder={`Enter your ${selectedChain_Token?.chain} wallet address`}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                        borderRadius: 2,
                                                        fontFamily: 'monospace',
                                                    },
                                                }}
                                            />
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                sx={{ display: 'block', mt: 1, px: 0.5 }}
                                            >
                                                Enter the wallet address from which you'll send the {selectedChain_Token?.token}
                                            </Typography>
                                        </Box>

                                        <TextField
                                            fullWidth
                                            label="Transaction ID"
                                            variant="outlined"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            disabled={isSubmitting}
                                            placeholder="e.g. 0x123abc..."
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: 'block', mt: 1.5, px: 0.5 }}
                                        >
                                            Please enter the transaction ID of your deposit so we can verify it on the blockchain.
                                        </Typography>
                                    </Box>
                                </DialogContent>

                                <DialogActions
                                    sx={{
                                        px: 4,
                                        pb: 3,
                                        justifyContent: 'flex-end',
                                        gap: 2,
                                    }}
                                >
                                    <Button
                                        onClick={() => !isSubmitting && setIsModalOpen(false)}
                                        disabled={isSubmitting}
                                        variant="outlined"
                                        color="inherit"
                                        sx={{
                                            minWidth: 100,
                                            fontWeight: 500,
                                            textTransform: 'none',
                                            borderColor: '#ccc',
                                            color: '#555',
                                            '&:hover': {
                                                borderColor: '#999',
                                                backgroundColor: '#f5f5f5',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'rgba(0,0,0,0.3)',
                                                borderColor: 'rgba(0,0,0,0.2)',
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleSubmitDeposit}
                                        disabled={!transactionId.trim() || !userWalletAddress.trim() || isSubmitting}
                                        sx={{
                                            minWidth: 120,
                                            px: 3,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            backgroundColor: '#1976d2',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#1565c0',
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: '#ccc',
                                                color: '#eee',
                                            },
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress size={22} color="inherit" />
                                        ) : (
                                            'Submit'
                                        )}
                                    </Button>
                                </DialogActions>

                            </Dialog>

                        </Paper>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
} 