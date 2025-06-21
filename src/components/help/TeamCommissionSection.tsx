'use client';

import { Card, Typography, Box, CircularProgress, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Paper } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useState } from 'react';
import { TeamCommisionLevel } from '@/models/TeamCommisionLevel';

export default function TeamCommissionSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commissionLevels, setCommissionLevels] = useState<TeamCommisionLevel[]>([]);

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        const response = await fetch('/api/help/team_commission');
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch commission data');
        }

        setCommissionLevels(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load commission data');
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionData();
  }, []);

  if (loading) {
    return (
      <Card sx={{ p: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error || !commissionLevels.length) {
    return (
      <Card sx={{ p: 4, mb: 4 }}>
        <Typography color="error">
          {error || 'No commission levels available. Please try again later.'}
        </Typography>
      </Card>
    );
  }

  // Example calculation for the scenario
  const exampleDailyReward = 100;
  const exampleCommissions = commissionLevels.slice(0, 2).map(level => ({
    member: level.level === 1 ? 'Sarah' : 'John',
    relationship: level.level === 1 ? 'Direct Upline' : 'Level 2 Upline',
    commission: `$${(level.percentage * exampleDailyReward / 100).toFixed(2)}`
  }));

  return (
    <Card sx={{ p: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <GroupsIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="h2">
          Team Commission Structure
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        Our multi-level team commission structure rewards you for building and growing your team. You earn a percentage of your team members' daily task rewards based on their level in your network.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTreeIcon /> Commission Levels
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ bgcolor: 'background.paper', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Commission Rates from Daily Task Rewards:
            </Typography>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 400 }}>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }} align="center">Level</TableCell>
                    <TableCell sx={{ color: 'white' }} align="center">Commission Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commissionLevels.map((level) => (
                    <TableRow key={level.level}>
                      <TableCell align="center">Level {level.level}</TableCell>
                      <TableCell align="center">{level.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon /> How Team Commissions Work
        </Typography>

        <Box sx={{ pl: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Example Scenario:
          </Typography>
          <Box sx={{ bgcolor: 'background.paper', p: 3, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
            <Typography variant="body2" paragraph>
              Let's follow a simple example with John, Sarah, and Mike:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography component="ul" sx={{ mb: 2 }}>
                <li>John invites Sarah (Level 1)</li>
                <li>Sarah invites Mike (Level 2 for John)</li>
                <li>Mike invites Alex (Level 3 for John)</li>
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              When Mike earns ${exampleDailyReward} from daily tasks:
            </Typography>
            <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 2 }}>
              <Table sx={{ minWidth: 400 }}>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }} align="center">Member</TableCell>
                    <TableCell sx={{ color: 'white' }} align="center">Relationship</TableCell>
                    <TableCell sx={{ color: 'white' }} align="center">Commission</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exampleCommissions.map((row) => (
                    <TableRow key={row.member}>
                      <TableCell align="center">{row.member}</TableCell>
                      <TableCell align="center">{row.relationship}</TableCell>
                      <TableCell align="center">{row.commission}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" color="text.secondary">
              * Commissions are calculated based on team members' daily task rewards
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'success.main', color: 'white', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          💡 Tips for Maximizing Team Commissions
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>Focus on inviting active members who complete daily tasks regularly</li>
          <li>Help your team members understand and complete their daily tasks</li>
          <li>Build a larger network to increase your commission earnings</li>
          <li>Guide your direct referrals to build their own teams</li>
          <li>Monitor your team's daily task completion rates</li>
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'info.main', color: 'white', p: 2, borderRadius: 1, mt: 2 }}>
        <Typography variant="body2">
          Track your team's daily task completion and commission earnings in real-time through your Team Dashboard. The more active your team members are in completing daily tasks, the more commissions you can earn!
        </Typography>
      </Box>
    </Card>
  );
}