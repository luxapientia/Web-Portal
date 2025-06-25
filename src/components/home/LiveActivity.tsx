import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ActivityLog {
    userId: string;
    userEmail: string;
    type: 'deposit' | 'withdraw' | 'transfer' | 'earn' | 'team_earn';
    amount: number;
    timestamp: Date;
}

export default function LiveActivity() {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

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

    const getActionText = (activity: ActivityLog) => {
        switch (activity.type) {
            case 'deposit':
                return `Deposited USD ${activity.amount.toFixed(2)}`;
            case 'withdraw':
                return `Withdrew USD ${activity.amount.toFixed(2)}`;
            case 'transfer':
                return `Transferred USD ${activity.amount.toFixed(2)}`;
            case 'earn':
                return `Earned USD ${activity.amount.toFixed(2)}`;
            case 'team_earn':
                return `Team Earned USD ${activity.amount.toFixed(2)}`;
            default:
                return `USD ${activity.amount.toFixed(2)}`;
        }
    };

    const getActivityColor = (type: ActivityLog['type']) => {
        switch (type) {
            case 'deposit':
                return 'success.main';
            case 'withdraw':
                return 'warning.main';
            case 'transfer':
                return 'info.main';
            case 'earn':
                return 'primary.main';
            case 'team_earn':
                return 'secondary.main';
            default:
                return 'text.primary';
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
        <>
            <Typography variant="h6" fontWeight={700} mb={2}>Live Activity</Typography>
            <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {activities.length === 0 ? (
                    <Typography variant="body1" textAlign="center" color="text.secondary">
                        No recent activities
                    </Typography>
                ) : (
                    activities.map((activity, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                width: '100%',
                                boxShadow: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    bgcolor: getActivityColor(activity.type),
                                    borderRadius: '50%',
                                    flexShrink: 0,
                                }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body1" fontWeight={700}>
                                    {activity.userEmail.replace(/(?<=.{3}).(?=.*@)/g, '*')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {getActionText(activity)}
                                </Typography>
                            </Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                {format(new Date(activity.timestamp), 'MM/dd HH:mm')}
                            </Typography>
                        </Box>
                    ))
                )}
            </Box>
        </>
    );
} 