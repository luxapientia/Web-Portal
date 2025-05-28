'use client';

import { useState } from 'react';
import { TextField, Button, Stack, Link as MuiLink, Typography, Box } from '@mui/material';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      const toastId = toast.loading('Logging in...');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Store auth token and user data
      login(result.token, result.user);
      
      toast.success('Login successful!', { id: toastId });
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard 
      title="Double Bubble"
      subtitle="Welcome back"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
              {...register('email')}
              type="email"
              placeholder="username"
              error={!!errors.email}
              helperText={errors.email?.message}
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
              {...register('password')}
              type="password"
              placeholder="password"
              error={!!errors.password}
              helperText={errors.password?.message}
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
            disabled={isSubmitting}
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
            {isSubmitting ? 'Logging in...' : 'Enter'}
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