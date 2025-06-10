import { Box, Stack, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

export default function BottomNav() {
  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      bgcolor: 'background.paper',
      borderTop: '1px solid',
      borderColor: 'divider',
      zIndex: 1200,
      display: { xs: 'flex', md: 'none' },
      justifyContent: 'space-around',
      py: 1,
    }}>
      <Stack direction="row" spacing={4} justifyContent="space-around" width="100%">
        <Box textAlign="center">
          <HomeIcon sx={{ fontSize: 28 }} />
          <Typography variant="caption">Home</Typography>
        </Box>
        <Box textAlign="center">
          <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
          <Typography variant="caption">Wallet</Typography>
        </Box>
        <Box textAlign="center">
          <AssignmentTurnedInIcon sx={{ fontSize: 28 }} />
          <Typography variant="caption">Support</Typography>
        </Box>
        <Box textAlign="center">
          <EmojiEventsIcon sx={{ fontSize: 28 }} />
          <Typography variant="caption">My Profile</Typography>
        </Box>
        <Box textAlign="center">
          <StarIcon sx={{ fontSize: 28 }} />
          <Typography variant="caption">Admin</Typography>
        </Box>
      </Stack>
    </Box>
  );
} 