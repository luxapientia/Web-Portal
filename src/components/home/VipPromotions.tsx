import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function VipPromotions() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: { xs: 2, md: 4 },
        borderRadius: 4,
        boxShadow: 2,
        p: { xs: 2, md: 3 },
        mb: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 220, md: 280 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/bubble_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Modern glassmorphism overlay for readability */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(82, 137, 226, 0.23)',
          backdropFilter: 'blur(5px) saturate(1.0)',
          WebkitBackdropFilter: 'blur(5px) saturate(1.0)',
          zIndex: 1,
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <StarIcon sx={{ color: '#FFD600', fontSize: { xs: 44, md: 56 }, mb: -1 }} />
        <Typography variant="h5" fontWeight={800} mt={1} color="#222" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          VIP 1
        </Typography>
        <Typography variant="subtitle1" color="#ff9800" fontWeight={700} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Promotions
        </Typography>
        <Typography variant="caption" color="#ff9800" fontWeight={500}>
          1st Deposit after Registration Gets Doubled
        </Typography>
      </Box>
    </Box>
  );
} 