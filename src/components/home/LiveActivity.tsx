import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { ActivityLogWithoutId } from '@/models/ActivityLog';

export default function LiveActivity() {
    const [activities, setActivities] = useState<ActivityLogWithoutId[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchActivities();
        // Set up polling every 30 seconds
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await fetch('/api/activity-log');
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            toast.error('Failed to load activities');
        } finally {
            setLoading(false);
        }
    };

    const getTypeLabel = (type: ActivityLogWithoutId['type']) => {
        switch (type) {
            case 'deposit':
                return 'Deposit';
            case 'withdraw':
                return 'Withdraw';
            case 'transfer':
                return 'Transfer';
            case 'daily_task':
                return 'Daily Task';
            case 'trust_fund':
                return 'Trust Fund';
            default:
                return type;
        }
    };

    const getTypeColor = (type: ActivityLogWithoutId['type']) => {
        switch (type) {
            case 'deposit':
                return 'success';
            case 'withdraw':
                return 'warning';
            case 'transfer':
                return 'info';
            case 'daily_task':
                return 'primary';
            case 'trust_fund':
                return 'secondary';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Live Activity</Typography>
            <TableContainer 
                component={Paper} 
                sx={{ 
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: 'background.paper',
                    overflow: 'auto'
                }}
            >
                <Table sx={{ minWidth: isMobile ? 'auto' : 650 }}>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: 'background.neutral',
                                '& th': { fontWeight: 700 }
                            }}
                        >
                            <TableCell>Time</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Amount (USD)</TableCell>
                            {!isMobile && <TableCell>User ID</TableCell>}
                            {!isMobile && activities.some(a => a.toUserId) && (
                                <TableCell>To User</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isMobile ? 3 : 5} align="center">
                                    <Typography color="text.secondary">
                                        No activities today
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            activities.map((activity, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <TableCell>
                                        {format(new Date(activity.timestamp), 'HH:mm:ss')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getTypeLabel(activity.type)}
                                            color={getTypeColor(activity.type)}
                                            size="small"
                                            sx={{ minWidth: 80 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ 
                                        color: activity.type === 'withdraw' ? 'error.main' : 'success.main',
                                        fontWeight: 600
                                    }}>
                                        {activity.type === 'withdraw' ? '-' : '+'}
                                        {activity.amount.toFixed(2)}
                                    </TableCell>
                                    {!isMobile && (
                                        <TableCell>
                                            {activity.userId}
                                        </TableCell>
                                    )}
                                    {!isMobile && activities.some(a => a.toUserId) && (
                                        <TableCell>
                                            {activity.toUserId || '-'}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
} 