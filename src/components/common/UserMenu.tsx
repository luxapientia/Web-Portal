import { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Divider, 
  Box,
  Avatar
} from '@mui/material';
import { 
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  AccountCircle
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  showDashboardButton?: boolean;
  onDashboardClick?: () => void;
}

export default function UserMenu({ 
  showDashboardButton = false,
  onDashboardClick
}: UserMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    router.push('/auth/login');
  };

  const handleDashboard = () => {
    handleMenuClose();
    if (onDashboardClick) {
      onDashboardClick();
    } else {
      router.push('/dashboard');
    }
  };

  const handleProfile = () => {
    handleMenuClose();
    router.push('/profile');
  };

  const handleSettings = () => {
    handleMenuClose();
    router.push('/settings');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', order: { xs: -1, md: 0 } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
        sx={{ mr: 1 }}
      >
        {user?.avatar ? (
          <Avatar 
            src={user.avatar} 
            alt={user.fullName || 'User'} 
            sx={{ width: 32, height: 32 }}
          />
        ) : (
          <AccountCircle />
        )}
      </IconButton>
      
      {showDashboardButton && (
        <IconButton
          color="inherit"
          onClick={handleDashboard}
        >
          <DashboardIcon />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfile}>
          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body1">
            {user?.fullName || 'My Profile'}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}