import { Card, CardContent, Stack, Typography, Tooltip, Button, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AssetAccountValue() {
  const [accountValue, setAccountValue] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [earningToday, setEarningToday] = useState<number>(0);

  useEffect(() => {
    const fetchAccountValue = async () => {
      try {
        const response = await fetch('/api/account-asset');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch account value');
        } 

        setAccountValue(data.accountValue);
      } catch (error) {
        console.error('Error fetching account value:', error);
        toast.error('Failed to fetch account value');
      }
    };
    fetchAccountValue();
  }, []);

  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: 4,
        boxShadow: 3,
        p: 1,
        background: 'linear-gradient(135deg, #e0f7fa 0%, #fffde7 100%)',
        minWidth: 0,
        maxWidth: { xs: '100%', md: 420 },
        mx: { xs: 0, md: 'auto' },
        position: 'relative',
        pb: 7 // Add padding at bottom for the button
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}>
            Asset Account Value
          </Typography>
          <Tooltip title="Total value of your assets">
            <InfoOutlinedIcon fontSize="small" color="action" />
          </Tooltip>
        </Stack>
        <Typography variant="h3" color="success.main" fontWeight={900} mt={1} sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
          ${accountValue}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Total Profit as of now
        </Typography>
        <Typography variant="h6" color="#ff9800" fontWeight={700}>
          ${profit}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Earning Today <span style={{ color: '#388e3c', fontWeight: 700 }}>${earningToday}</span>
        </Typography>
      </CardContent>

      <Box sx={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2
      }}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            fontSize: { xs: '1rem', md: '1.1rem' },
            boxShadow: 1,
            transition: '0.2s',
            ':hover': { boxShadow: 3, transform: 'translateY(-2px)' },
            py: { xs: 1, md: 1.5 },
          }}
        >
          Invest More...
        </Button>
      </Box>
    </Card>
  );
} 