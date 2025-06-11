import { Card, CardContent, Typography, Divider, Stack, Box, Button, Tooltip, Modal, List, ListItem, ListItemIcon, Paper, Chip } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { motion } from 'framer-motion';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { DailyTask } from '@/models/DailyTask';

export default function TasksForToday() {
  const [taskLimit, setTaskLimit] = useState<number>(0);
  const [remainingTasks, setRemainingTasks] = useState<number>(0);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [curTask, setCurTask] = useState<DailyTask | null>(null);
  const [isTaskRunning, setIsTaskRunning] = useState<boolean>(false);
  const [displayedPercent, setDisplayedPercent] = useState<number>(0);
  const [pulse, setPulse] = useState<boolean>(false);
  const [progressTarget, setProgressTarget] = useState<number>(0);
  const [reward, setReward] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const circumference = 2 * Math.PI * 48;
  const dashOffset = circumference * (1 - displayedPercent / 100);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/daily-task/get-tasks');
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to get tasks');
        return;
      }

      setTaskLimit(result.data.taskLimit);
      setRemainingTasks(result.data.remainingTasks);
      setTasks(result.data.tasks);
    } catch {
      toast.error('Failed to get tasks');
    } finally {
      setLoading(false);
    }
  };

  const startTask = useCallback(async () => {
    if (isTaskRunning || remainingTasks === 0 || loading) return;

    if ( curTask ) {
      toast.error('You have already started a task');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/daily-task/start-task');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start task');
      }

      const task = result.data.task;
      setCurTask(result.data.task);
      setTaskLimit(result.data.taskLimit);
      setRemainingTasks(result.data.remainingTasks);
      setTasks(result.data.tasks);  
      if (!task) {
        toast.error('No available tasks for today');
        return;
      }

      setIsTaskRunning(true);
      setDisplayedPercent(0);
      setProgressTarget(0);
      setPulse(false);

      // Start the 20-second animation
      const startTime = Date.now();
      const duration = 20000; // 20 seconds

      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);

        setDisplayedPercent(Math.round(progress));
        setProgressTarget(progress);

        if (progress < 100) {
          requestAnimationFrame(animateProgress);
        } else {
          // Task completed
          completeTask(task);
        }
      };

      requestAnimationFrame(animateProgress);
      
    } catch {
      toast.error('Failed to start task');
      setIsTaskRunning(false);
      setCurTask(null);
      setLoading(false);
    }
  }, [isTaskRunning, remainingTasks, loading]);
  
  const completeTask = async (task: DailyTask) => {
    try {
      setLoading(true);
      const response = await fetch('/api/daily-task/end-task', {
        method: 'POST',
        body: JSON.stringify({ taskId: task._id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to complete task');
      }

      setPulse(true);
      toast.success('Task completed successfully!');
      setReward(result.data.reward);
      setTasks(result.data.tasks);
    } catch {
      toast.error('Failed to complete task');
    } finally {
      setIsTaskRunning(false);
      setDisplayedPercent(0);
      setProgressTarget(0);
      setPulse(false);
      setCurTask(null);
      setLoading(false);
    }
  };
  console.log(reward)
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              {remainingTasks}/{taskLimit}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Tasks Remaining for the day
            </Typography>
          </Stack>
          <Typography variant="body1" fontWeight={700} mt={1}>
            {isTaskRunning ? 'Keep the progress bar running to complete the task' : 'Activate Daily Booster AI trading Bot'}
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
            <Button
              onClick={startTask}
              disabled={isTaskRunning || remainingTasks === 0 || loading}
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
              {isTaskRunning ? 'Task in Progress...' : loading ? 'Loading...' : 'Start Task'}
            </Button>
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
            onClick={handleOpenModal}
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

      {/* Tasks Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="tasks-modal-title"
        aria-describedby="tasks-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '600px' },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="tasks-modal-title" variant="h5" component="h2" fontWeight={700} mb={1}>
            Daily Tasks Overview
          </Typography>
          
          {/* Date and Stats Section */}
          <Box sx={{ mb: 3, mt: 2 }}>
            {/* Date Header */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarTodayIcon />
                <Typography variant="subtitle1">
                  {formatDate(new Date().toISOString())}
                </Typography>
              </Stack>
            </Paper>
            
            {/* Stats Cards */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ width: '100%' }}
            >
              <Paper sx={{ p: 2, bgcolor: '#e8f5e9', flex: 1 }}>
                <Typography variant="h6" color="success.main" fontWeight={700}>
                  {tasks.filter(t => t.isCompleted).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed Tasks
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, bgcolor: '#fff3e0', flex: 1 }}>
                <Typography variant="h6" color="warning.main" fontWeight={700}>
                  {tasks.filter(t => !t.isCompleted).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Not Completed
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, bgcolor: '#e3f2fd', flex: 1 }}>
                <Typography variant="h6" color="primary.main" fontWeight={700}>
                  {remainingTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remaining Tasks
                </Typography>
              </Paper>
            </Stack>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Tasks List */}
          <List sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            '& .MuiListItem-root': {
              mb: 1,
              bgcolor: '#f5f5f5',
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#eeeeee',
                transform: 'translateX(4px)'
              }
            }
          }}>
            {Array.from({ length: taskLimit }).map((_, index) => {
              const task = tasks.find(t => t.taskIndex === index + 1);
              return (
                <ListItem 
                  key={index} 
                  sx={{ 
                    py: 2,
                    px: 3,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {task?.isCompleted ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <RadioButtonUncheckedIcon color="disabled" />
                        )}
                      </ListItemIcon>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Task {index + 1}
                      </Typography>
                      <Box flexGrow={1} />
                      <Chip 
                        label={task ? (task.isCompleted ? 'Completed' : 'Not Completed') : 'Not Started'}
                        color={task ? (task.isCompleted ? 'success' : 'warning') : 'default'}
                        size="small"
                        sx={{ minWidth: 100 }}
                      />
                    </Stack>
                    
                    {task && (
                      <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2}
                        ml={7}
                        sx={{ 
                          typography: 'body2',
                          color: 'text.secondary'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2">
                            Started: {formatTime(task.createdAt.toString())}
                          </Typography>
                        </Box>
                        {task.isCompleted && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                            <Typography variant="body2">
                              Completed: {formatTime(task.updatedAt.toString())}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    )}
                  </Box>
                </ListItem>
              );
            })}
          </List>

          {/* Footer Actions */}
          <Box sx={{ 
            mt: 3, 
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCloseModal}
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
            {remainingTasks > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleCloseModal();
                  startTask();
                }}
                disabled={isTaskRunning}
                sx={{ borderRadius: 2 }}
              >
                Start New Task
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </motion.div>
  );
} 