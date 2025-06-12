'use client';

import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, useTheme, TextField, MenuItem } from '@mui/material';
import Layout from '@/components/layout/Layout';
import { History as HistoryIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
    const theme = useTheme();
    const router = useRouter();
    const [filter, setFilter] = useState('all');

    // Mock data for transaction history
    const transactions = [
        {
            id: '1',
            type: 'deposit',
            amount: 1000,
            date: '2024-03-15',
            status: 'completed',
            description: 'Bank deposit',
        },
        {
            id: '2',
            type: 'withdraw',
            amount: -500,
            date: '2024-03-14',
            status: 'completed',
            description: 'ATM withdrawal',
        },
        {
            id: '3',
            type: 'transfer',
            amount: -200,
            date: '2024-03-13',
            status: 'completed',
            description: 'Transfer to John',
        },
        {
            id: '4',
            type: 'deposit',
            amount: 300,
            date: '2024-03-12',
            status: 'pending',
            description: 'Check deposit',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'deposit':
                return '#4CAF50';
            case 'withdraw':
                return '#F44336';
            case 'transfer':
                return '#2196F3';
            default:
                return theme.palette.text.primary;
        }
    };

    const filteredTransactions = transactions.filter(
        (transaction) => filter === 'all' || transaction.type === filter
    );

    return (
        <Layout>
            <Container
                maxWidth="md"
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
                            <HistoryIcon 
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
                                Transaction History
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
                                View and track all your transactions
                            </Typography>
                        </Box>

                        {/* Filter Section */}
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Filter by Type"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                sx={{
                                    maxWidth: 200,
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
                                <MenuItem value="all">All Transactions</MenuItem>
                                <MenuItem value="deposit">Deposits</MenuItem>
                                <MenuItem value="withdraw">Withdrawals</MenuItem>
                                <MenuItem value="transfer">Transfers</MenuItem>
                            </TextField>
                        </Box>

                        {/* Transactions Table */}
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 2,
                                '& .MuiTableCell-root': {
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTransactions.map((transaction) => (
                                        <TableRow
                                            key={transaction.id}
                                            sx={{
                                                transition: 'background-color 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                },
                                            }}
                                        >
                                            <TableCell>{transaction.date}</TableCell>
                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        color: getTypeColor(transaction.type),
                                                        textTransform: 'capitalize',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {transaction.type}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{transaction.description}</TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    sx={{
                                                        color: transaction.amount >= 0 ? '#4CAF50' : '#F44336',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {transaction.amount >= 0 ? '+' : ''}
                                                    ${Math.abs(transaction.amount).toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={transaction.status}
                                                    color={getStatusColor(transaction.status)}
                                                    size="small"
                                                    sx={{
                                                        textTransform: 'capitalize',
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
} 