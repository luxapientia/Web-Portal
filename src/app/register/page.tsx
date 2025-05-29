'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Stack, Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AuthCard from '@/components/auth/AuthCard';
import { registrationSchema, type RegistrationFormData } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    getValues,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange'
  });

  const [files, setFiles] = useState<{
    idFront: File | null;
    idBack: File | null;
    selfie: File | null;
  }>({
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

      setTimer(30); // Start 30 second countdown
      setHasCodeBeenSent(true); // Mark that code has been sent
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

      // Check if all required files are selected
      if (!files.idFront || !files.idBack || !files.selfie) {
        toast.error('Please upload all required documents');
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading('Processing registration...');

      // Create FormData for multipart form data
      const formData = new FormData();
      
      // Append form fields
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('idPassport', data.idPassport);
      formData.append('invitationCode', data.invitationCode);
      formData.append('otp', data.otp);

      // Append files with specific names
      formData.append('idFront', files.idFront);
      formData.append('idBack', files.idBack);
      formData.append('selfie', files.selfie);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData, // FormData will automatically set the correct Content-Type header
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success('Registration successful!', { id: toastId });
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'idFront' | 'idBack' | 'selfie') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));
      trigger(type as keyof RegistrationFormData);
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
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <Box>
            <Typography sx={labelStyle}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              {...register('fullName')}
              placeholder="John Doe"
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
              placeholder="+1234567890"
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
              placeholder="email@example.com"
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
              placeholder="••••••••"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>
              ID/Passport Number
            </Typography>
            <TextField
              fullWidth
              {...register('idPassport')}
              placeholder="ID123456"
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
              placeholder="ABC123"
              error={!!errors.invitationCode}
              helperText={errors.invitationCode?.message}
              sx={inputStyle}
            />
          </Box>

          <input
            type="file"
            id="idFront"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => handleFileChange(e, 'idFront')}
            style={{ display: 'none' }}
          />
          <Button
            component="label"
            htmlFor="idFront"
            variant="contained"
            sx={{
              ...buttonStyle,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            {files.idFront ? (
              <>
                <CheckCircleIcon sx={{ color: 'success.main' }} />
                ID Front Selected
              </>
            ) : (
              'Attach ID Front Copy'
            )}
          </Button>

          <input
            type="file"
            id="idBack"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => handleFileChange(e, 'idBack')}
            style={{ display: 'none' }}
          />
          <Button
            component="label"
            htmlFor="idBack"
            variant="contained"
            sx={{
              ...buttonStyle,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            {files.idBack ? (
              <>
                <CheckCircleIcon sx={{ color: 'success.main' }} />
                ID Back Selected
              </>
            ) : (
              'Attach ID Back Copy'
            )}
          </Button>

          <input
            type="file"
            id="selfie"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => handleFileChange(e, 'selfie')}
            style={{ display: 'none' }}
          />
          <Button
            component="label"
            htmlFor="selfie"
            variant="contained"
            sx={{
              ...buttonStyle,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            {files.selfie ? (
              <>
                <CheckCircleIcon sx={{ color: 'success.main' }} />
                Selfie Selected
              </>
            ) : (
              'Upload Selfie with ID'
            )}
          </Button>

          <Button
            variant="contained"
            onClick={handleEmailVerification}
            disabled={isVerifying || isEmailVerified || !email || timer > 0}
            sx={buttonStyle}
          >
            {isVerifying ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEmailVerified ? (
              'Verified'
            ) : timer > 0 ? (
              `Resend in ${timer}s`
            ) : hasCodeBeenSent ? (
              'Resend Verification Code'
            ) : (
              'Send Verification Code'
            )}
          </Button>

          <Box>
            <TextField
              fullWidth
              {...register('otp')}
              placeholder="Enter verification code"
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
            disabled={isSubmitting || !isEmailVerified}
            sx={buttonStyle}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Complete Registration'
            )}
          </Button>
        </Stack>
      </Box>
    </AuthCard>
  );
} 