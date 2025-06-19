'use client';

import { Card, Typography, Box } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import InfoIcon from '@mui/icons-material/Info';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export default function VIPLevelSection() {
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
            {[
              { level: 1, value: '50 - 99', members: '0 - 5' },
              { level: 2, value: '100 - 500', members: '6 - 10' },
              { level: 3, value: '501 - 2,000', members: '11 - 20' },
              { level: 4, value: '2,001 - 5,000', members: '21 - 30' },
              { level: 5, value: '5,001 - 10,000', members: '31 - 40' },
              { level: 6, value: '10,001 - 30,000', members: '41 - 50' },
            ].map((vip) => (
              <Box component="tr" key={vip.level}>
                <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>VIP {vip.level}</Box>
                <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>${vip.value}</Box>
                <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>{vip.members}</Box>
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
            {[
              { level: 1, tasks: 4, reward: 2 },
              { level: 2, tasks: 5, reward: 2.5 },
              { level: 3, tasks: 6, reward: 3 },
              { level: 4, tasks: 7, reward: 3.5 },
              { level: 5, tasks: 8, reward: 4 },
              { level: 6, tasks: 9, reward: 4.5 },
            ].map((vip) => (
              <li key={vip.level}>VIP {vip.level}: {vip.tasks} tasks/day with {vip.reward}% rewards</li>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            2. Promotion Rewards
          </Typography>
          <Typography paragraph>
            Earn promotion rewards based on your VIP level:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 3 }}>
            {[
              { level: 1, reward: 3 },
              { level: 2, reward: 20 },
              { level: 3, reward: 30 },
              { level: 4, reward: 50 },
              { level: 5, reward: 100 },
              { level: 6, reward: 200 },
            ].map((vip) => (
              <li key={vip.level}>VIP {vip.level}: ${vip.reward} promotion reward</li>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            3. Upline Deposit Rewards
          </Typography>
          <Typography paragraph>
            Earn rewards from upline deposits ($100 minimum):
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {[
              { level: 1, reward: 1 },
              { level: 2, reward: 1.5 },
              { level: 3, reward: 2 },
              { level: 4, reward: 2.5 },
              { level: 5, reward: 3 },
              { level: 6, reward: 3.5 },
            ].map((vip) => (
              <li key={vip.level}>VIP {vip.level}: {vip.reward}% reward</li>
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