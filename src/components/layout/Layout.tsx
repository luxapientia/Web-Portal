'use client';

import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export default function Layout({ 
  children, 
  fullWidth = false,
  hideHeader = false,
  hideFooter = false,
  maxWidth = 'xl'
}: LayoutProps) {
  return (
    <Box 
      className="flex flex-col min-h-screen"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {!hideHeader && <Header />}
      
      <Box 
        component="main" 
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {fullWidth ? (
          children
        ) : (
          <Container 
            maxWidth={maxWidth} 
            sx={{ 
              py: 3, 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            {children}
          </Container>
        )}
      </Box>
      
      {!hideFooter && <Footer />}
    </Box>
  );
}