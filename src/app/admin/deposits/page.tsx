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
    Close as CloseIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import CopyButton from '@/components/common/CopyButton';
import { TransactionWithRef } from '@/models/Transaction';

interface FilterState {
    transactionId: string;
    fromAddress: string;
    toAddress: string;
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

export default function DepositPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState<FilterState>({
        transactionId: '',
        fromAddress: '',
        toAddress: '',
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
    const [selectedDeposit, setSelectedDeposit] = useState<TransactionWithRef | null>(null);

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
                ...(filters.fromAddress && { fromAddress: filters.fromAddress }),
                ...(filters.toAddress && { toAddress: filters.toAddress }),
                ...(filters.status !== 'all' && { status: filters.status }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(sort.field && sort.direction && {
                    sortBy: sort.field,
                    sortOrder: sort.direction
                }),
            });

            const response = await fetch(`/api/admin/deposits?${queryParams}`);

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
                return { color: 'success', bg: '#E8F5E9' };
            case 'pending':
                return { color: 'warning', bg: '#FFF3E0' };
            case 'failed':
                return { color: 'error', bg: '#FFEBEE' };
            default:
                return { color: 'default', bg: '#F5F5F5' };
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
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="success">Success</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
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

    const formatAddress = (address: string) => {
        return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
    };

    const handleViewDetails = (tx: TransactionWithRef) => {
        setSelectedDeposit(tx);
        setDetailsDialogOpen(true);
    };

    const handleDetailsClose = () => {
        setDetailsDialogOpen(false);
        setSelectedDeposit(null);
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
                            Deposit Transactions
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
                                    <TableCell>
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
                                    </TableCell>
                                    {/* <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                            From User
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
                                            {[...Array(4)].map((_, cellIndex) => (
                                                <TableCell key={`cell-${cellIndex}`} align="center">
                                                    <Skeleton animation="wave" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
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
                                            <TableCell>
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
                                                        {formatAddress(tx.transactionId)}
                                                    </Box>
                                                    <CopyButton text={tx.transactionId} />
                                                </Box>
                                            </TableCell>
                                            {/* <TableCell>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5,
                                                }}>
                                                    {tx.fromUser ? (
                                                        <>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {tx.fromUser.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {tx.fromUser.email}
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Unknown User
                                                        </Typography>
                                                    )}
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
                                                    ${tx.amountInUSD?.toFixed(2) || '0.00'}
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
                                                            color: `${getStatusColor(tx.status).color}.main`,
                                                            height: '24px',
                                                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
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
                            <Typography variant="h6">Deposit Details</Typography>
                            <Chip
                                label={selectedDeposit?.status.toUpperCase()}
                                size="small"
                                sx={{
                                    backgroundColor: selectedDeposit ? getStatusColor(selectedDeposit.status).bg : 'grey.100',
                                    color: selectedDeposit ? `${getStatusColor(selectedDeposit.status).color}.main` : 'text.secondary',
                                }}
                            />
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {selectedDeposit && (
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
                                                    {selectedDeposit.transactionId}
                                                </Typography>
                                                <CopyButton text={selectedDeposit.transactionId} />
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
                                                    color: 'success.main'
                                                }}
                                            >
                                                ${selectedDeposit.amountInUSD?.toFixed(2) || '0.00'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Wallet Information Section */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Wallet Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                From Address
                                            </Typography>
                                            {selectedDeposit.fromAddress ? (
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mt: 0.5
                                                }}>
                                                    <Typography
                                                        variant="body2"
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
                                                        {selectedDeposit.fromAddress}
                                                    </Typography>
                                                    <CopyButton text={selectedDeposit.fromAddress} />
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    Not specified
                                                </Typography>
                                            )}
                                            {/* {selectedDeposit.fromUser && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    From User: {selectedDeposit.fromUser.name} ({selectedDeposit.fromUser.email})
                                                </Typography>
                                            )} */}
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                To Address
                                            </Typography>
                                            {selectedDeposit.toAddress ? (
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mt: 0.5
                                                }}>
                                                    <Typography
                                                        variant="body2"
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
                                                        {selectedDeposit.toAddress}
                                                    </Typography>
                                                    <CopyButton text={selectedDeposit.toAddress} />
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    Not specified
                                                </Typography>
                                            )}
                                            {/* {selectedDeposit.toUser && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    To User: {selectedDeposit.toUser.name} ({selectedDeposit.toUser.email})
                                                </Typography>
                                            )} */}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Dates Section */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Dates
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ flex: '1 1 200px' }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Start Date
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                {new Date(selectedDeposit.startDate).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: '1 1 200px' }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Release Date
                                            </Typography>
                                            {selectedDeposit.releaseDate ? (
                                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                    {new Date(selectedDeposit.releaseDate).toLocaleString()}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    Not released yet
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Additional Information Section */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Additional Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        {selectedDeposit.remarks && (
                                            <Box sx={{ flex: '1 1 100%' }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Remarks
                                                </Typography>
                                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                    {selectedDeposit.remarks}
                                                </Typography>
                                            </Box>
                                        )}
                                        {selectedDeposit.rejectReason && (
                                            <Box sx={{ flex: '1 1 100%' }}>
                                                <Typography variant="subtitle2" color="error">
                                                    Rejection Reason
                                                </Typography>
                                                <Typography variant="body1" sx={{ mt: 0.5, color: 'error.main' }}>
                                                    {selectedDeposit.rejectReason}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        )}
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
            </Box>
        </AdminLayout>
    );
}
