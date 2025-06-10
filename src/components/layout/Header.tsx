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
import Logo from "@/components/common/Logo";
import UserMenu from "@/components/common/UserMenu";
import { useSession } from "next-auth/react";

// Define navigation items
const publicNavItems = [
  { label: "Home", path: "/home" },
];

// Define authenticated user navigation items
const privateNavItems = [
  { label: "Home", path: "/home" },
];

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { status } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) setMobileOpen(false);
  };

  // Get the appropriate navigation items based on authentication status
  const navItems = status === 'authenticated' ? privateNavItems : publicNavItems;

  // Drawer content for mobile view
  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        bgcolor: "rgba(15, 23, 42, 0.6)", // darker slate
        height: "100%",
        color: "white",
        display: "flex",
        flexDirection: "column",
        px: 2,
      }}
    >
      {/* Logo Section */}
      <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
        <Logo size="small" />
      </Box>
  
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mb: 2 }} />
  
      {/* Navigation Items */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            sx={{
              justifyContent: "center",
              py: 1.5,
              borderRadius: 2,
              mb: 1,
              bgcolor: pathname === item.path ? "rgba(140,217,133,0.12)" : "transparent",
              color: pathname === item.path ? "primary.light" : "rgba(255, 255, 255, 0.9)",
              fontWeight: pathname === item.path ? "bold" : 500,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "rgba(140,217,133,0.08)",
                transform: "scale(1.02)",
                cursor: "pointer",
              },
            }}
          >
            <ListItemText primary={item.label} sx={{ textAlign: "center" }} />
          </ListItem>
        ))}
  
        {/* Auth Buttons */}
        {status !== "authenticated" ? (
          <>
            <ListItem
              onClick={() => handleNavigation("/auth/login")}
              sx={{
                justifyContent: "center",
                py: 1.5,
                borderRadius: 2,
                mb: 1,
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 500,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "rgba(140,217,133,0.08)",
                  transform: "scale(1.02)",
                  cursor: "pointer",
                },
              }}
            >
              <ListItemText primary="Login" sx={{ textAlign: "center" }} />
            </ListItem>
            <ListItem
              onClick={() => handleNavigation("/auth/register")}
              sx={{
                justifyContent: "center",
                py: 1.5,
                borderRadius: 2,
                mb: 1,
                color: "primary.light",
                fontWeight: 700,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "rgba(140,217,133,0.12)",
                  transform: "scale(1.03)",
                  cursor: "pointer",
                },
              }}
            >
              <ListItemText primary="Join" sx={{ textAlign: "center" }} />
            </ListItem>
          </>
        ) : (
          <ListItem
            onClick={() => handleNavigation("/dashboard")}
            sx={{
              justifyContent: "center",
              py: 1.5,
              borderRadius: 2,
              mb: 1,
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 600,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "rgba(140,217,133,0.08)",
                transform: "scale(1.02)",
                cursor: "pointer",
              },
            }}
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
        background: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(140,217,133,0.18) 100%)',
        backdropFilter: 'blur(18px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
        borderBottom: '1.5px solid',
        borderColor: 'rgba(140,217,133,0.18)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        zIndex: 1201,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 2, px: 1, minHeight: 72 }}>
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
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: 'center' }}>
            <Logo size="medium" />
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  my: 2,
                  color: pathname === item.path ? "primary.main" : "rgba(30, 41, 59, 0.85)",
                  display: "block",
                  fontWeight: pathname === item.path ? "bold" : 500,
                  borderBottom: pathname === item.path ? "2.5px solid" : "none",
                  borderColor: "primary.main",
                  borderRadius: 0,
                  mx: 1.5,
                  fontSize: '1.1rem',
                  letterSpacing: 0.5,
                  transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                  '&:hover': {
                    backgroundColor: 'rgba(140,217,133,0.10)',
                    color: 'primary.main',
                    transform: 'translateY(-2px) scale(1.04)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Auth buttons or User Menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {status === 'authenticated' ? (
              <UserMenu showDashboardButton={!isMobile} />
            ) : (
              !isMobile && (
                <>
                  <Button
                    variant="text"
                    onClick={() => router.push("/auth/login")}
                    sx={{
                      mr: 1.5,
                      px: 2.5,
                      color: 'rgba(30, 41, 59, 0.85)',
                      borderRadius: '10px',
                      fontWeight: 500,
                      fontSize: '1.05rem',
                      transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                      '&:hover': {
                        backgroundColor: 'rgba(140,217,133,0.10)',
                        color: 'primary.main',
                        transform: 'translateY(-2px) scale(1.04)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push("/auth/register")}
                    sx={{
                      fontWeight: 700,
                      px: 2.5,
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      borderRadius: '10px',
                      fontSize: '1.05rem',
                      boxShadow: '0 4px 10px rgba(140,217,133,0.10)',
                      transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        color: 'primary.dark',
                        boxShadow: '0 6px 15px rgba(140,217,133,0.18)',
                        backgroundColor: 'rgba(140,217,133,0.10)',
                        transform: 'translateY(-2px) scale(1.04)',
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
        <Divider sx={{ opacity: 0.18, borderColor: 'primary.main', borderBottomWidth: 2 }} />
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
          zIndex: 1202,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(140,217,133,0.18) 100%)',
            backdropFilter: 'blur(18px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}