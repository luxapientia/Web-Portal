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
  { label: "About", path: "/about" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "FAQ", path: "/faq" },
];

// Define authenticated user navigation items
const privateNavItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Investments", path: "/investments" },
  { label: "Referrals", path: "/referrals" },
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
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Logo size="small" />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            onClick={() => handleNavigation(item.path)}
            sx={{
              color: pathname === item.path ? "primary.main" : "inherit",
              fontWeight: pathname === item.path ? "bold" : "normal",
            }}
          >
            <ListItemText primary={item.label} sx={{ textAlign: "center" }} />
          </ListItem>
        ))}
        {!isAuthenticated ? (
          <>
            <ListItem disablePadding onClick={() => handleNavigation("/login")}>
              <ListItemText primary="Login" sx={{ textAlign: "center" }} />
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/auth/register")}
            >
              <ListItemText primary="Join" sx={{ textAlign: "center" }} />
            </ListItem>
          </>
        ) : (
          <ListItem
            disablePadding
            onClick={() => handleNavigation("/dashboard")}
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
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
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
                  color: "text.primary",
                  display: "block",
                  fontWeight: pathname === item.path ? "bold" : "normal",
                  borderBottom: pathname === item.path ? "2px solid" : "none",
                  borderColor: "primary.main",
                  borderRadius: 0,
                  mx: 1,
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
                    color="inherit"
                    onClick={() => router.push("/auth/login")}
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => router.push("/auth/register")}
                    sx={{
                      fontWeight: "bold",
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
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}