'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  Dialog,
  Stack,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: string;
  attachments?: string[];
}

interface ChatBoxProps {
  ticketId: string;
  ticketSubject: string;
  open: boolean;
  onClose: () => void;
}

const ChatBox = ({ ticketId, ticketSubject, open, onClose }: ChatBoxProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'support',
      timestamp: '10:00 AM',
    },
    {
      id: '2',
      content: 'I have a question about my account.',
      sender: 'user',
      timestamp: '10:01 AM',
    },
    {
      id: '3',
      content: 'Sure, I\'d be happy to help. What specific question do you have?',
      sender: 'support',
      timestamp: '10:02 AM',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log('Files selected:', files);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '800px',
        }
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" component="div">
              {ticketSubject}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Ticket ID: {ticketId}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            bgcolor: 'background.default',
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main',
                  width: 32,
                  height: 32,
                }}
              >
                {msg.sender === 'user' ? 'U' : 'S'}
              </Avatar>
              <Box
                sx={{
                  maxWidth: '70%',
                  mx: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: msg.sender === 'user' ? 'primary.light' : 'background.paper',
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{msg.content}</Typography>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {msg.attachments.map((attachment, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          component="div"
                          sx={{
                            color: msg.sender === 'user' ? 'inherit' : 'primary.main',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          {attachment}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Paper>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    color: 'text.secondary',
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {msg.timestamp}
                </Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleFileUpload}
              sx={{ p: 1 }}
            >
              <AttachFileIcon />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Stack>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            multiple
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default ChatBox;
