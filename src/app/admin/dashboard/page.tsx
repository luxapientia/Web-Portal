'use client';

import {
    Box,
    Paper,
    Typography,
    Stack,
    IconButton,
    Tooltip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    Chip,
    useTheme,
    useMediaQuery,
    Skeleton,
    TablePagination,
    Menu,
    MenuItem,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AdminLayout from '@/components/admin/AdminLayout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import CircleIcon from '@mui/icons-material/Circle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import MoneyIcon from '@mui/icons-material/Money';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ActivityLogWithRef } from '@/models/ActivityLog';

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface Statistics {
    users: {
        total: number;
        today: number;
    };
    deposits: {
        total: number;
        today: number;
    };
    interest: {
        total: number;
        today: number;
        byType: Record<string, number>;
    };
    withdrawals: {
        total: number;
        today: number;
    };
}

export default function AdminPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [activities, setActivities] = useState<ActivityLogWithRef[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    // Filter states
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [filterType, setFilterType] = useState<string>('');
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

    const fetchStatistics = async () => {
        try {
            setStatsLoading(true);
            const response = await fetch('/api/admin/statistics');
            const data = await response.json();

            if (data.success) {
                setStatistics(data.data);
            } else {
                toast.error(data.data.error || 'Failed to fetch statistics');
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            toast.error('Failed to fetch statistics');
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            setLoading(true);
            let url = `/api/admin/activities?page=${pagination.page}&limit=${pagination.limit}`;
            if (filterType) url += `&type=${filterType}`;
            if (filterStartDate) url += `&startDate=${filterStartDate.toISOString()}`;
            if (filterEndDate) url += `&endDate=${filterEndDate.toISOString()}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setActivities(data.data.activities);
                setPagination(data.data.pagination);
            } else {
                toast.error(data.data.error || 'Failed to fetch activities');
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            toast.error('Failed to fetch activities');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
        fetchActivities();
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [pagination.page, pagination.limit]);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage + 1 }));
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagination(prev => ({
            ...prev,
            limit: parseInt(event.target.value, 10),
            page: 1
        }));
    };

    const handleFilterApply = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        setFilterDialogOpen(false);
        fetchActivities();
    };

    const handleFilterReset = () => {
        setFilterType('');
        setFilterStartDate(null);
        setFilterEndDate(null);
        setPagination(prev => ({ ...prev, page: 1 }));
        setFilterDialogOpen(false);
        fetchActivities();
    };

    const getStatusFromType = (type: string) => {
        switch (type) {
            case 'deposit':
                return 'Completed';
            case 'withdraw':
                return 'Completed';
            case 'transfer':
                return 'Completed';
            case 'daily_task':
                return 'Completed';
            case 'trust_fund':
                return 'Completed';
            default:
                return 'Pending';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const statCards = [
        {
            title: 'Total Users',
            total: statistics?.users.total || 0,
            today: statistics?.users.today || 0,
            icon: <PeopleIcon sx={{ fontSize: 24 }} />,
            gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            loading: statsLoading
        },
        {
            title: 'Total Deposits',
            total: statistics?.deposits.total || 0,
            today: statistics?.deposits.today || 0,
            icon: <AccountBalanceIcon sx={{ fontSize: 24 }} />,
            gradient: 'linear-gradient(135deg, #007bff 0%, #17a2b8 100%)',
            loading: statsLoading,
            isCurrency: true
        },
        {
            title: 'Total Interest',
            total: statistics?.interest.total || 0,
            today: statistics?.interest.today || 0,
            icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
            gradient: 'linear-gradient(135deg, #fd7e14 0%, #ffc107 100%)',
            loading: statsLoading,
            isCurrency: true
        },
        {
            title: 'Total Withdrawals',
            total: statistics?.withdrawals.total || 0,
            today: statistics?.withdrawals.today || 0,
            icon: <MoneyIcon sx={{ fontSize: 24 }} />,
            gradient: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
            loading: statsLoading,
            isCurrency: true
        }
    ];

    return (
        <AdminLayout>
            {/* Main Content */}
            <Stack spacing={3} p={{ xs: 2, sm: 3 }}>
                {/* Stats Section */}
                <Stack 
                    direction="row" 
                    flexWrap="wrap" 
                    gap={2}
                >
                    {statCards.map((card, index) => (
                        <Paper
                            key={index}
                            elevation={0}
                            sx={{
                                flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' },
                                p: 2.5,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden',
                                bgcolor: 'background.paper',
                                border: 1,
                                borderColor: 'divider',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: 6,
                                    height: '100%',
                                    background: card.gradient,
                                    borderTopLeftRadius: 12,
                                    borderBottomLeftRadius: 12,
                                },
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle2" color="text.secondary">
                                    {card.title}
                                </Typography>
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {card.icon}
                                </Box>
                            </Stack>
                            {card.loading ? (
                                <Stack spacing={1}>
                                    <Skeleton variant="text" width="60%" height={40} />
                                    <Skeleton variant="text" width="40%" />
                                </Stack>
                            ) : (
                                <>
                                    <Typography variant="h4" fontWeight="bold">
                                        {card.isCurrency ? formatCurrency(card.total) : card.total.toLocaleString()}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Chip
                                            label={`Today: ${card.isCurrency ? formatCurrency(card.today) : card.today}`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                                fontWeight: 500,
                                            }}
                                        />
                                    </Stack>
                                </>
                            )}
                        </Paper>
                    ))}
                </Stack>

                {/* Activities Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    {/* Table Header */}
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        alignItems={{ xs: 'flex-start', sm: 'center' }} 
                        justifyContent="space-between" 
                        spacing={{ xs: 1, sm: 0 }}
                        mb={3}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Activities
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button
                                startIcon={<FilterListIcon />}
                                onClick={() => setFilterDialogOpen(true)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderRadius: 2,
                                    px: 2,
                                    borderColor: filterType || filterStartDate || filterEndDate ? 'primary.main' : 'divider',
                                    bgcolor: filterType || filterStartDate || filterEndDate ? 'primary.soft' : 'transparent',
                                    color: filterType || filterStartDate || filterEndDate ? 'primary.main' : 'text.secondary',
                                    '&:hover': {
                                        bgcolor: filterType || filterStartDate || filterEndDate ? 'primary.soft' : 'action.hover',
                                        borderColor: filterType || filterStartDate || filterEndDate ? 'primary.main' : 'text.secondary',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                Filter
                            </Button>
                        </Stack>
                    </Stack>

                    {/* Table */}
                    <Box sx={{ overflow: 'auto' }}>
                        <Table 
                            stickyHeader 
                            sx={{
                                minWidth: 650,
                                '& th, & td': { 
                                    px: { xs: 2, sm: 3 },
                                    py: { xs: 1.5, sm: 2 },
                                    whiteSpace: 'nowrap',
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                },
                                '& th': {
                                    bgcolor: 'background.paper',
                                    fontWeight: 600,
                                }
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>User</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Time</TableCell>
                                    {/* Add more columns as needed */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    // Loading skeleton
                                    [...Array(pagination.limit)].map((_, index) => (
                                        <TableRow key={`skeleton-${index}`}>
                                            <TableCell>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Skeleton variant="circular" width={36} height={36} />
                                                    <Box>
                                                        <Skeleton width={120} />
                                                        <Skeleton width={150} />
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell><Skeleton width={80} /></TableCell>
                                            <TableCell><Skeleton width={100} /></TableCell>
                                            <TableCell><Skeleton width={80} /></TableCell>
                                            <TableCell><Skeleton width={120} /></TableCell>
                                        </TableRow>
                                    ))
                                ) : activities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No activities found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activities.map((activity, index) => (
                                        <TableRow 
                                            key={index}
                                            sx={{ 
                                                '&:hover': { bgcolor: 'action.hover' },
                                                transition: 'background-color 0.2s ease',
                                            }}
                                        >
                                            <TableCell>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar 
                                                        src={activity.userId?.image || ''}
                                                        sx={{ width: 36, height: 36 }}
                                                    >
                                                        {activity.userId?.email?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {activity.userId?.email}
                                                        </Typography>
                                                        {activity.toUserId && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                To: {activity.toUserId.email}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={activity.type}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: activity.type === 'deposit' ? 'success.soft' : 'primary.soft',
                                                        color: activity.type === 'deposit' ? 'success.main' : 'primary.main',
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        color: activity.type === 'withdraw' ? 'error.main' : 'success.main',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ${activity.amount.toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={<CircleIcon sx={{ fontSize: '12px !important' }} />}
                                                    label={getStatusFromType(activity.type)}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'success.soft',
                                                        color: 'success.main',
                                                        '& .MuiChip-icon': {
                                                            color: 'inherit',
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Box>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={pagination.total}
                        page={pagination.page - 1}
                        onPageChange={handlePageChange}
                        rowsPerPage={pagination.limit}
                        onRowsPerPageChange={handleLimitChange}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </Paper>
            </Stack>

            {/* Filter Dialog */}
            <Dialog
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        backgroundImage: 'none',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '& .MuiTypography-root': {
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'text.primary',
                    }
                }}>
                    <FilterListIcon color="primary" />
                    Filter Activities
                </DialogTitle>

                <DialogContent sx={{ p: 2.5 }}>
                    <Stack spacing={3}>
                        <FormControl>
                            <InputLabel sx={{ 
                                '&.Mui-focused': { 
                                    color: 'primary.main' 
                                }
                            }}>
                                Activity Type
                            </InputLabel>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                label="Activity Type"
                                sx={{
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'divider',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'text.secondary',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <MenuItem value="">All Activities</MenuItem>
                                <MenuItem value="deposit">Deposits</MenuItem>
                                <MenuItem value="withdraw">Withdrawals</MenuItem>
                                <MenuItem value="transfer">Transfers</MenuItem>
                                <MenuItem value="daily_task">Daily Tasks</MenuItem>
                                <MenuItem value="trust_fund">Trust Fund</MenuItem>
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 0.5 }}>
                                    Date Range
                                </Typography>
                                <DatePicker
                                    label="Start Date"
                                    value={filterStartDate}
                                    onChange={(newValue) => setFilterStartDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }
                                        }
                                    }}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={filterEndDate}
                                    onChange={(newValue) => setFilterEndDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ 
                    p: 2.5,
                    gap: 1,
                }}>
                    <Button
                        onClick={handleFilterReset}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: 2,
                            borderColor: 'divider',
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: 'text.primary',
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleFilterApply}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                            boxShadow: 'none',
                        }}
                    >
                        Apply Filters
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}
