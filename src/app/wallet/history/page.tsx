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

interface Transaction {
    _id: string;
    transactionId: string;
    fromAddress?: string;
    toAddress?: string;
    fromUserId?: string;
    toUserId?: string;
    type: 'transfer' | 'withdraw' | 'interest_deposit' | 'trust_deposit' | 'deposit';
    amount?: number;
    amountInUSD?: number;
    token: string;
    chain: string;
    startDate: Date;
    releaseDate?: Date;
    status: 'pending' | 'success' | 'failed' | 'in_review' | 'rejected';
    remarks?: string;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

type SortField = 'createdAt' | 'amountInUSD';

export default function HistoryPage() {
    const theme = useTheme();
    const router = useRouter();
    
    // State
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [transactionIdFilter, setTransactionIdFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Fetch transactions
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/wallet/transactions?page=${page}&limit=${rowsPerPage}&status=${statusFilter}&type=${typeFilter}&transactionId=${transactionIdFilter}&sortField=${sortField}&sortOrder=${sortOrder}`
            );
            const data = await response.json();
            
            if (data.success) {
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
    }, [page, rowsPerPage, statusFilter, typeFilter, transactionIdFilter, sortField, sortOrder]);

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

    const SortableTableCell = ({ field, label }: { field: SortField, label: string }) => (
        <TableCell>
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
                onClick={() => handleSort(field)}
            >
                {label}
                {getSortIcon(field)}
            </Box>
        </TableCell>
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'success';
            case 'pending':
            case 'in_review':
                return 'warning';
            case 'failed':
            case 'rejected':
                return 'error';
            default:
                return 'default';
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

    const handleViewDetails = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setDetailsOpen(true);
    };

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, position: 'relative' }}>
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
                                    label="Transaction ID"
                                    value={transactionIdFilter}
                                    onChange={(e) => {
                                        setTransactionIdFilter(e.target.value);
                                        setPage(0);
                                    }}
                                    sx={{
                                        width: { xs: '100%', sm: 200 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        }
                                    }}
                                />
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
                                    <MenuItem value="in_review">In Review</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
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
                                                        label={transaction.status.replace('_', ' ')}
                                                        color={getStatusColor(transaction.status)}
                                                        size="small"
                                                        sx={{
                                                            textTransform: 'capitalize',
                                                            fontWeight: 500,
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
                                        label={selectedTransaction.status.replace('_', ' ')}
                                        color={getStatusColor(selectedTransaction.status)}
                                        size="small"
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: 500,
                                            mt: 0.5
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

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Date
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {format(new Date(selectedTransaction.createdAt), 'MMM dd, yyyy HH:mm')}
                                </Typography>
                            </Box>

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

                            {selectedTransaction.rejectionReason && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                                        Rejection Reason
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'error.main', mt: 0.5 }}>
                                        {selectedTransaction.rejectionReason}
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