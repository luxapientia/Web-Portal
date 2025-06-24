import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ContentCopy, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { CentralWalletWithoutId } from '@/models/CentralWallet';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  wallet: CentralWalletWithoutId | null;
  onSave: (chain: string, address: string) => Promise<void>;
  isNew?: boolean;
}

function EditDialog({ open, onClose, wallet, onSave, isNew = false }: EditDialogProps) {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (wallet) {
      setAddress(wallet.address);
      setChain(wallet.chain);
      setError('');
    } else if (isNew) {
      setAddress('');
      setChain('');
      setError('');
    }
  }, [wallet, isNew]);

  const handleSave = async () => {
    if (isNew && !chain) {
      setError('Chain is required');
      return;
    }
    if (!address.trim()) {
      setError('Address is required');
      return;
    }

    try {
      setSaving(true);
      await onSave(chain || wallet!.chain, address.trim());
      onClose();
    } catch (error) {
      console.error('Error saving wallet address:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isNew ? 'Add New Wallet' : `Edit ${wallet?.chain} Wallet Address`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {isNew && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Chain</InputLabel>
              <Select
                value={chain}
                label="Chain"
                onChange={(e) => {
                  setChain(e.target.value);
                  setError('');
                }}
                disabled={saving}
              >
                <MenuItem value="Ethereum">Ethereum</MenuItem>
                <MenuItem value="Binance">Binance</MenuItem>
                <MenuItem value="Tron">Tron</MenuItem>
              </Select>
            </FormControl>
          )}
          <TextField
            label="Wallet Address"
            fullWidth
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error || 'Enter the wallet address for this chain'}
            disabled={saving}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={saving || !address.trim() || (isNew && !chain) || !!error}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SystemWalletSetting() {
  const [walletAddresses, setWalletAddresses] = useState<CentralWalletWithoutId[]>([]);
  const [loading, setLoading] = useState(true);
  const [editWallet, setEditWallet] = useState<CentralWalletWithoutId | null>(null);
  const [isNewWallet, setIsNewWallet] = useState(false);

  useEffect(() => {
    fetchWalletAddresses();
  }, []);

  const fetchWalletAddresses = async () => {
    try {
      const response = await fetch('/api/admin/wallet');
      const data = await response.json();
      
      if (data.success) {
        setWalletAddresses(data.data.walletAddresses);
      } else {
        toast.error('Failed to fetch wallet addresses');
      }
    } catch (error) {
      console.error('Error fetching wallet addresses:', error);
      toast.error('Failed to fetch wallet addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (chain: string, address: string) => {
    try {
      const response = await fetch('/api/admin/wallet', {
        method: isNewWallet ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chain, address }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isNewWallet ? 'Wallet created successfully' : 'Wallet address updated successfully');
        fetchWalletAddresses(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to update wallet address');
      }
    } catch (error) {
      console.error('Error updating wallet address:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update wallet address');
      throw error;
    }
  };

  const handleDeleteWallet = async (chain: string) => {
    try {
      const response = await fetch('/api/admin/wallet', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chain }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Wallet deleted successfully');
        fetchWalletAddresses(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to delete wallet');
      }
    } catch (error) {
      console.error('Error deleting wallet:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete wallet');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Address copied to clipboard'))
      .catch(() => toast.error('Failed to copy address'));
  };

  return (
    <Box>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          System Wallet Addresses
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsNewWallet(true);
            setEditWallet(null);
          }}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            px: 2,
            py: 1,
            borderColor: 'primary.main',
            color: 'primary.main',
            bgcolor: 'background.paper',
            '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
                borderColor: 'primary.main',
            },
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
        >
          Add Wallet
        </Button>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          These are the system wallet addresses used for deposits and other platform operations.
          Each chain has its dedicated wallet address. Please ensure you enter valid addresses when updating.
        </Typography>
      </Alert>

      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Chain</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {[...Array(3)].map((_, cellIndex) => (
                      <TableCell key={`cell-${cellIndex}`}>
                        <Skeleton animation="wave" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : walletAddresses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">No wallet addresses found</TableCell>
                </TableRow>
              ) : (
                walletAddresses.map((wallet, index) => (
                  <TableRow key={index}>
                    <TableCell>{wallet.chain}</TableCell>
                    <TableCell>
                      <Box sx={{ 
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {wallet.address}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Copy Address">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(wallet.address)}
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Address">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setIsNewWallet(false);
                              setEditWallet(wallet);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Wallet">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteWallet(wallet.chain)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EditDialog
        open={!!editWallet || isNewWallet}
        onClose={() => {
          setEditWallet(null);
          setIsNewWallet(false);
        }}
        wallet={editWallet}
        onSave={handleSaveAddress}
        isNew={isNewWallet}
      />
    </Box>
  );
} 