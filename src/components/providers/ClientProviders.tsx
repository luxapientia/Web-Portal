'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useServerInsertedHTML } from 'next/navigation';
import { ReactNode, useState } from 'react';

// Create theme outside of component to prevent recreation on each render
const theme = createTheme({
  palette: {
    primary: {
      main: '#0088cc',
      light: '#33a0d4',
      dark: '#005f8f',
    },
    secondary: {
      main: '#ffeb3b',
      light: '#ffef5c',
      dark: '#b2a429',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    body1: {
      fontSize: '1.125rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontSize: '1.125rem',
          padding: '12px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 24,
        },
      },
    },
  },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({
      key: 'mui',
      prepend: true,
    });

    return {
      cache,
      flush: () => {
        const prevInserted = cache.inserted;
        cache.inserted = {};
        return prevInserted;
      },
    };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (!names) return null;

    let styles = '';
    for (const name in names) {
      styles += names[name];
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${Object.keys(names).join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
} 