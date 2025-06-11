'use client';

import { useState } from 'react';
import { Box, Stack, IconButton, Drawer, useMediaQuery, useTheme, AppBar, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Navigation from './Navigation';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    // Drawer width based on screen size
    const drawerWidth = {
        xs: '85%',
        sm: '320px',
        md: '320px'
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar - Mobile */}
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    display: { md: 'none' },
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Navigation - Desktop */}
            <Box
                component="nav"
                sx={{
                    width: { md: drawerWidth.md },
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <Box
                    sx={{
                        height: '100vh',
                        position: 'fixed',
                        width: drawerWidth.md,
                        borderRight: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        overflowY: 'auto',
                        p: { md: 2 },
                        pt: { md: 3 },
                        '&::-webkit-scrollbar': {
                            width: 6,
                        },
                        '&::-webkit-scrollbar-track': {
                            bgcolor: 'action.hover',
                            borderRadius: 3,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            bgcolor: 'primary.light',
                            borderRadius: 3,
                            '&:hover': {
                                bgcolor: 'primary.main',
                            },
                        },
                    }}
                >
                    <Navigation
                        activeMenu={activeMenu}
                        onMenuSelect={handleMenuSelect}
                    />
                </Box>
            </Box>

            {/* Navigation - Mobile */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box',
                        width: { xs: drawerWidth.xs, sm: drawerWidth.sm },
                        bgcolor: 'background.paper',
                        p: { xs: 1.5, sm: 2 },
                        pt: { xs: 2, sm: 3 },
                    },
                }}
            >
                <Navigation
                    isMobile
                    activeMenu={activeMenu}
                    onMenuSelect={handleMenuSelect}
                />
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0, // Ensures content doesn't overflow
                    p: { xs: 1.5, sm: 2, md: 3 },
                    pt: { 
                        xs: 'calc(56px + 16px)', // Mobile header height + spacing
                        sm: 'calc(64px + 24px)', // Tablet header height + spacing
                        md: 3 
                    },
                    bgcolor: 'background.default',
                }}
            >
                {children}
            </Box>
        </Box>
    );
} 