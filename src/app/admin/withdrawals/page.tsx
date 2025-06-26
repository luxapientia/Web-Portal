'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Popover,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    Button,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import CopyButton from '@/components/common/CopyButton';
import { TransactionWithRef } from '@/models/Transaction';

interface FilterState {
    transactionId: string;
    status: string;
    startDate: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
    field: keyof TransactionWithRef | '';
    direction: SortDirection;
}

interface PaginatedResponse {
    data: TransactionWithRef[];
    total: number;
    page: number;
    limit: number;
}

export default function WithdrawalsPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState<FilterState>({
        transactionId: '',
        status: 'all',
        startDate: '',
    });
    const [sort, setSort] = useState<SortState>({
        field: '',
        direction: null,
    });
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [filterField, setFilterField] = useState<keyof FilterState | null>(null);
    const [transactions, setTransactions] = useState<TransactionWithRef[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<TransactionWithRef | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [transactionIdInput, setTransactionIdInput] = useState('');
    const [confirmationError, setConfirmationError] = useState('');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectError, setRejectError] = useState('');
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, [page, rowsPerPage, filters, sort]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);

            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: rowsPerPage.toString(),
                ...(filters.transactionId && { transactionId: filters.transactionId }),
                ...(filters.status !== 'all' && { status: filters.status }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(sort.field && sort.direction && {
                    sortBy: sort.field,
                    sortOrder: sort.direction
                }),
            });

            const response = await fetch(`/api/admin/withdrawals?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            if (data.success) {
                const paginatedData = data.data as PaginatedResponse;
                setTransactions(paginatedData.data);
                setTotal(paginatedData.total);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Fetching transactions error:', error);
            setTransactions([]);
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>, field: keyof FilterState) => {
        setFilterAnchorEl(event.currentTarget);
        setFilterField(field);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
        setFilterField(null);
    };

    const handleFilterChange = (value: string) => {
        if (filterField) {
            setFilters(prev => ({
                ...prev,
                [filterField]: value
            }));
            setPage(0);
        }
    };

    const handleSort = (field: keyof TransactionWithRef) => {
        setSort(prev => ({
            field,
            direction:
                prev.field === field
                    ? prev.direction === 'asc'
                        ? 'desc'
                        : prev.direction === 'desc'
                            ? null
                            : 'asc'
                    : 'asc'
        }));
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

    const renderSortIcon = (field: keyof TransactionWithRef) => {
        if (sort.field !== field) return null;
        return sort.direction === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    };

    const renderFilterContent = () => {
        if (!filterField) return null;

        if (filterField === 'status') {
            return (
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="requested">Requested</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="success">Success</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
            );
        }

        return (
            <TextField
                sx={{ m: 1, minWidth: 120 }}
                label={filterField.charAt(0).toUpperCase() + filterField.slice(1)}
                value={filters[filterField]}
                onChange={(e) => handleFilterChange(e.target.value)}
            />
        );
    };

    // const formatAddress = (address: string) => {
    //     return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
    // };

    const handleViewDetails = (tx: TransactionWithRef) => {
        setSelectedWithdrawal(tx);
        setDetailsDialogOpen(true);
    };

    const handleDetailsClose = () => {
        setDetailsDialogOpen(false);
        setSelectedWithdrawal(null);
    };

    const handleApproveClick = () => {
        if (!selectedWithdrawal) return;
        setTransactionIdInput('');
        setConfirmationError('');
        setConfirmDialogOpen(true);
    };

    const handleConfirmApprove = async () => {
        try {
            if (!selectedWithdrawal) return;

            if (!transactionIdInput.trim()) {
                setConfirmationError('Please enter the transaction ID');
                return;
            }

            setApproveLoading(true);
            const response = await fetch('/api/admin/withdrawals/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: selectedWithdrawal._id, transactionId: transactionIdInput.trim() }),
            });

            if (!response.ok) {
                toast.error('Failed to approve withdrawal');
                return;
            }

            const data = await response.json();
            if (data.success) {
                toast.success('Withdrawal approved successfully');
                fetchTransactions();
                setDetailsDialogOpen(false);
                setConfirmDialogOpen(false);
                setTransactionIdInput('');
                setConfirmationError('');
            } else {
                toast.error('Failed to approve withdrawal');
            }
        } catch (error) {
            console.error('Error approving withdrawal:', error);
            toast.error('Failed to approve withdrawal');
        } finally {
            setApproveLoading(false);
        }
    };

    const handleRejectClick = () => {
        if (!selectedWithdrawal) return;
        setRejectReason('');
        setRejectError('');
        setRejectDialogOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!selectedWithdrawal) return;

        if (!rejectReason.trim()) {
            setRejectError('Please enter the reason for rejection');
            return;
        }

        try {
            setRejectLoading(true);
            const response = await fetch('/api/admin/withdrawals/reject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: selectedWithdrawal._id, 
                    reason: rejectReason.trim() 
                }),
            });

            if (!response.ok) {
                toast.error('Failed to reject withdrawal');
                return;
            }

            const data = await response.json();
            if (data.success) {
                toast.success('Withdrawal rejected successfully');
                fetchTransactions();
                setRejectDialogOpen(false);
                setDetailsDialogOpen(false);
                setRejectReason('');
                setRejectError('');
            } else {
                toast.error('Failed to reject withdrawal');
            }
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
            toast.error('Failed to reject withdrawal');
        } finally {
            setRejectLoading(false);
        }
    };

    const renderActionButtons = (tx: TransactionWithRef) => {
        return (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Tooltip title="View Details">
                    <IconButton
                        size="small"
                        onClick={() => handleViewDetails(tx)}
                        sx={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 1,
                            p: '4px',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        }}
                    >
                        <VisibilityIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    };

    return (
        <AdminLayout>
            <Box sx={{ width: '100%', p: 3 }}>
                <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' } }}>
                            Withdrawal Requests
                        </Typography>
                    </Stack>

                    <TableContainer sx={{
                        maxHeight: 'calc(100vh - 250px)',
                        overflow: 'auto',
                    }}>
                        <Table
                            sx={{
                                tableLayout: 'auto',
                                '& .MuiTableCell-root': {
                                    px: { xs: 1.5, sm: 2 },
                                    py: 1.5,
                                    textAlign: 'center',
                                },
                                '& .MuiTableCell-head': {
                                    backgroundColor: '#fafafa',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                },
                            }}
                            aria-labelledby="tableTitle"
                            size="small"
                        >
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                            Transaction ID
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleFilterClick(e, 'transactionId')}
                                            >
                                                <FilterIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleSort('transactionId')}
                                            >
                                                {renderSortIcon('transactionId')}
                                            </IconButton>
                                        </Box>
                                    </TableCell> */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                            Amount (USD)
                                            <IconButton
                                                size="small"
                                                onClick={() => handleSort('amountInUSD')}
                                            >
                                                {renderSortIcon('amountInUSD')}
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                            Status
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleFilterClick(e, 'status')}
                                            >
                                                <FilterIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    // Loading skeleton
                                    [...Array(5)].map((_, index) => (
                                        <TableRow key={`skeleton-${index}`}>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                }}>
                                                    <Box sx={{
                                                        fontFamily: 'monospace',
                                                        bgcolor: 'grey.50',
                                                        p: 0.5,
                                                        borderRadius: 0.5,
                                                    }}>
                                                        <Skeleton width={120} />
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Skeleton width={80} />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Skeleton width={100} />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                    <Skeleton width={40} />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            align="center"
                                            sx={{
                                                py: 8,
                                                color: 'text.secondary',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((tx) => (
                                        <TableRow
                                            key={tx._id}
                                            hover
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                transition: 'background-color 0.2s ease',
                                            }}
                                        >
                                            {/* <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                }}>
                                                    <Box sx={{
                                                        fontFamily: 'monospace',
                                                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                                                        bgcolor: 'grey.50',
                                                        p: 0.5,
                                                        borderRadius: 0.5,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        maxWidth: '200px',
                                                    }}>
                                                        {formatAddress(tx.transactionId || '')}
                                                    </Box>
                                                    <CopyButton text={tx.transactionId} />
                                                </Box>
                                            </TableCell> */}
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 500,
                                                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                                                }}>
                                                    ${tx.amountInUSD?.toFixed(8) || '0.00'}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Chip
                                                        label={tx.status.toUpperCase()}
                                                        sx={{
                                                            backgroundColor: getStatusColor(tx.status).bg,
                                                            color: getStatusColor(tx.status).textColor,
                                                            height: '24px',
                                                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                                                            fontWeight: 500,
                                                            '&:hover': {
                                                                backgroundColor: getStatusColor(tx.status).bg,
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                    {renderActionButtons(tx)}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: '1px solid rgba(224, 224, 224, 1)',
                            '.MuiTablePagination-select': {
                                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                            },
                            '.MuiTablePagination-displayedRows': {
                                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                            },
                        }}
                    />
                </Paper>

                <Popover
                    open={Boolean(filterAnchorEl)}
                    anchorEl={filterAnchorEl}
                    onClose={handleFilterClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    {renderFilterContent()}
                </Popover>

                <Dialog
                    open={detailsDialogOpen}
                    onClose={handleDetailsClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">Withdrawal Details</Typography>
                            {selectedWithdrawal && (
                                <Chip
                                    label={selectedWithdrawal.status.toUpperCase()}
                                    size="small"
                                    sx={{
                                        backgroundColor: getStatusColor(selectedWithdrawal.status).bg,
                                        color: getStatusColor(selectedWithdrawal.status).textColor,
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: getStatusColor(selectedWithdrawal.status).bg,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ px: 3 }}>
                        {selectedWithdrawal && (
                            <Box sx={{ pt: 1 }}>
                                {/* Transaction Details Section */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Transaction Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Transaction ID
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mt: 0.5
                                            }}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        bgcolor: 'grey.50',
                                                        p: 0.5,
                                                        borderRadius: 0.5,
                                                        flex: 1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {selectedWithdrawal.transactionId}
                                                </Typography>
                                                <CopyButton text={selectedWithdrawal.transactionId} />
                                            </Box>
                                        </Box>
                                        <Box sx={{ flex: '1 1 200px' }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Amount
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    mt: 0.5,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                ${selectedWithdrawal.amountInUSD?.toFixed(8) || '0.00'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* User Information */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        User Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ flex: '1 1 300px' }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Name
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                {selectedWithdrawal.fromUserId?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px' }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                {selectedWithdrawal.fromUserId?.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Wallet Information */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Wallet Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ flex: '1 1 300px' }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Chain & Token
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                {selectedWithdrawal.chain} - {selectedWithdrawal.token}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px' }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Withdrawal Address
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mt: 0.5
                                            }}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        bgcolor: 'grey.50',
                                                        p: 0.5,
                                                        borderRadius: 0.5,
                                                        flex: 1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {selectedWithdrawal.toAddress}
                                                </Typography>
                                                <CopyButton text={selectedWithdrawal.toAddress} />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Additional Information */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Additional Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ flex: '1 1 300px' }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Request Date
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                {new Date(selectedWithdrawal.startDate).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        {selectedWithdrawal.remarks && (
                                            <Box sx={{ flex: '1 1 100%' }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Remarks
                                                </Typography>
                                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                    {selectedWithdrawal.remarks}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions
                        sx={{
                            px: 3,
                            pb: 2,
                            display: 'flex',
                            gap: 1,
                            '& > button': {
                                minWidth: '120px',
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                borderRadius: '8px',
                                textTransform: 'none',
                                padding: '8px 16px',
                            }
                        }}
                    >
                        {selectedWithdrawal?.status === 'requested' && (
                            <>
                                <Button
                                    onClick={handleRejectClick}
                                    color="error"
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    sx={{
                                        borderWidth: '1.5px',
                                        '&:hover': {
                                            borderWidth: '1.5px',
                                            backgroundColor: 'error.main',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    Reject
                                </Button>
                                <Button
                                    onClick={handleApproveClick}
                                    color="success"
                                    variant="contained"
                                    startIcon={approveLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                                    disabled={approveLoading}
                                    sx={{
                                        boxShadow: 2,
                                        '&:hover': {
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    {approveLoading ? 'Approving...' : 'Confirm Approval'}
                                </Button>
                            </>
                        )}
                        <Button
                            onClick={handleDetailsClose}
                            color="inherit"
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            sx={{
                                marginLeft: 'auto',
                                borderColor: 'grey.300',
                                color: 'grey.700',
                                '&:hover': {
                                    borderColor: 'grey.400',
                                    backgroundColor: 'grey.50',
                                },
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog
                    open={confirmDialogOpen}
                    onClose={() => setConfirmDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        pb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <CheckCircleIcon color="success" />
                        Confirm Withdrawal Approval
                    </DialogTitle>
                    <DialogContent sx={{ pt: 1 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                For security purposes, please enter the transaction ID to approve this withdrawal request.
                            </Typography>
                            <TextField
                                fullWidth
                                label="Transaction ID"
                                placeholder="Enter the transaction ID to confirm"
                                value={transactionIdInput}
                                onChange={(e) => setTransactionIdInput(e.target.value)}
                                error={!!confirmationError}
                                helperText={confirmationError}
                                sx={{ mt: 1 }}
                                autoFocus
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{
                        px: 3,
                        pb: 2,
                        display: 'flex',
                        gap: 1,
                        '& > button': {
                            minWidth: '120px',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            borderRadius: '8px',
                            textTransform: 'none',
                            padding: '8px 16px',
                        }
                    }}>
                        <Button
                            onClick={() => setConfirmDialogOpen(false)}
                            color="inherit"
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            sx={{
                                borderColor: 'grey.300',
                                color: 'grey.700',
                                '&:hover': {
                                    borderColor: 'grey.400',
                                    backgroundColor: 'grey.50',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmApprove}
                            color="success"
                            variant="contained"
                            startIcon={approveLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                            disabled={approveLoading}
                            sx={{
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                },
                            }}
                        >
                            {approveLoading ? 'Approving...' : 'Confirm Approval'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Rejection Dialog */}
                <Dialog
                    open={rejectDialogOpen}
                    onClose={() => setRejectDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        pb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <CancelIcon color="error" />
                        Confirm Withdrawal Rejection
                    </DialogTitle>
                    <DialogContent sx={{ pt: 1 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Please provide a reason for rejecting this withdrawal request:
                            </Typography>
                            <TextField
                                fullWidth
                                label="Rejection Reason"
                                placeholder="Enter the reason for rejection"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                error={!!rejectError}
                                helperText={rejectError}
                                sx={{ mt: 1 }}
                                autoFocus
                                multiline
                                rows={3}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{
                        px: 3,
                        pb: 2,
                        display: 'flex',
                        gap: 1,
                        '& > button': {
                            minWidth: '120px',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            borderRadius: '8px',
                            textTransform: 'none',
                            padding: '8px 16px',
                        }
                    }}>
                        <Button
                            onClick={() => setRejectDialogOpen(false)}
                            color="inherit"
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            sx={{
                                borderColor: 'grey.300',
                                color: 'grey.700',
                                '&:hover': {
                                    borderColor: 'grey.400',
                                    backgroundColor: 'grey.50',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmReject}
                            color="error"
                            variant="contained"
                            startIcon={rejectLoading ? <CircularProgress size={20} color="inherit" /> : <CancelIcon />}
                            disabled={rejectLoading}
                            sx={{
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                },
                            }}
                        >
                            {rejectLoading ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminLayout>
    );
}
