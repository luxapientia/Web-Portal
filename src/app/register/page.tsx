'use client';

import { useState } from 'react';
import { TextField, Button, Stack, Box, Typography, CircularProgress } from '@mui/material';
import AuthCard from '@/components/auth/AuthCard';
import { registrationSchema, emailVerificationSchema, type RegistrationFormData } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });

  const email = watch('email');

  const handleEmailVerification = async () => {
    try {
      // Validate email field specifically
      const isEmailValid = await trigger('email');
      if (!isEmailValid) return;

      setIsVerifying(true);
      setVerificationMessage('');

      // Validate using email verification schema
      const validationResult = emailVerificationSchema.safeParse({ email });
      if (!validationResult.success) {
        setVerificationMessage('Please enter a valid email address');
        return;
      }

      // TODO: Replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API call
      
      // Simulate successful verification
      setIsEmailVerified(true);
      setVerificationMessage('Email verification code has been sent!');
    } catch (error) {
      setIsEmailVerified(false);
      setVerificationMessage('Failed to send verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      console.log('Registration form submitted:', data);
      console.log('Files:', files);
      // Add your API call here
    } catch (error) {
      console.error('Registration error:', error);
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
              'Email verification'
            )}
          </Button>

          {verificationMessage && (
            <Typography 
              color={isEmailVerified ? 'success.main' : 'error'} 
              textAlign="center"
            >
              {verificationMessage}
            </Typography>
          )}

          <Box>
            <TextField
              fullWidth
              {...register('otp')}
              placeholder="OTP"
              variant="outlined"
              error={!!errors.otp}
              helperText={errors.otp?.message}
              sx={inputStyle}
              disabled={!isEmailVerified}
            />
          </Box>

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