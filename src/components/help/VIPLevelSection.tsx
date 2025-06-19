'use client';

import { Card, Typography, Box, CircularProgress } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import InfoIcon from '@mui/icons-material/Info';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useEffect, useState } from 'react';
import { InterestMatrix } from '@/models/InterestMatrix';

export default function VIPLevelSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vipLevels, setVipLevels] = useState<InterestMatrix[]>([]);

  useEffect(() => {
    const fetchVIPData = async () => {
      try {
        const response = await fetch('/api/help/viplevel');
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch VIP data');
        }
        
        setVipLevels(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load VIP data');
      } finally {
        setLoading(false);
      }
    };

    fetchVIPData();
  }, []);

  if (loading) {
    return (
      <Card sx={{ p: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error || !vipLevels.length) {
    return (
      <Card sx={{ p: 4, mb: 4 }}>
        <Typography color="error">
          {error || 'No VIP levels available. Please try again later.'}
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <WorkspacePremiumIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="h2">
          VIP Levels & Benefits
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        Our VIP program offers increasing benefits as you progress through the levels. Your VIP level is determined by your account value and number of active team members.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon /> VIP Level Requirements
        </Typography>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
          <Box component="thead" sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <Box component="tr">
              <Box component="th" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>Level</Box>
              <Box component="th" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>Account Value ($)</Box>
              <Box component="th" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>Active Members</Box>
            </Box>
          </Box>
          <Box component="tbody">
            {vipLevels.map((vip) => (
              <Box component="tr" key={vip.level}>
                <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>VIP {vip.level}</Box>
                <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                  ${vip.startAccountValue.toLocaleString()} - {vip.endAccountValue === 0 ? '∞' : `$${vip.endAccountValue.toLocaleString()}`}
                </Box>
                <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                  {vip.startActiveMembers} - {vip.endActiveMembers === 0 ? '∞' : vip.endActiveMembers}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TaskAltIcon /> VIP Benefits
        </Typography>
        
        <Box sx={{ pl: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            1. Daily Tasks Rewards
          </Typography>
          <Typography paragraph>
            Higher VIP levels unlock more daily tasks and higher reward percentages:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 3 }}>
            {vipLevels.map((vip) => (
              <li key={vip.level}>
                VIP {vip.level}: {vip.dailyTasksCountAllowed} tasks/day with {vip.dailyTasksRewardPercentage}% rewards
              </li>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            2. Promotion Rewards
          </Typography>
          <Typography paragraph>
            Earn promotion rewards based on your VIP level:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 3 }}>
            {vipLevels.map((vip) => (
              <li key={vip.level}>VIP {vip.level}: ${vip.promotionReward} promotion reward</li>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            3. Upline Deposit Rewards
          </Typography>
          <Typography paragraph>
            Earn rewards from upline deposits ($100 minimum):
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {vipLevels.map((vip) => (
              <li key={vip.level}>VIP {vip.level}: ${vip.uplineDepositReward} reward</li>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'info.main', color: 'white', p: 2, borderRadius: 1 }}>
        <Typography variant="body2">
          Your VIP level is automatically updated as you meet the requirements for account value and active team members.
          Check your current VIP status in your <Box component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>profile</Box>.
        </Typography>
      </Box>
    </Card>
  );
} 