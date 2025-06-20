'use client';

import {
  Card,
  Typography,
  Box,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useState } from 'react';

interface VIPLevel {
  level: number;
  tasks: number;
  total: number;
  perTask: number;
}

export default function DailyTaskSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vipLevels, setVipLevels] = useState<VIPLevel[]>([]);

  useEffect(() => {
    const fetchVIPLevels = async () => {
      try {
        const response = await fetch('/api/help/daily-task');
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch VIP level data');
        }

        setVipLevels(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load VIP level data');
      } finally {
        setLoading(false);
      }
    };

    fetchVIPLevels();
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
          {error || 'No VIP level data available. Please try again later.'}
        </Typography>
      </Card>
    );
  }

  // Calculate example reward distribution for a $100 task reward
  const exampleReward = 100;
  const rewardDistribution = [
    { recipient: 'You', percentage: 72, amount: exampleReward * 0.72 },
    { recipient: 'Level 1 Upline', percentage: 18, amount: exampleReward * 0.18 },
    { recipient: 'Level 2 Upline', percentage: 7, amount: exampleReward * 0.07 },
    { recipient: 'Level 3 Upline', percentage: 3, amount: exampleReward * 0.03 },
  ];

  return (
    <Card sx={{ p: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <AssignmentTurnedInIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="h2">
          Daily Tasks & Rewards
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        Complete daily tasks to earn rewards based on your VIP level. The higher your VIP level, the more tasks you can complete and the higher rewards you can earn.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon /> Daily Task Benefits
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Box sx={{ bgcolor: 'background.paper', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              VIP Level Benefits:
            </Typography>
            <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 2 }}>
              <Table sx={{ minWidth: 600 }} aria-label="VIP Level Table">
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }} align="center">VIP Level</TableCell>
                    <TableCell sx={{ color: 'white' }} align="center">Tasks Per Day</TableCell>
                    <TableCell sx={{ color: 'white' }} align="center">Daily Total %</TableCell>
                    <TableCell sx={{ color: 'white' }} align="center">Reward Per Task</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vipLevels.map((vip) => (
                    <TableRow key={vip.level}>
                      <TableCell align="center">VIP {vip.level}</TableCell>
                      <TableCell align="center">{vip.tasks} tasks</TableCell>
                      <TableCell align="center">{vip.total}%</TableCell>
                      <TableCell align="center">{vip.perTask}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon /> How Daily Tasks Work
          </Typography>

          <Box sx={{ pl: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Task Completion Process:
            </Typography>
            <Box component="ol" sx={{ mb: 3 }}>
              <li>Navigate to the Tasks section in your dashboard</li>
              <li>Start a new task from your available daily tasks</li>
              <li>Complete the required trading activity</li>
              <li>Receive reward for each completed task ({vipLevels[0]?.perTask}% of your account value per task)</li>
              <li>Repeat with remaining available tasks</li>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Team Reward Distribution:
            </Typography>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="body2" paragraph>
                When you complete a task, the reward is shared with your upline team members:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <li>Level 3 Upline: 3% of your task reward</li>
                <li>Level 2 Upline: 7% of your task reward</li>
                <li>Level 1 Upline: 18% of your task reward</li>
                <li>You receive: 72% of your task reward</li>
              </Box>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Detailed Example:
            </Typography>
            <Box sx={{ bgcolor: 'background.paper', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
              <Typography variant="body2" paragraph>
                For a single task reward of ${exampleReward}:
              </Typography>
              <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 2 }}>
                <Table sx={{ minWidth: 500 }} aria-label="Reward Distribution Table">
                  <TableHead sx={{ bgcolor: 'primary.main' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }} align="center">Recipient</TableCell>
                      <TableCell sx={{ color: 'white' }} align="center">Percentage</TableCell>
                      <TableCell sx={{ color: 'white' }} align="center">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rewardDistribution.map((row) => (
                      <TableRow key={row.recipient}>
                        <TableCell align="center">{row.recipient}</TableCell>
                        <TableCell align="center">{row.percentage}%</TableCell>
                        <TableCell align="center">${row.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body2" color="primary">
                Note: If any upline level doesn't exist, you receive their share of the reward.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ bgcolor: 'success.main', color: 'white', p: 2, borderRadius: 1, mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 Tips for Maximum Rewards
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Each task completion gives you {vipLevels[0]?.perTask}% of your account value, shared with upline</li>
            <li>Complete all available daily tasks to earn your full daily percentage</li>
            <li>Higher VIP levels give you more tasks, increasing your total daily earning potential</li>
            <li>Build your downline team to earn additional rewards from their task completions</li>
            <li>Uncompleted tasks do not carry over to the next day</li>
          </Box>
        </Box>
      </Box>
    </Card>
  );
} 