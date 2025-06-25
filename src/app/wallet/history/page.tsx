'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    useTheme,
    TextField,
    MenuItem,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Stack
} from '@mui/material';
import Layout from '@/components/layout/Layout';
import {
    History as HistoryIcon,
    ArrowBack as ArrowBackIcon,
    Visibility as VisibilityIcon,
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
    UnfoldMore as UnfoldMoreIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import CopyButton from '@/components/common/CopyButton';
import { format } from 'date-fns';
import { TransactionWithRef } from '@/models/Transaction';

type SortField = 'createdAt' | 'amountInUSD';

export default function HistoryPage() {
    const theme = useTheme();
    const router = useRouter();

    // State
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [transactions, setTransactions] = useState<TransactionWithRef[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithRef | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Fetch transactions
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/wallet/transactions?page=${page}&limit=${rowsPerPage}&status=${statusFilter}&type=${typeFilter}&sortField=${sortField}&sortOrder=${sortOrder}`
            );
            const data = await response.json();

            if (data.success) {
                console.log(data.data.transactions);
                setTransactions(data.data.transactions);
                setTotal(data.data.total);
            } else {
                toast.error(data.error || 'Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, rowsPerPage, statusFilter, typeFilter, sortField, sortOrder]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <UnfoldMoreIcon fontSize="small" sx={{ opacity: 0.3 }} />;
        }
        return sortOrder === 'desc' ? (
            <ArrowDownwardIcon fontSize="small" sx={{ opacity: 0.7 }} />
        ) : (
            <ArrowUpwardIcon fontSize="small" sx={{ opacity: 0.7 }} />
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return { color: 'success', bg: '#E8F5E9', textColor: '#2E7D32' };
            case 'requested':
                return { color: 'info', bg: '#E3F2FD', textColor: '#1976D2' };
            case 'approved':
                return { color: 'warning', bg: '#FFF8E1', textColor: '#ED6C02' };
            case 'rejected':
                return { color: 'error', bg: '#FFF4F4', textColor: '#D32F2F' };
            case 'pending':
                return { color: 'warning', bg: '#FFF3E0', textColor: '#ED6C02' };
            case 'failed':
                return { color: 'error', bg: '#FFEBEE', textColor: '#D32F2F' };
            default:
                return { color: 'default', bg: '#F5F5F5', textColor: '#757575' };
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'deposit':
            case 'interest_deposit':
            case 'trust_deposit':
                return '#4CAF50';
            case 'withdraw':
                return '#F44336';
            case 'transfer':
                return '#2196F3';
            default:
                return theme.palette.text.primary;
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = (transaction: TransactionWithRef) => {
        setSelectedTransaction(transaction);
        setDetailsOpen(true);
    };

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

                        {/* Title Section with Filters */}
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
                                    mb: 3
                                }}
                            >
                                View and track all your transactions
                            </Typography>

                            {/* Filters */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <TextField
                                    select
                                    label="Type"
                                    value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value);
                                        setPage(0);
                                    }}
                                    sx={{
                                        width: { xs: '100%', sm: 200 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        }
                                    }}
                                >
                                    <MenuItem value="all">All Types</MenuItem>
                                    <MenuItem value="deposit">Deposit</MenuItem>
                                    <MenuItem value="withdraw">Withdraw</MenuItem>
                                    <MenuItem value="transfer">Transfer</MenuItem>
                                </TextField>
                                <TextField
                                    select
                                    label="Status"
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(0);
                                    }}
                                    sx={{
                                        width: { xs: '100%', sm: 200 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        }
                                    }}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="success">Success</MenuItem>
                                    <MenuItem value="failed">Failed</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                    <MenuItem value="requested">Requested</MenuItem>
                                </TextField>
                            </Stack>
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
                                        <TableCell align="center">Type</TableCell>
                                        <TableCell align="center">Transaction ID</TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    cursor: 'pointer',
                                                    justifyContent: 'center',
                                                    '&:hover': {
                                                        '& .MuiSvgIcon-root': {
                                                            opacity: '1 !important'
                                                        }
                                                    }
                                                }}
                                                onClick={() => handleSort('amountInUSD')}
                                            >
                                                Amount
                                                {getSortIcon('amountInUSD')}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                <CircularProgress size={40} />
                                            </TableCell>
                                        </TableRow>
                                    ) : transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body1" color="text.secondary">
                                                    No transactions found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <TableRow
                                                key={transaction._id}
                                                sx={{
                                                    transition: 'background-color 0.2s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    },
                                                }}
                                            >
                                                <TableCell align="center">
                                                    <Typography
                                                        sx={{
                                                            color: getTypeColor(transaction.type),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {transaction.type.replace('_', ' ')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                                        <Typography
                                                            sx={{
                                                                maxWidth: 100,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}
                                                        >
                                                            {transaction.transactionId}
                                                        </Typography>
                                                        <CopyButton
                                                            text={transaction.transactionId}
                                                            size="small"
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography
                                                        sx={{
                                                            color: transaction.type.includes('withdraw') ? '#F44336' : '#4CAF50',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {transaction.type.includes('withdraw') ? '-' : '+'}
                                                        ${transaction.amountInUSD?.toFixed(2) || '0.00'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={transaction.status.toUpperCase()}
                                                        sx={{
                                                            backgroundColor: getStatusColor(transaction.status).bg,
                                                            color: getStatusColor(transaction.status).textColor,
                                                            height: '24px',
                                                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                                                            fontWeight: 500,
                                                            '&:hover': {
                                                                backgroundColor: getStatusColor(transaction.status).bg,
                                                            },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        onClick={() => handleViewDetails(transaction)}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                            },
                                                        }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                            />
                        </TableContainer>
                    </Box>
                </Paper>
            </Container>

            {/* Transaction Details Dialog */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Transaction Details
                    <IconButton
                        onClick={() => setDetailsOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedTransaction && (
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Transaction ID
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Typography variant="body1">
                                        {selectedTransaction.transactionId}
                                    </Typography>
                                    <CopyButton
                                        text={selectedTransaction.transactionId}
                                        size="small"
                                    />
                                </Box>
                            </Box>

                            <Stack direction="row" spacing={2}>
                                <Box flex={1}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Type
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: 500,
                                            mt: 0.5
                                        }}
                                    >
                                        {selectedTransaction.type.replace('_', ' ')}
                                    </Typography>
                                </Box>

                                <Box flex={1}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Chip
                                        label={selectedTransaction.status.toUpperCase()}
                                        sx={{
                                            backgroundColor: getStatusColor(selectedTransaction.status).bg,
                                            color: getStatusColor(selectedTransaction.status).textColor,
                                            height: '24px',
                                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                                            fontWeight: 500,
                                            '&:hover': {
                                                backgroundColor: getStatusColor(selectedTransaction.status).bg,
                                            },
                                        }}
                                    />
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={2}>
                                <Box flex={1}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Token Amount
                                    </Typography>
                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 500,
                                            }}
                                        >
                                            {selectedTransaction.amount?.toFixed(6) || '-'} {selectedTransaction.token}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.secondary',
                                            }}
                                        >
                                            ({selectedTransaction.chain})
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Box flex={1}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        USD Amount
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: selectedTransaction.type.includes('withdraw') ? '#F44336' : '#4CAF50',
                                            fontWeight: 500,
                                            mt: 0.5
                                        }}
                                    >
                                        {selectedTransaction.type.includes('withdraw') ? '-' : '+'}
                                        ${selectedTransaction.amountInUSD?.toFixed(2) || '0.00'}
                                    </Typography>
                                </Box>
                            </Stack>

                            {selectedTransaction.releaseDate && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Release Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {format(new Date(selectedTransaction.releaseDate), 'MMM dd, yyyy HH:mm')}
                                    </Typography>
                                </Box>
                            )}

                            {selectedTransaction.fromAddress && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        From Address
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {selectedTransaction.fromAddress}
                                        </Typography>
                                        <CopyButton
                                            text={selectedTransaction.fromAddress}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            )}

                            {selectedTransaction.toAddress && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        To Address
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {selectedTransaction.toAddress}
                                        </Typography>
                                        <CopyButton
                                            text={selectedTransaction.toAddress}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            )}

                            {selectedTransaction.fromUserId && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        From User
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {selectedTransaction.fromUserId.name} ({selectedTransaction.fromUserId.email})
                                    </Typography>
                                </Box>
                            )}

                            {selectedTransaction.toUserId && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        To User
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {selectedTransaction.toUserId.name} ({selectedTransaction.toUserId.email})
                                    </Typography>
                                </Box>
                            )}

                            {selectedTransaction.remarks && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Remarks
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {selectedTransaction.remarks}
                                    </Typography>
                                </Box>
                            )}

                            {selectedTransaction.rejectReason && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                                        Rejection Reason
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'error.main', mt: 0.5 }}>
                                        {selectedTransaction.rejectReason}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
} 