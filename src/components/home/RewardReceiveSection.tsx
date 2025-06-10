import { Card, CardContent, Stack, Typography, Button, Box, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Image from 'next/image';
import React from 'react';

export default function RewardReceiveSection() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        p: { xs: 2, md: 3 },
        mb: 2,
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Box sx={{ minWidth: 56, minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/images/receive.png" alt="Money Badge" width={56} height={56} style={{ borderRadius: 12 }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight={500}>
              Registration Invitations
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              Team Contributions
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              Reaching Level Hits
            </Typography>
          </Box>
          <Tooltip title="How rewards work?">
            <IconButton color="primary">
              <HelpOutlineIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: 1,
            py: 1.5,
            mb: 1,
            mt: 1,
            letterSpacing: 0.5,
          }}
        >
          Receive
        </Button>
      </CardContent>
    </Card>
  );
} 