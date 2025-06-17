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
} from '@mui/material';
import AdminLayout from '@/components/admin/AdminLayout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import CircleIcon from '@mui/icons-material/Circle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useState, useEffect } from 'react';

const recentActivities = [
    {
        user: 'John Doe',
        email: 'john@example.com',
        avatar: '',
        action: 'Deposit',
        amount: '$1,200',
        status: 'Completed',
        time: '2 hours ago',
        details: 'Regular deposit'
    },
    // ... add more activities
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed':
            return { bgColor: 'success.soft', color: 'success.main' };
        case 'Pending':
            return { bgColor: 'warning.soft', color: 'warning.main' };
        case 'Failed':
            return { bgColor: 'error.soft', color: 'error.main' };
        default:
            return { bgColor: 'grey.100', color: 'text.secondary' };
    }
};

export default function AdminPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for demo purposes
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

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
                    {/* Stats Card 1 */}
                    <Paper
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
                                bgcolor: '#95C11F',
                                borderTopLeftRadius: 12,
                                borderBottomLeftRadius: 12,
                            },
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Users
                            </Typography>
                            <IconButton size="small">
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                        <Typography variant="h4" fontWeight="bold">
                            2,897
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip
                                icon={<TrendingUpIcon />}
                                label="+12.5%"
                                size="small"
                                sx={{
                                    bgcolor: 'success.soft',
                                    color: 'success.main',
                                    fontWeight: 500,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                vs. last month
                            </Typography>
                        </Stack>
                    </Paper>

                    {/* Stats Card 2 */}
                    <Paper
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
                                bgcolor: '#95C11F',
                                borderTopLeftRadius: 12,
                                borderBottomLeftRadius: 12,
                            },
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Deposits
                            </Typography>
                            <IconButton size="small">
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                        <Typography variant="h4" fontWeight="bold">
                            $2.1M
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip
                                icon={<AccountBalanceIcon />}
                                label="+8.2%"
                                size="small"
                                sx={{
                                    bgcolor: 'success.soft',
                                    color: 'success.main',
                                    fontWeight: 500,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                vs. last month
                            </Typography>
                        </Stack>
                    </Paper>

                    {/* Stats Card 3 */}
                    <Paper
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
                                bgcolor: '#95C11F',
                                borderTopLeftRadius: 12,
                                borderBottomLeftRadius: 12,
                            },
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Interest
                            </Typography>
                            <IconButton size="small">
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                        <Typography variant="h4" fontWeight="bold">
                            $320K
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip
                                icon={<TrendingUpIcon />}
                                label="+15.7%"
                                size="small"
                                sx={{
                                    bgcolor: 'success.soft',
                                    color: 'success.main',
                                    fontWeight: 500,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                vs. last month
                            </Typography>
                        </Stack>
                    </Paper>

                    {/* Stats Card 4 */}
                    <Paper
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
                                bgcolor: '#95C11F',
                                borderTopLeftRadius: 12,
                                borderBottomLeftRadius: 12,
                            },
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Withdrawals
                            </Typography>
                            <IconButton size="small">
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                        <Typography variant="h4" fontWeight="bold">
                            $1.2M
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip
                                icon={<TrendingUpIcon />}
                                label="+5.3%"
                                size="small"
                                sx={{
                                    bgcolor: 'success.soft',
                                    color: 'success.main',
                                    fontWeight: 500,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                vs. last month
                            </Typography>
                        </Stack>
                    </Paper>
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
                            Recent Activities
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Filter activities">
                                <IconButton size="small">
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="More options">
                                <IconButton size="small">
                                    <MoreVertIcon />
                                </IconButton>
                            </Tooltip>
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
                                    <TableCell sx={{ minWidth: { xs: 200, sm: 250 } }}>User</TableCell>
                                    <TableCell sx={{ minWidth: { xs: 100, sm: 120 } }}>Action</TableCell>
                                    <TableCell sx={{ minWidth: { xs: 100, sm: 120 } }}>Amount</TableCell>
                                    <TableCell sx={{ minWidth: { xs: 100, sm: 120 } }}>Status</TableCell>
                                    <TableCell sx={{ minWidth: { xs: 150, sm: 200 } }}>Time & Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    // Loading skeleton
                                    [...Array(5)].map((_, index) => (
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
                                            <TableCell>
                                                <Skeleton width={80} />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton width={100} />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton width={80} />
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Skeleton width={100} />
                                                    <Skeleton width={120} />
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : recentActivities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No activities found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentActivities.map((activity, index) => (
                                    <TableRow 
                                        key={index}
                                        sx={{ 
                                            '&:hover': { 
                                                bgcolor: 'action.hover',
                                            },
                                            transition: 'background-color 0.2s ease',
                                        }}
                                    >
                                        <TableCell>
                                            <Stack 
                                                direction="row" 
                                                spacing={{ xs: 1, sm: 2 }} 
                                                alignItems="center"
                                            >
                                                <Avatar 
                                                    src={activity.avatar}
                                                    alt={activity.user}
                                                    sx={{ 
                                                        width: { xs: 32, sm: 36 }, 
                                                        height: { xs: 32, sm: 36 } 
                                                    }}
                                                >
                                                    {activity.user.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography 
                                                        variant={isMobile ? "body2" : "subtitle2"} 
                                                        fontWeight="medium"
                                                    >
                                                        {activity.user}
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        color="text.secondary"
                                                        sx={{ display: { xs: 'none', sm: 'block' } }}
                                                    >
                                                        {activity.email}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={activity.action}
                                                size={isMobile ? "small" : "medium"}
                                                sx={{ 
                                                    bgcolor: activity.action === 'Deposit' ? 'success.soft' : 'primary.soft',
                                                    color: activity.action === 'Deposit' ? 'success.main' : 'primary.main',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography 
                                                variant={isMobile ? "body2" : "body1"}
                                                sx={{ 
                                                    fontWeight: 600,
                                                    color: activity.action === 'Withdrawal' ? 'error.main' : 'success.main',
                                                }}
                                            >
                                                {activity.action === 'Withdrawal' ? `-${activity.amount}` : activity.amount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<CircleIcon sx={{ fontSize: isMobile ? '10px !important' : '12px !important' }} />}
                                                label={activity.status}
                                                size={isMobile ? "small" : "medium"}
                                                sx={{ 
                                                    bgcolor: getStatusColor(activity.status).bgColor,
                                                    color: getStatusColor(activity.status).color,
                                                    '& .MuiChip-icon': {
                                                        color: 'inherit',
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                <Typography 
                                                    variant={isMobile ? "caption" : "body2"} 
                                                    color="text.secondary"
                                                >
                                                    {activity.time}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.disabled"
                                                    sx={{ display: { xs: 'none', sm: 'block' } }}
                                                >
                                                    {activity.details}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </Paper>
            </Stack>
        </AdminLayout>
    );
}
