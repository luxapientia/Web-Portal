'use client';

import { Box, Button, Stack, Avatar, Typography, Tooltip, alpha } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Paid as PaidIcon,
    AccountBalance as AccountBalanceIcon,
    MonetizationOn as MonetizationOnIcon,
    KeyboardArrowRight as ArrowIcon,
} from '@mui/icons-material';

export const menuItems = [
    { 
        title: 'Dashboard', 
        icon: <DashboardIcon />, 
        color: '#4CAF50',
        description: 'Overview of system statistics and activities'
    },
    { 
        title: 'User Admin', 
        icon: <PeopleIcon />, 
        color: '#2196F3',
        description: 'Manage user accounts and permissions'
    },
    { 
        title: 'Interest Setup', 
        icon: <PaidIcon />, 
        color: '#FF9800',
        description: 'Configure interest rates and terms'
    },
    { 
        title: 'Deposit Approvals', 
        icon: <AccountBalanceIcon />, 
        color: '#9C27B0',
        description: 'Review and approve deposit requests'
    },
    { 
        title: 'Withdraw Approvals', 
        icon: <MonetizationOnIcon />, 
        color: '#F44336',
        description: 'Process withdrawal requests'
    },
];

interface NavigationProps {
    activeMenu: string;
    onMenuSelect: (menu: string) => void;
}

export default function Navigation({ activeMenu, onMenuSelect }: NavigationProps) {
    return (
        <Stack 
            spacing={1} 
            width="100%"
            sx={{
                px: { xs: 0.5, sm: 1 },
            }}
        >
            {/* Brand/Logo Area - You can replace this with your actual logo */}
            <Box
                sx={{
                    py: 2,
                    px: 1.5,
                    mb: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{
                        background: 'linear-gradient(45deg, #2196F3, #4CAF50)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    Admin Portal
                </Typography>
            </Box>

            {menuItems.map((item, index) => (
                <Tooltip 
                    key={index}
                    title={item.description}
                    placement="right"
                    arrow
                    enterDelay={700}
                >
                    <Button
                        onClick={() => onMenuSelect(item.title)}
                        aria-label={`Navigate to ${item.title}`}
                        sx={{
                            justifyContent: 'flex-start',
                            minHeight: 48,
                            color: activeMenu === item.title ? 'white' : 'text.primary',
                            bgcolor: activeMenu === item.title 
                                ? alpha(item.color, 0.9)
                                : 'transparent',
                            p: 1.5,
                            pl: 2,
                            borderRadius: 2,
                            position: 'relative',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                bgcolor: activeMenu === item.title 
                                    ? alpha(item.color, 0.8)
                                    : alpha(item.color, 0.08),
                                transform: 'translateX(4px)',
                                '& .MuiAvatar-root': {
                                    transform: 'scale(1.1)',
                                },
                            },
                            '&:active': {
                                transform: 'translateX(2px)',
                            },
                        }}
                    >
                        <Stack 
                            direction="row" 
                            spacing={2} 
                            alignItems="center" 
                            width="100%"
                        >
                            <Avatar 
                                sx={{ 
                                    bgcolor: activeMenu === item.title 
                                        ? 'rgba(255,255,255,0.2)' 
                                        : alpha(item.color, 0.12),
                                    color: activeMenu === item.title 
                                        ? 'white' 
                                        : item.color,
                                    width: 32,
                                    height: 32,
                                    transition: 'all 0.2s ease-in-out',
                                    '& .MuiSvgIcon-root': {
                                        fontSize: '1.2rem',
                                        transition: 'transform 0.2s ease-in-out',
                                    },
                                }}
                            >
                                {item.icon}
                            </Avatar>
                            <Typography 
                                sx={{ 
                                    flex: 1,
                                    fontWeight: activeMenu === item.title ? 600 : 500,
                                    fontSize: '0.95rem',
                                    letterSpacing: 0.2,
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                {item.title}
                            </Typography>
                            <ArrowIcon 
                                sx={{ 
                                    opacity: activeMenu === item.title ? 1 : 0,
                                    transform: activeMenu === item.title 
                                        ? 'translateX(0) rotate(0deg)' 
                                        : 'translateX(-8px) rotate(-90deg)',
                                    transition: 'all 0.3s ease-in-out',
                                    fontSize: '1.2rem',
                                }} 
                            />
                        </Stack>
                    </Button>
                </Tooltip>
            ))}

            {/* User Profile Section - You can customize this */}
            <Box
                sx={{
                    mt: 'auto !important', // Override Stack spacing
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Button
                    sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        p: 1,
                        borderRadius: 2,
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                            }}
                        >
                            A
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                Admin User
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                admin@example.com
                            </Typography>
                        </Box>
                    </Stack>
                </Button>
            </Box>
        </Stack>
    );
} 