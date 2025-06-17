import { Box, Typography, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { InterestMatrix } from '@/models/InterestMatrix';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function VipPromotions() {
  const [vipLevel, setVipLevel] = useState<InterestMatrix | null>(null);
  const [vipLevelIndex, setVipLevelIndex] = useState<number>(0);

  useEffect(() => {
    const fetchVipLevel = async () => {
      try {
        const response = await fetch('/api/account-asset');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch VIP level');
        }
        setVipLevel(data.vipLevel);
        const vipLevelName = data.vipLevel.name;
        const index = vipLevelName.split(' ')[1];
        setVipLevelIndex(parseInt(index));
      } catch {
        toast.error('Failed to fetch VIP level');
      }
    };
    fetchVipLevel();
  }, []);

  const renderStars = () => {
    return (
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        sx={{ mb: 1 }}
      >
        {Array.from({ length: vipLevelIndex }).map((_, index) => (
          <StarIcon
            key={index}
            sx={{
              color: '#FFD600',
              fontSize: { xs: 32, md: 40 },
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
              animation: 'star-shine 1.5s ease-in-out infinite',
              '@keyframes star-shine': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  opacity: 1
                },
                '50%': {
                  transform: 'scale(1.2)',
                  opacity: 0.8
                }
              },
              animationDelay: `${index * 0.2}s`
            }}
          />
        ))}
      </Stack>
    );
  };

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
          // backdropFilter: 'blur(5px) saturate(1.0)',
          // WebkitBackdropFilter: 'blur(5px) saturate(1.0)',
          zIndex: 1,
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {renderStars()}
        <Typography variant="h5" fontWeight={800} mt={1} color="#222" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          {vipLevel?.name}
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