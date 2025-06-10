import { Button } from '@mui/material';

export default function TrustFundButton() {
  return (
    <Button
      fullWidth
      variant="contained"
      color="secondary"
      sx={{
        mb: 2,
        borderRadius: 3,
        fontWeight: 700,
        fontSize: '1rem',
        boxShadow: 1,
        transition: '0.2s',
        ':hover': { boxShadow: 3, transform: 'translateY(-2px)' },
      }}
    >
      Trust Fund
    </Button>
  );
} 