'use client';

import Image from "next/image";
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';

export default function WelcomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleContinue = async () => {
    if (isAuthenticated) {
      // Verify authentication status with server
      const response = await fetchWithAuth('/api/auth/me', { requireAuth: true });
      if (response && response.ok) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
      // If response is null, fetchWithAuth has already handled the redirect
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container>
          <Stack spacing={4} alignItems="center">
            {/* Logo */}
            <Box
              sx={{
                width: { xs: 160, sm: 180, md: 200 },
                height: { xs: 140, sm: 150, md: 160 },
                position: 'relative',
                mb: { xs: 3, sm: 4 },
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* Back Coin (Left) */}
              <Box
                sx={{
                  position: 'absolute',
                  width: { xs: 100, sm: 120, md: 130 },
                  height: { xs: 100, sm: 120, md: 130 },
                  left: { xs: '5%', sm: 0 },
                  top: 0,
                  zIndex: 1,
                }}
              >
                <Image
                  src="/images/coin.png"
                  alt="Double Bubble Coin Back"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
              {/* Front Coin (Right) */}
              <Box
                sx={{
                  position: 'absolute',
                  width: { xs: 140, sm: 160, md: 170 },
                  height: { xs: 140, sm: 160, md: 170 },
                  right: { xs: '5%', sm: 10 },
                  top: 15,
                  zIndex: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }}
              >
                <Image
                  src="/images/coin.png"
                  alt="Double Bubble Coin Front"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            </Box>

            {/* Title */}
            <Typography 
              variant="h1" 
              component="h1" 
              color="primary"
              sx={{
                fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
                textAlign: 'center',
                mb: { xs: 1, sm: 2 }
              }}
            >
              Double Bubble
            </Typography>

            {/* Subtitle */}
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem' },
                textAlign: 'center',
                mb: { xs: 3, sm: 4 }
              }}
            >
              Invest effortlessly and earn high returns with ease
            </Typography>

            {/* Bubbles Image */}
            <Box
              sx={{
                width: '100%',
                position: 'relative',
                p: 1,
                mb: { xs: 3, sm: 4 }
              }}
            >
              <Image
                src="/images/bubble_background.png"
                alt="Double Bubble Background"
                width={500}
                height={300}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  maxWidth: '600px',
                  margin: '0 auto',
                  display: 'block'
                }}
                priority
              />
            </Box>

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              width="100%"
              sx={{
                maxWidth: { xs: '100%', sm: '600px' },
                mx: 'auto',
                mt: { xs: 2, sm: 4 }
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                href="/auth/register"
                fullWidth
                sx={{
                  py: { xs: 1.5, sm: 1.75 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 'bold',
                  flex: { sm: 1 }
                }}
              >
                Join
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleContinue}
                fullWidth
                sx={{
                  py: { xs: 1.5, sm: 1.75 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 'bold',
                  flex: { sm: 1 }
                }}
              >
                Continue
              </Button>
            </Stack>
          </Stack>
      </Container>
    </Box>
  );
}
