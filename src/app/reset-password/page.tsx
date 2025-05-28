'use client';

import { useState, useEffect, Suspense } from 'react';
import { TextField, Button, Stack, Typography, Box } from '@mui/material';
import AuthCard from '@/components/auth/AuthCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, verifyCodeSchema, type ResetPasswordFormData } from '@/schemas/password-reset.schema';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown

  // Get email from URL
  const email = searchParams.get('email') || '';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !isCodeVerified) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCodeVerified) {
      // Redirect to login if time expires
      toast.error('Verification code expired. Please try again.');
      router.push('/login');
    }
    return () => clearInterval(timer);
  }, [timeLeft, isCodeVerified, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email
    }
  });

  const handleVerifyCode = async () => {
    try {
      const { email, verificationCode } = getValues();
      
      // Validate code format
      const validationResult = verifyCodeSchema.safeParse({ email, verificationCode });
      if (!validationResult.success) {
        toast.error('Please enter a valid verification code');
        return;
      }

      setIsVerifying(true);
      const toastId = toast.loading('Verifying code...');

      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify code');
      }

      toast.success('Code verified successfully!', { id: toastId });
      setIsCodeVerified(true);
    } catch (error) {
      console.error('Code verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify code');
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (!isCodeVerified) {
        toast.error('Please verify your code first');
        return;
      }

      setIsResetting(true);
      const toastId = toast.loading('Resetting password...');

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      toast.success('Password reset successful!', { id: toastId });
      router.push('/login?message=password-reset-success');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AuthCard 
      title="Reset Password"
      subtitle={isCodeVerified ? "Set your new password" : "Enter verification code"}
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
              disabled
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
              htmlFor="verificationCode"
              sx={{
                display: 'block',
                textAlign: 'left',
                mb: 1,
                color: '#333',
                fontWeight: 500,
              }}
            >
              Verification Code {!isCodeVerified && `(${timeLeft}s)`}
            </Typography>
            <TextField
              fullWidth
              {...register('verificationCode')}
              placeholder="Enter 6-digit code"
              error={!!errors.verificationCode}
              helperText={errors.verificationCode?.message}
              disabled={isCodeVerified}
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

          {!isCodeVerified && (
            <Button
              onClick={handleVerifyCode}
              variant="contained"
              disabled={isVerifying}
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
              {isVerifying ? 'Verifying...' : 'Verify Code'}
            </Button>
          )}

          {isCodeVerified && (
            <>
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
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  {...register('password')}
                  type="password"
                  placeholder="Enter new password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
                  htmlFor="confirmPassword"
                  sx={{
                    display: 'block',
                    textAlign: 'left',
                    mb: 1,
                    color: '#333',
                    fontWeight: 500,
                  }}
                >
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Confirm new password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
                type="submit"
                variant="contained"
                disabled={isResetting}
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
                {isResetting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </>
          )}

          <Button
            onClick={() => router.push('/login')}
            sx={{
              color: '#333',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            Back to Login
          </Button>
        </Stack>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthCard title="Loading..." subtitle="Please wait">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading reset password form...</Typography>
        </Box>
      </AuthCard>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
} 