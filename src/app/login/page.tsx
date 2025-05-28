'use client';

import { useState } from 'react';
import { TextField, Button, Stack, Link as MuiLink, Typography, Box } from '@mui/material';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AuthCard 
      title="Double Bubble" 
      subtitle="Your account is suspended"
    >
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <Box>
            <Typography
              component="label"
              htmlFor="email"
              sx={{
                display: 'block',
                textAlign: 'left',
                mb: 1,
                color: '#333',
                fontWeight: 500,
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="username"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  backgroundColor: '#f8f8f8',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              component="label"
              htmlFor="password"
              sx={{
                display: 'block',
                textAlign: 'left',
                mb: 1,
                color: '#333',
                fontWeight: 500,
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              id="password"
              name="password"
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  backgroundColor: '#f8f8f8',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
          </Box>

          <MuiLink
            component={Link}
            href="/forgot-password"
            sx={{
              textAlign: 'right',
              color: '#333',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'block',
              mb: 1,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Forgot your password?
          </MuiLink>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '30px',
              backgroundColor: '#ffeb3b',
              color: '#000',
              '&:hover': {
                backgroundColor: '#ffd700',
              },
              textTransform: 'none',
            }}
          >
            Enter
          </Button>

          <Button
            component={Link}
            href="/register"
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '30px',
              backgroundColor: '#ffeb3b',
              color: '#000',
              '&:hover': {
                backgroundColor: '#ffd700',
              },
              textTransform: 'none',
            }}
          >
            Register / Join
          </Button>
        </Stack>
      </form>
    </AuthCard>
  );
} 