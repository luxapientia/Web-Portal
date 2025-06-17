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
} from '@mui/material';
import { ContentCopy, Edit as EditIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface WalletAddress {
  address: string;
  chain: string;
}

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  wallet: WalletAddress | null;
  onSave: (chain: string, address: string) => Promise<void>;
}

function EditDialog({ open, onClose, wallet, onSave }: EditDialogProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (wallet) {
      setAddress(wallet.address);
      setError('');
    }
  }, [wallet]);

  const handleSave = async () => {
    if (!wallet) return;
    if (!address.trim()) {
      setError('Address is required');
      return;
    }

    try {
      setSaving(true);
      await onSave(wallet.chain, address.trim());
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
        Edit {wallet?.chain} Wallet Address
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Wallet Address"
            fullWidth
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error || 'Enter the new wallet address for this chain'}
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
          disabled={saving || !address.trim() || !!error}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SystemWalletSetting() {
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [editWallet, setEditWallet] = useState<WalletAddress | null>(null);

  useEffect(() => {
    fetchWalletAddresses();
  }, []);

  const fetchWalletAddresses = async () => {
    try {
      const response = await fetch('/api/wallet');
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chain, address }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Wallet address updated successfully');
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
                walletAddresses.map((wallet) => (
                  <TableRow key={wallet.chain}>
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
                            onClick={() => setEditWallet(wallet)}
                          >
                            <EditIcon />
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
        open={!!editWallet}
        onClose={() => setEditWallet(null)}
        wallet={editWallet}
        onSave={handleSaveAddress}
      />
    </Box>
  );
} 