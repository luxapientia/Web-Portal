'use client';

import { Card, Typography, Box, Link, useTheme, useMediaQuery, Divider } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SecurityIcon from '@mui/icons-material/Security';
import TimerIcon from '@mui/icons-material/Timer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

export default function DepositSection() {
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
          background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <AccountBalanceWalletIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
        <Typography variant={isMobile ? "h6" : "h5"} component="h2" sx={{ fontWeight: 600 }}>
          How to Make a Deposit
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
          Making a deposit is quick and easy. Follow these simple steps to fund your account:
        </Typography>

        {/* First Deposit Bonus Notice */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            mb: 3,
            bgcolor: 'primary.50',
            borderRadius: 1,
            border: 1,
            borderColor: 'primary.200'
          }}
        >
          <CardGiftcardIcon color="primary" />
          <Typography variant="body2" color="primary.main">
            New users get a 100% bonus on their first deposit. The bonus can be withdrawn after 100 days.
          </Typography>
        </Box>

        {/* Steps Grid */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 4
          }}
        >
          {[
            {
              icon: <AccountBalanceWalletIcon color="primary" />,
              title: "Access Wallet",
              content: "Navigate to the Wallet Deposit section in your dashboard",
              link: "/wallet/deposit"
            },
            {
              icon: <QrCodeIcon color="primary" />,
              title: "Get Address",
              content: "Select your preferred cryptocurrency and copy the wallet address or scan QR code"
            },
            {
              icon: <ContentCopyIcon color="primary" />,
              title: "Send Funds",
              content: "Transfer your funds from your external wallet to the provided address"
            },
            {
              icon: <TimerIcon color="primary" />,
              title: "Wait for Confirmation",
              content: "Allow 10-30 minutes for blockchain confirmation and funds to appear"
            }
          ].map((step, index) => (
            <Box
              key={index}
              sx={{
                p: 3,
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                {step.icon}
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {step.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {step.content}
              </Typography>
              {step.link && (
                <Link 
                  href={step.link} 
                  sx={{ 
                    display: 'inline-block',
                    mt: 1,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Go to Deposit →
                </Link>
              )}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Security Warning */}
        <Box 
          sx={{ 
            display: 'flex',
            gap: 2,
            p: 2,
            bgcolor: 'warning.light',
            borderRadius: 2,
            alignItems: 'flex-start'
          }}
        >
          <SecurityIcon color="warning" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle1" color="warning.dark" sx={{ fontWeight: 600, mb: 0.5 }}>
              Important Security Notice
            </Typography>
            <Typography variant="body2" color="warning.dark">
              Always double-check the wallet address before sending funds. We are not responsible for funds sent to incorrect addresses.
              Make sure you're sending the correct cryptocurrency type to avoid loss of funds.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
} 