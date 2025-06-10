import { Box, Button, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import { useRouter } from 'next/navigation';

export default function TrustFundSection() {
  const router = useRouter();

  const handleTrustFundClick = () => {
    router.push('/home/trust-pack');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        bgcolor: 'rgba(255, 255, 255, 0.42)',
        borderRadius: 3,
        p: 3,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      {/* Top-right help icon */}
      <IconButton
        size="large"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#000000',
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      {/* Lock icon image above button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <NoEncryptionIcon sx={{ fontSize: 40, color: '#000000' }} />
      </Box>

      {/* Trust Fund button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleTrustFundClick}
        sx={{
          borderRadius: 2,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          bgcolor: '#8BC34A',
          '&:hover': {
            bgcolor: '#7CB342',
          },
          textTransform: 'none',
          boxShadow: 'none',
        }}
      >
        Trust Fund
      </Button>
    </Box>
  );
}
