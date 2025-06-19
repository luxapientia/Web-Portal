'use client';

import { Card, Typography, Box } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InfoIcon from '@mui/icons-material/Info';

export default function TeamCommissionSection() {
  return (
    <Card sx={{ p: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <GroupsIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="h2">
          Team Commission Structure
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        Our multi-level team commission structure rewards you for building and growing your team. Earn commissions from your direct referrals and their downlines.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTreeIcon /> Commission Levels
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ bgcolor: 'background.paper', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Commission Rates by Level:
            </Typography>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box component="thead" sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <Box component="tr">
                  <Box component="th" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>Level</Box>
                  <Box component="th" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>Relationship</Box>
                  <Box component="th" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>Commission Rate</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {[
                  { level: 1, relationship: 'Direct Referrals', rate: 18 },
                  { level: 2, relationship: 'Indirect (Level 1\'s referrals)', rate: 7 },
                  { level: 3, relationship: 'Indirect (Level 2\'s referrals)', rate: 3 },
                ].map((level) => (
                  <Box component="tr" key={level.level}>
                    <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>Level {level.level}</Box>
                    <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>{level.relationship}</Box>
                    <Box component="td" sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>{level.rate}%</Box>
                  </Box>
                ))}
              </Box>
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
                When Mike completes a $100 transaction:
              </Typography>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 2 }}>
                <Box component="thead" sx={{ bgcolor: 'primary.main', color: 'white' }}>
                  <Box component="tr">
                    <Box component="th" sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>Member</Box>
                    <Box component="th" sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>Relationship</Box>
                    <Box component="th" sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>Commission</Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {[
                    { member: 'Sarah', relationship: 'Direct Upline', commission: '$18.00' },
                    { member: 'John', relationship: 'Level 2 Upline', commission: '$7.00' },
                  ].map((row) => (
                    <Box component="tr" key={row.member}>
                      <Box component="td" sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>{row.member}</Box>
                      <Box component="td" sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>{row.relationship}</Box>
                      <Box component="td" sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>{row.commission}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ bgcolor: 'success.main', color: 'white', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 Tips for Maximizing Team Commissions
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Focus on inviting active traders to maximize commission potential</li>
            <li>Help your direct referrals build their teams to increase your Level 2 and 3 earnings</li>
            <li>Maintain regular communication with your team to encourage activity</li>
            <li>Share trading strategies and platform tips with your downline</li>
            <li>Monitor your team's performance in the Team Dashboard</li>
          </Box>
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'info.main', color: 'white', p: 2, borderRadius: 1, mt: 2 }}>
        <Typography variant="body2">
          Track your team's growth and commission earnings in real-time through your Team Dashboard. The more active your team members are, the more commissions you can earn!
        </Typography>
      </Box>
    </Card>
  );
}