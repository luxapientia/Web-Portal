'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Tooltip,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Layout from '@/components/layout/Layout';
import ChatBox from '@/components/support/chatBox';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
  messages: number;
}

const SupportPage = () => {
  const theme = useTheme();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Replace with your actual URL
  const howItWorksUrl = "http://localhost:3000/admin/users";

  // Mock data - Replace with API call
  const mockTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: 'Withdrawal Issue',
      status: 'open',
      priority: 'high',
      createdAt: '2024-02-20',
      lastUpdate: '2024-02-21',
      messages: 3,
    },
    {
      id: 'TKT-002',
      subject: 'Account Verification',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-02-18',
      lastUpdate: '2024-02-19',
      messages: 5,
    },
    {
      id: 'TKT-003',
      subject: 'General Question',
      status: 'closed',
      priority: 'low',
      createdAt: '2024-02-15',
      lastUpdate: '2024-02-17',
      messages: 4,
    },
  ];

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'closed':
        return 'error';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          {/* Header with background */}
          <Box 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              background: theme => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  fontWeight="700"
                  sx={{ 
                    color: 'white',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  Support Center
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    maxWidth: 500 
                  }}
                >
                  Get help with your account, transactions, or general inquiries
                </Typography>
              </Box>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{ minWidth: { sm: 300 } }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HelpOutlineIcon />}
                  onClick={() => setShowHowItWorks(true)}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  How it works
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setShowNewTicket(true)}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  New Ticket
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* Tickets Table */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              My Support Tickets
            </Typography>
            <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>Ticket ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Messages</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Update</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockTickets.map((ticket) => (
                    <TableRow 
                      key={ticket.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: theme => alpha(theme.palette.primary.main, 0.02),
                        },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 500,
                        }}
                      >
                        {ticket.id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{ticket.subject}</TableCell>
                      <TableCell>
                        <Chip 
                          label={formatStatus(ticket.status)}
                          color={getStatusColor(ticket.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            px: 1,
                            '& .MuiChip-label': {
                              px: 1,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: getPriorityColor(ticket.priority),
                              boxShadow: theme => `0 0 0 2px ${alpha(getPriorityColor(ticket.priority), 0.2)}`,
                            }}
                          />
                          <Typography 
                            sx={{ 
                              fontWeight: 500,
                              color: getPriorityColor(ticket.priority),
                            }}
                          >
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Total messages">
                          <Box 
                            sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
                              borderRadius: 2,
                              px: 1.5,
                              py: 0.5,
                            }}
                          >
                            <ChatIcon sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                              {ticket.messages}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`Created: ${ticket.createdAt}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {ticket.lastUpdate}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => setSelectedTicket(ticket)}
                          startIcon={<ChatIcon />}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                              backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
                            },
                          }}
                        >
                          Open Chat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        {/* How it works Dialog */}
        <Dialog
          open={showHowItWorks}
          onClose={() => setShowHowItWorks(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              m: 0, 
              p: 3,
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            How it works
            <IconButton
              aria-label="close"
              onClick={() => setShowHowItWorks(false)}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'grey.500',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, height: '70vh' }}>
            <iframe
              src={howItWorksUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="How it works"
            />
          </DialogContent>
        </Dialog>

        {/* New Ticket Dialog */}
        <Dialog
          open={showNewTicket}
          onClose={() => setShowNewTicket(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle
            sx={{ 
              p: 3,
              pb: 2,
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            Create New Support Ticket
            <IconButton
              aria-label="close"
              onClick={() => setShowNewTicket(false)}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'grey.500',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <Box component="form" noValidate>
              <TextField
                fullWidth
                label="Subject"
                margin="normal"
                required
                variant="outlined"
                placeholder="Brief description of your issue"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Message"
                margin="normal"
                required
                multiline
                rows={4}
                variant="outlined"
                placeholder="Please provide detailed information about your issue"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={() => setShowNewTicket(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
              }}
            >
              Submit Ticket
            </Button>
          </DialogActions>
        </Dialog>

        {/* Chat Dialog */}
        {selectedTicket && (
          <ChatBox
            ticketId={selectedTicket.id}
            ticketSubject={selectedTicket.subject}
            open={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </Container>
    </Layout>
  );
};

export default SupportPage;
