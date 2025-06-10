'use client';

import { useState } from 'react';
import { TextField, Button, Stack, Typography, Box } from '@mui/material';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const email = watch('email');

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading('Logging in...');
    try {
      setIsSubmitting(true);

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log(result);

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Login successful!', { id: toastId });
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Validate email first
      const emailValid = await trigger('email');
      if (!emailValid) {
        toast.error('Please enter a valid email address');
        return;
      }

      setIsSendingCode(true);
      const toastId = toast.loading('Sending verification code...');

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send verification code');
      }

      toast.success('Verification code sent!', { id: toastId });
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsSendingCode(false);
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

          <Button
            onClick={handleForgotPassword}
            disabled={isSendingCode}
            sx={{
              textAlign: 'right',
              color: '#333',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            {isSendingCode ? 'Sending...' : 'Forgot your password?'}
          </Button>

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
            href="/auth/register"
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