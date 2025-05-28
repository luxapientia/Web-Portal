'use client';

import { useState } from 'react';
import { TextField, Button, Stack, Box, Typography, CircularProgress } from '@mui/material';
import AuthCard from '@/components/auth/AuthCard';
import { registrationSchema, emailVerificationSchema, type RegistrationFormData } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
    getValues,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });

  const email = watch('email');
  const otp = watch('otp');

  const handleEmailVerification = async () => {
    try {
      // Validate email field specifically
      const isEmailValid = await trigger('email');
      if (!isEmailValid) {
        toast.error('Please enter a valid email address');
        return;
      }

      setIsVerifying(true);
      const toastId = toast.loading('Sending verification code...');

      // Validate using email verification schema
      const validationResult = emailVerificationSchema.safeParse({ email });
      if (!validationResult.success) {
        toast.error('Please enter a valid email address', { id: toastId });
        return;
      }

      // Call the email verification API
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      toast.success('Verification code sent successfully!', { id: toastId });
    } catch (error) {
      setIsEmailVerified(false);
      toast.error(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsVerifyingCode(true);
      const toastId = toast.loading('Verifying code...');

      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: getValues('email'),
          code: getValues('otp'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setIsEmailVerified(true);
      toast.success('Email verified successfully!', { id: toastId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to verify code');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      if (!isEmailVerified) {
        toast.error('Please verify your email first');
        return;
      }

      const toastId = toast.loading('Processing registration...');
      console.log('Registration form submitted:', data);
      console.log('Files:', files);
      // Add your API call here
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Registration successful!', { id: toastId });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      setError('root', {
        type: 'manual',
        message: 'Registration failed. Please try again.',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files?.[0]) {
      setFiles(prev => ({
        ...prev,
        [type]: e.target.files?.[0],
      }));
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '30px',
      backgroundColor: '#fff',
      '& fieldset': {
        borderColor: '#eee',
      },
      '&:hover fieldset': {
        borderColor: '#ddd',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#ccc',
      },
    },
    '& input::placeholder': {
      color: '#999',
      opacity: 1,
    },
  };

  const labelStyle = {
    display: 'block',
    textAlign: 'left',
    mb: 1,
    color: '#000',
    fontWeight: 500,
    '& span': {
      color: '#666',
    },
  };

  const buttonStyle = {
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '30px',
    backgroundColor: '#ffeb3b',
    color: '#000',
    '&:hover': {
      backgroundColor: '#ffd700',
    },
    textTransform: 'none',
    width: '100%',
  };

  return (
    <AuthCard title="Registration">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <Box>
            <Typography sx={labelStyle}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              {...register('fullName')}
              placeholder="username"
              variant="outlined"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>
              Phone Number <span>with Country Code</span>
            </Typography>
            <TextField
              fullWidth
              {...register('phone')}
              placeholder="+9607781378"
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>
              Email {isEmailVerified && '✓'}
            </Typography>
            <TextField
              fullWidth
              {...register('email')}
              type="email"
              placeholder="username"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={inputStyle}
              disabled={isEmailVerified}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>
              Password
            </Typography>
            <TextField
              fullWidth
              {...register('password')}
              type="password"
              placeholder="password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>
              ID / Passport
            </Typography>
            <TextField
              fullWidth
              {...register('idPassport')}
              placeholder="ID"
              variant="outlined"
              error={!!errors.idPassport}
              helperText={errors.idPassport?.message}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>
              Invitation Code
            </Typography>
            <TextField
              fullWidth
              {...register('invitationCode')}
              placeholder="Code"
              variant="outlined"
              error={!!errors.invitationCode}
              helperText={errors.invitationCode?.message}
              sx={inputStyle}
            />
          </Box>

          <input
            type="file"
            id="idFront"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'idFront')}
            style={{ display: 'none' }}
          />
          <Button
            component="label"
            htmlFor="idFront"
            variant="contained"
            sx={buttonStyle}
          >
            Attach ID Copy
          </Button>

          <input
            type="file"
            id="idBack"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'idBack')}
            style={{ display: 'none' }}
          />
          <Button
            component="label"
            htmlFor="idBack"
            variant="contained"
            sx={buttonStyle}
          >
            Attach ID Back Copy
          </Button>

          <input
            type="file"
            id="selfie"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'selfie')}
            style={{ display: 'none' }}
          />
          <Button
            component="label"
            htmlFor="selfie"
            variant="contained"
            sx={buttonStyle}
          >
            Upload selfie with ID card
          </Button>

          <Button
            variant="contained"
            onClick={handleEmailVerification}
            disabled={isVerifying || isEmailVerified || !email}
            sx={buttonStyle}
          >
            {isVerifying ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEmailVerified ? (
              'Verified'
            ) : (
              'Send Verification Code'
            )}
          </Button>

          <Box>
            <TextField
              fullWidth
              {...register('otp')}
              placeholder="Enter verification code"
              variant="outlined"
              error={!!errors.otp}
              helperText={errors.otp?.message}
              sx={inputStyle}
              disabled={isEmailVerified}
            />
          </Box>

          {!isEmailVerified && otp && (
            <Button
              variant="contained"
              onClick={handleVerifyCode}
              disabled={isVerifyingCode || !otp}
              sx={buttonStyle}
            >
              {isVerifyingCode ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Verify Code'
              )}
            </Button>
          )}

          {errors.root && (
            <Typography color="error" textAlign="center">
              {errors.root.message}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={buttonStyle}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </AuthCard>
  );
} 