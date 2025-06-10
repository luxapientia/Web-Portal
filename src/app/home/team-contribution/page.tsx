"use client";

import { useState } from 'react';
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
  Tooltip,
  Chip,
  LinearProgress,
  Grid as MuiGrid,
  Card,
  CardContent,
  Badge
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import VipPromotions from '@/components/home/VipPromotions';

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

interface TeamMember {
  registrationDate: string;
  username: string;
  state: 'Active' | 'Not Active';
}

interface LiveActivity {
  username: string;
  action: string;
  amount: number;
  timeAgo: string;
}

interface CommissionLevel {
  level: number;
  percentage: number;
  description: string;
  memberCount: number;
  totalEarnings: number;
}

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

const Grid = MuiGrid as any; // Temporary type assertion to fix build errors

const CARD_HEIGHT = 140; // Fixed height for all cards

export default function TeamContributionPage() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  // Sample data - replace with actual data from your API
  const teamStats = {
    vipLevel: 1,
    totalEarning: 5000,
    todayEarning: 1200,
    totalMembers: 10,
    depositToday: 1500,
    withdrawToday: 5500,
    activeMembers: 7,
    inactiveMembers: 3,
    monthlyGrowth: 25, // percentage
  };

  const teamMembers: TeamMember[] = [
    { registrationDate: '10-May-2025 11:44:33', username: 'dv1241', state: 'Active' },
    { registrationDate: '10-May-2025 11:44:33', username: 'ladmode', state: 'Not Active' },
    { registrationDate: '10-May-2025 11:44:33', username: 'sameer991', state: 'Not Active' },
  ];

  const liveActivities: LiveActivity[] = [
    { username: 'hs***.com', action: 'Deposited', amount: 200.00, timeAgo: '3 minutes ago' },
    { username: 'ali****.online', action: 'earned', amount: 150.00, timeAgo: '10 minutes ago' },
    { username: 'justi****.sg', action: 'Deposited', amount: 400.00, timeAgo: '15 minutes ago' },
  ];

  const commissionLevels: CommissionLevel[] = [
    {
      level: 1,
      percentage: 18,
      description: "Direct referrals with highest commission rate",
      memberCount: 5,
      totalEarnings: 2500
    },
    {
      level: 2,
      percentage: 7,
      description: "Second-tier referrals with medium commission",
      memberCount: 3,
      totalEarnings: 1500
    },
    {
      level: 3,
      percentage: 3,
      description: "Third-tier referrals with base commission",
      memberCount: 2,
      totalEarnings: 1000
    }
  ];

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
      value: `$${teamStats.totalEarning}`,
      subtitle: `+${teamStats.monthlyGrowth}% this month`,
      gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />,
      title: "Today's Earnings",
      value: `$${teamStats.todayEarning}`,
      subtitle: `From ${teamStats.activeMembers} active members`,
      gradient: 'linear-gradient(135deg, #007bff 0%, #17a2b8 100%)'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 28 }} />,
      title: "Team Members",
      value: teamStats.totalMembers.toString(),
      chips: [
        {
          icon: <CheckCircleIcon sx={{ fontSize: '14px !important' }} />,
          label: `${teamStats.activeMembers} Active`,
          color: 'rgba(255,255,255,0.2)'
        },
        {
          icon: <CancelIcon sx={{ fontSize: '14px !important' }} />,
          label: `${teamStats.inactiveMembers} Inactive`,
          color: 'rgba(255,255,255,0.1)'
        }
      ],
      gradient: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)'
    },
    {
      icon: <PeopleOutlineIcon sx={{ fontSize: 28 }} />,
      title: "Daily Activity",
      splitView: true,
      leftValue: {
        label: "Deposits",
        value: `$${teamStats.depositToday}`
      },
      rightValue: {
        label: "Withdraws",
        value: `$${teamStats.withdrawToday}`
      },
      gradient: 'linear-gradient(135deg, #fd7e14 0%, #dc3545 100%)'
    }
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
            {commissionLevels.map((level) => (
              <MotionCard
                key={level.level}
                variants={cardVariants}
                sx={{
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: selectedLevel === level.level ? `2px solid ${theme.palette.primary.main}` : 'none',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  },
                  minHeight: CARD_HEIGHT,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: selectedLevel === level.level ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)'
                }}
                onClick={() => setSelectedLevel(level.level)}
              >
                <CardContent
                  sx={{
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" color="primary" fontWeight={700}>
                        Level {level.level}
                      </Typography>
                      <Chip
                        label={`${level.percentage}%`}
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
                        lineHeight: 1.2
                      }}
                    >
                      {level.description}
                    </Typography>
                  </Box>
                  <Box>
                    <Divider sx={{ mb: 1 }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">
                        Members: {level.memberCount}
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight={600}>
                        ${level.totalEarnings}
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
              label={`Total: ${teamStats.totalMembers}`}
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
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Registration Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Username</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamMembers.map((member, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      transition: '0.2s'
                    }}
                  >
                    <TableCell sx={{ py: 1.5 }}>{member.registrationDate}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {member.username}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        size="small"
                        label={member.state}
                        color={member.state === 'Active' ? 'success' : 'default'}
                        sx={{
                          fontWeight: 500,
                          height: 24,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Live Activity */}
        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>Live Activity</Typography>
          <MotionPaper
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.9)',
              '& > div:last-child': {
                borderBottom: 'none'
              }
            }}
          >
            <Stack divider={<Divider />}>
              {liveActivities.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.5,
                    transition: '0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.02)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight={500}>
                        <span style={{ textDecoration: 'underline' }}>{activity.username}</span>
                        {' '}{activity.action}
                        <Typography component="span" color="primary" fontWeight={600}>
                          USD {activity.amount.toFixed(2)}
                        </Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.timeAgo}
                      </Typography>
                    </Stack>
                    <Chip
                      size="small"
                      label={activity.action}
                      color={activity.action === 'Deposited' ? 'success' : 'primary'}
                      sx={{
                        fontWeight: 500,
                        height: 24,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </MotionPaper>
        </Box>
      </MotionContainer>
    </Layout>
  );
} 