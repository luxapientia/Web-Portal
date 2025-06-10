import { Card, CardContent, Stack, Typography, Tooltip, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AssetAccountValue() {
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
          $6,205
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Total Profit as of now
        </Typography>
        <Typography variant="h6" color="#ff9800" fontWeight={700}>
          $1,200
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Earning Today <span style={{ color: '#388e3c', fontWeight: 700 }}>$7.000121</span>
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{
            mt: 2,
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
      </CardContent>
    </Card>
  );
} 