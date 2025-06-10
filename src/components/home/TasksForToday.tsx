import { Card, CardContent, Typography, Divider, Stack, Box, Button, Tooltip } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion } from 'framer-motion';
import React from 'react';

interface TasksForTodayProps {
  displayedPercent: number;
  pulse: boolean;
  progressTarget: number;
}

export default function TasksForToday({ displayedPercent, pulse, progressTarget }: TasksForTodayProps) {
  const circumference = 2 * Math.PI * 48;
  const dashOffset = circumference * (1 - displayedPercent / 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      <Card sx={{ mb: 2, borderRadius: 4, boxShadow: 3, p: 1, background: 'linear-gradient(135deg, #e1f5fe 0%, #fce4ec 100%)', position: 'relative', transition: 'box-shadow 0.2s, transform 0.2s', ':hover': { boxShadow: 6, transform: 'scale(1.01)' } }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Your tasks for today
            </Typography>
            <Tooltip title="Complete these tasks to earn more">
              <InfoOutlinedIcon fontSize="small" color="action" />
            </Tooltip>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Stack direction="row" alignItems="center" spacing={1}>
            <RocketLaunchIcon color="primary" />
            <Typography variant="body2" fontWeight={700}>
              5/5
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Tasks Remaining for the day
            </Typography>
          </Stack>
          <Typography variant="body1" fontWeight={700} mt={1}>
            Activate Daily Booster AI trading Bot
          </Typography>
          {/* Animated SVG Circular Progress with Framer Motion */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                bgcolor: '#111',
                borderRadius: 3,
                p: 2,
                boxShadow: 2,
                ':hover': { boxShadow: 8, transform: 'scale(1.05)' },
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
            >
              <motion.svg width="110" height="110" viewBox="0 0 110 110">
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ff99" />
                    <stop offset="50%" stopColor="#eaff00" />
                    <stop offset="100%" stopColor="#00e676" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Outer animated arc */}
                <circle cx="55" cy="55" r="48" stroke="#222" strokeWidth="10" fill="none" />
                <motion.circle
                  cx="55"
                  cy="55"
                  r="48"
                  fill="none"
                  stroke="url(#progress-gradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  style={{ filter: 'url(#glow)' }}
                />
                {/* Inner ticks */}
                {Array.from({ length: 40 }).map((_, i) => {
                  const angle = (i / 40) * 270 - 150; // 270deg sweep, start at -135deg
                  const rad = (angle * Math.PI) / 180;
                  const r1 = 38, r2 = 34; // inner and outer radius for ticks
                  const x1 = 55 + r1 * Math.cos(rad);
                  const y1 = 55 + r1 * Math.sin(rad);
                  const x2 = 55 + r2 * Math.cos(rad);
                  const y2 = 55 + r2 * Math.sin(rad);
                  // Highlight ticks up to progress
                  const tickProgress = (displayedPercent / 100) * 40;
                  const color = i < tickProgress ? '#00ff99' : '#333';
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={color}
                      strokeWidth={3}
                      strokeLinecap="round"
                      opacity={i < tickProgress ? 1 : 0.4}
                    />
                  );
                })}
              </motion.svg>
              {/* Animated percentage number with pulse */}
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                <motion.span
                  style={{
                    fontSize: 32,
                    color: '#eaff00',
                    fontWeight: 900,
                    textShadow: '0 0 16px #eaff00',
                  }}
                  animate={pulse ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 0.7 }}
                >
                  {displayedPercent}%
                </motion.span>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Box
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                px: 2.5,
                py: 0.5,
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: 1,
                letterSpacing: 0.5,
              }}
            >
              Analyzing Trade &gt; activate trade Bot &gt; Finished
            </Box>
          </Box>
          {/* Animated horizontal progress bar */}
          <Box
            sx={{
              width: '90%',
              mx: 'auto',
              mb: 2,
              height: 12,
              borderRadius: 6,
              background: '#e0e0e0',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00e676 0%, #00bfae 100%)',
                borderRadius: 6,
                boxShadow: '0 0 8px #00e67688',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressTarget}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </Box>
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
              mb: 1,
            }}
          >
            Show My Tasks for the day
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
} 