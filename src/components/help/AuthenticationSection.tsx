'use client';

import { Card, Typography, Box, Link, Divider, useTheme, useMediaQuery, Stepper, Step, StepLabel } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import KeyIcon from '@mui/icons-material/Key';

export default function AuthenticationSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        background: '#ffffff',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: { xs: 2, sm: 3 },
          background: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <LockIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
        <Typography variant={isMobile ? "h6" : "h5"} component="h2" sx={{ fontWeight: 600 }}>
          Authentication Guide
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Registration Process */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon /> Registration Process
          </Typography>

          <Stepper orientation="vertical" sx={{ mt: 3 }}>
            <Step active completed>
              <StepLabel>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Get Invitation Code
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  You need a valid invitation code from an existing member to register. This helps maintain platform security and quality.
                </Typography>
              </StepLabel>
            </Step>

            <Step active completed>
              <StepLabel>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Basic Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Provide your email, create a strong password, and enter your invitation code.
                  Your password must contain at least 8 characters with numbers and letters.
                </Typography>
              </StepLabel>
            </Step>

            <Step active completed>
              <StepLabel>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Email Verification
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Check your email for a verification code. Enter this code to verify your email address.
                  The code expires in 10 minutes for security.
                </Typography>
              </StepLabel>
            </Step>

            <Step active completed>
              <StepLabel>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Identity Verification
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Upload clear photos of:
                  <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                    <li>Passport or Government ID (front and back)</li>
                    <li>Selfie holding your ID</li>
                  </Box>
                </Typography>
              </StepLabel>
            </Step>
          </Stepper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Login Process */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyIcon /> Login Process
          </Typography>

          <Box 
            sx={{ 
              p: 3, 
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 2,
              mt: 3,
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon /> Standard Login
            </Typography>
            <Typography variant="body2" paragraph>
              Enter your registered email and password to access your account. Make sure to use the email address you verified during registration.
            </Typography>
            <Link href="/auth/login" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Go to Login →
            </Link>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Password Recovery */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyIcon /> Password Recovery
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Stepper orientation="vertical">
              <Step active completed>
                <StepLabel>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Request Reset
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Click "Forgot Password" on the login page and enter your email address.
                  </Typography>
                </StepLabel>
              </Step>

              <Step active completed>
                <StepLabel>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Verify Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Check your email for a password reset link. The link expires in 30 minutes.
                  </Typography>
                </StepLabel>
              </Step>

              <Step active completed>
                <StepLabel>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Set New Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Create a new strong password following the security requirements.
                  </Typography>
                </StepLabel>
              </Step>
            </Stepper>
          </Box>
        </Box>

        {/* Security Tips */}
        <Box 
          sx={{ 
            p: 3,
            bgcolor: 'info.light',
            borderRadius: 2,
            border: 1,
            borderColor: 'info.main'
          }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'info.dark', fontWeight: 600 }}>
            Security Tips
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            <Typography component="li" variant="body2" color="info.dark" paragraph>
              Use a unique, strong password that you don't use on other websites
            </Typography>
            <Typography component="li" variant="body2" color="info.dark" paragraph>
              Keep your login credentials private and secure
            </Typography>
            <Typography component="li" variant="body2" color="info.dark" paragraph>
              Never share your verification codes with anyone
            </Typography>
            <Typography component="li" variant="body2" color="info.dark">
              Keep your ID verification documents private and secure
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
} 