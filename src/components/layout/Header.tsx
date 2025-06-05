"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/common/Logo";
import UserMenu from "@/components/common/UserMenu";

// Define navigation items
const publicNavItems = [
  { label: "Home", path: "/" },
];

// Define authenticated user navigation items
const privateNavItems = [
  { label: "Home", path: "/" },
];

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isAuthenticated } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) setMobileOpen(false);
  };

  // Get the appropriate navigation items based on authentication status
  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  // Drawer content for mobile view
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", bgcolor: 'rgb(30, 41, 59)' }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Logo size="small" />
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            onClick={() => handleNavigation(item.path)}
            sx={{
              color: pathname === item.path ? "primary.light" : "rgba(255, 255, 255, 0.9)",
              fontWeight: pathname === item.path ? "bold" : "normal",
            }}
          >
            <ListItemText primary={item.label} sx={{ textAlign: "center" }} />
          </ListItem>
        ))}
        {!isAuthenticated ? (
          <>
            <ListItem 
              disablePadding 
              onClick={() => handleNavigation("/auth/login")}
              sx={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              <ListItemText primary="Login" sx={{ textAlign: "center" }} />
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/auth/register")}
              sx={{ 
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "bold"
              }}
            >
              <ListItemText primary="Join" sx={{ textAlign: "center" }} />
            </ListItem>
          </>
        ) : (
          <ListItem
            disablePadding
            onClick={() => handleNavigation("/dashboard")}
            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            <ListItemText primary="Dashboard" sx={{ textAlign: "center" }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      className={className}
      sx={{
        background: 'linear-gradient(135deg, rgba(247, 232, 31, 0.8) 0%, rgba(171, 241, 105, 0.8) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Logo size="small" />
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  my: 2,
                  color: pathname === item.path ? "primary.light" : "rgba(255, 255, 255, 0.9)",
                  display: "block",
                  fontWeight: pathname === item.path ? "bold" : "normal",
                  borderBottom: pathname === item.path ? "2px solid" : "none",
                  borderColor: "primary.light",
                  borderRadius: 0,
                  mx: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Auth buttons or User Menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated ? (
              <UserMenu showDashboardButton={!isMobile} />
            ) : (
              !isMobile && (
                <>
                  <Button
                    variant="text"
                    onClick={() => router.push("/auth/login")}
                    sx={{ 
                      mr: 1,
                      px: 2,
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push("/auth/register")}
                    sx={{
                      fontWeight: "bold",
                      px: 2,
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-2px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Join
                  </Button>
                </>
              )
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: 240,
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(44, 55, 74, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}