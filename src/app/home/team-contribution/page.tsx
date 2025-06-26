"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Divider,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import VipPromotions from '@/components/home/VipPromotions';
import { User } from '@/models/User';
import { TeamCommisionLevel } from '@/models/TeamCommisionLevel';
import { getFormattedDateTime } from '@/utils/date-format';
import { ActivityLogWithRef } from '@/models/ActivityLog';

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

interface ChipData {
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface CardValue {
  label: string;
  value: string;
}

interface CardData {
  icon: React.ReactNode;
  title: string;
  value?: string;
  subtitle?: string;
  gradient: string;
  chips?: ChipData[];
  splitView?: boolean;
  leftValue?: CardValue;
  rightValue?: CardValue;
}

const CARD_HEIGHT = 140;

export default function TeamContributionPage() {
  const theme = useTheme();
  const [teamMembers, setTeamMembers] = useState<{
    level: number;
    members: User[];
  }[]>([]);
  const [teamCommisionLevels, setTeamCommisionLevels] = useState<TeamCommisionLevel[]>([]);
  const [totalEarning, setTotalEarning] = useState<number>(0);
  const [todayEarning, setTodayEarning] = useState<number>(0);
  const [levelEarnings, setLevelEarnings] = useState<{
    level: number;
    earnings: number;
  }[]>([]);
  const [teamActivities, setTeamActivities] = useState<{
    member: User;
    log: ActivityLogWithRef ;
  }[]>([]);

  useEffect(() => {
    fetchTeamMembers();
    fetchTeamCommisionLevels();
    fetchTeamEarnings();
    fetchTeamActivities();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team/members');
      if (!response.ok) {
        toast.error('Failed to fetch team members');
        return;
      }
      const result = await response.json();
      if (result.success) {
        setTeamMembers(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Error fetching team members');
    }
  };

  const fetchTeamCommisionLevels = async () => {
    try {
      console.log('fetching team commision levels');
      const response = await fetch('/api/team/commision-levels');
      if (!response.ok) {
        toast.error('Failed to fetch team commision levels');
        return;
      }
      const result = await response.json();
      if (result.success) {
        setTeamCommisionLevels(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching team commision levels:', error);
      toast.error('Error fetching team commision levels');
    }
  };

  const fetchTeamEarnings = async () => {
    try {
      const response = await fetch('/api/team/earnings');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch team earnings');
      }
      if (data.success) {
        setTotalEarning(data.data.teamEarnings);
        setTodayEarning(data.data.todayTeamEarnings);
        setLevelEarnings(data.data.levelTeamEarnings);
      }
    } catch (error) {
      console.error('Error fetching team earnings:', error);
      toast.error('Error fetching team earnings');
    }
  };

  const fetchTeamActivities = async () => {

    try {
      const response = await fetch('/api/team/activity');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch team activities');
      }
      if (data.success) {
        setTeamActivities(data.data.teamActivities);
      }
    } catch (error) {
      console.error('Error fetching team activities:', error);
      toast.error('Error fetching team activities');
    }
  };

  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  // Sample data - replace with actual data from your API
  // const teamStats = {
  //   vipLevel: 1,
  //   totalEarning: 5000,
  //   todayEarning: 1200,
  //   totalMembers: 10,
  //   depositToday: 1500,
  //   withdrawToday: 5500,
  //   activeMembers: 7,
  //   inactiveMembers: 3,
  //   monthlyGrowth: 25, // percentage
  // };

  // const liveActivities: LiveActivity[] = [
  //   { username: 'hs***.com', action: 'Deposited', amount: 200.00, timeAgo: '3 minutes ago' },
  //   { username: 'ali****.online', action: 'earned', amount: 150.00, timeAgo: '10 minutes ago' },
  //   { username: 'justi****.sg', action: 'Deposited', amount: 400.00, timeAgo: '15 minutes ago' },
  // ];

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.push('/home');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const cards: CardData[] = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
      title: "Total Earnings",
      value: `$${totalEarning}`,
      subtitle: ``,
      gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />,
      title: "Today's Earnings",
      value: `$${todayEarning}`,
      subtitle: `From ${teamMembers.reduce((acc, team) => acc + team.members.filter(member => member.status === 'active').length, 0)} active members`,
      gradient: 'linear-gradient(135deg, #007bff 0%, #17a2b8 100%)'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 28 }} />,
      title: "Team Members",
      value: teamMembers.reduce((acc, team) => acc + team.members.length, 0).toString(),
      chips: [
        {
          icon: <CheckCircleIcon sx={{ fontSize: '14px !important' }} />,
          label: `${teamMembers.reduce((acc, team) => acc + team.members.filter(member => member.status === 'active').length, 0)} Active`,
          color: 'rgba(255,255,255,0.2)'
        },
        {
          icon: <CancelIcon sx={{ fontSize: '14px !important' }} />,
          label: `${teamMembers.reduce((acc, team) => acc + team.members.filter(member => member.status === 'suspended').length, 0)} Inactive`,
          color: 'rgba(255,255,255,0.1)'
        }
      ],
      gradient: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)'
    },
    // {
    //   icon: <PeopleOutlineIcon sx={{ fontSize: 28 }} />,
    //   title: "Daily Activity",
    //   splitView: true,
    //   leftValue: {
    //     label: "Deposits",
    //     value: `$${todayEarning}`
    //   },
    //   rightValue: {
    //     label: "Withdraws",
    //     value: `$${todayEarning}`
    //   },
    //   gradient: 'linear-gradient(135deg, #fd7e14 0%, #dc3545 100%)'
    // }
  ];

  return (
    <Layout>
      <MotionContainer
        maxWidth="md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        sx={{
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 3 },
          borderRadius: 5,
          background: `linear-gradient(135deg, rgba(189, 207, 187, 0.38) 60%, ${theme.palette.primary.light} 100%)`,
          backdropFilter: 'blur(16px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
          boxShadow: '0 8px 32px 0 rgba(165, 195, 55, 0.12)',
          border: '1px solid rgba(231, 133, 36, 0.44)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={handleBack}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600}>Home &gt; Team Contribution</Typography>
          </Stack>
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <VipPromotions />

        {/* Overview Cards */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            '& > *': {
              flex: '1 1 calc(25% - 16px)',
              minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' },
            }
          }}
        >
          {cards.map((card, index) => (
            <MotionCard
              key={index}
              variants={cardVariants}
              sx={{
                background: card.gradient,
                color: 'white',
                borderRadius: 2,
                minHeight: CARD_HEIGHT,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {card.icon}
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                    {card.title}
                  </Typography>
                </Box>

                {!card.splitView && (
                  <>
                    <Typography variant="h4">{card.value}</Typography>
                    {card.subtitle && (
                      <Typography variant="body2" sx={{ opacity: 0.72 }}>
                        {card.subtitle}
                      </Typography>
                    )}
                  </>
                )}

                {card.chips && (
                  <Stack direction="row" spacing={1}>
                    {card.chips.map((chip, idx) => (
                      <Chip
                        key={idx}
                        icon={chip.icon as React.ReactElement}
                        label={chip.label}
                        sx={{
                          bgcolor: chip.color,
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                        size="small"
                      />
                    ))}
                  </Stack>
                )}

                {card.splitView && card.leftValue && card.rightValue && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.72 }}>
                        {card.leftValue.label}
                      </Typography>
                      <Typography variant="h6">
                        {card.leftValue.value}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.72 }}>
                        {card.rightValue.label}
                      </Typography>
                      <Typography variant="h6">
                        {card.rightValue.value}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </MotionCard>
          ))}
        </Box>

        {/* Commission Levels */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Commission Structure</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              '& > *': {
                flex: '1 1 calc(33.333% - 16px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' },
              }
            }}
          >
            {teamCommisionLevels.map((TeamCommisionLevel: TeamCommisionLevel, index: number) => (
              <MotionCard
                key={index}
                variants={cardVariants}
                sx={{
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: selectedLevel === TeamCommisionLevel.level ? `2px solid ${theme.palette.primary.main}` : 'none',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  },
                  minHeight: CARD_HEIGHT,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: selectedLevel === TeamCommisionLevel.level ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)'
                }}
                onClick={() => setSelectedLevel(TeamCommisionLevel.level)}
              >
                <CardContent
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" color="primary" fontWeight={700}>
                        Level {TeamCommisionLevel.level}
                      </Typography>
                      <Chip
                        label={`${TeamCommisionLevel.percentage}%`}
                        color="primary"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          height: 24,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                        height: '100px'
                      }}
                    >
                      {TeamCommisionLevel.description}
                    </Typography>
                  </Box>
                  <Box>
                    <Divider sx={{ mb: 1 }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">
                        Members: {teamMembers.find(member => member.level === TeamCommisionLevel.level)?.members.length}
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight={600}>
                        ${levelEarnings.find(earning => earning.level === TeamCommisionLevel.level)?.earnings}
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </MotionCard>
            ))}
          </Box>
        </Box>

        {/* Members Table */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>Team Members</Typography>
            <Chip
              label={`Total: ${teamMembers.reduce((acc, team) => acc + team.members.length, 0)}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
          <TableContainer
            component={MotionPaper}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: theme.shadows[2],
              '& .MuiTableRow-root:last-child .MuiTableCell-body': {
                borderBottom: 'none'
              }
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }} align="center">Registration Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }} align="center">Username</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }} align="center">Level</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }} align="center">State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamMembers.reduce((acc, team) => acc + team.members.length, 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">No members found</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {teamMembers.map((team: { level: number, members: User[] }) => (
                  team.members.map((member: User, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        transition: '0.2s'
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }} align="center">{getFormattedDateTime(new Date(member.createdAt.toLocaleString()))}</TableCell>
                      <TableCell sx={{ py: 1.5 }} align="center">
                        <Typography variant="body2" fontWeight={500}>
                          {member.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }} align="center">{team.level}</TableCell>
                      <TableCell sx={{ py: 1.5 }} align="center">
                        <Chip
                          size="small"
                          label={member.status === 'active' && member.accountValue.totalAssetValue > 100 ? 'Active' : 'Inactive'}
                          color={member.status === 'active' && member.accountValue.totalAssetValue > 100 ? 'success' : 'default'}
                          sx={{
                            fontWeight: 500,
                            height: 24,
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Live Activity */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>Live Activity</Typography>
          </Stack>
          <TableContainer
            component={MotionPaper}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: theme.shadows[2],
              '& .MuiTableRow-root:last-child .MuiTableCell-body': {
                borderBottom: 'none'
              }
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Member</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }} align="right">Amount (USD)</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">No activities found</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {teamActivities.map((activity, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        transform: 'translateX(2px)',
                        transition: '0.2s',
                      }
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={600} sx={{ textDecoration: 'underline' }}>
                        {activity.member.email.slice(0, 3) + '*.com'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={activity.log.type}
                        size="small"
                        color={activity.log.type === 'deposit' ? 'success' : 'primary'}
                        sx={{
                          fontWeight: 500,
                          height: 22,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Typography fontWeight={600} color="primary">
                        USD {activity.log.amount.toFixed(8)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {getFormattedDateTime(new Date(activity.log.timestamp))}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </MotionContainer>
    </Layout>
  );
} 