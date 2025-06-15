import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Alert,
  IconButton,
  Tooltip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { EditOutlined, SaveOutlined, CloseOutlined, ContentCopy, Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import { User } from "@/models/User";

interface WalletAddress {
  chain: string;
  address: string;
}

interface WalletInfoTabProps {
  userData: User;
}

export function WalletInfoTab({ userData }: WalletInfoTabProps) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [supportedChains, setSupportedChains] = useState<string[]>([]);

  useEffect(() => {
    fetchSupportedChains();
    if (userData?.withdrawalWallet) {
      setWalletAddresses(userData.withdrawalWallet);
    }
  }, [userData]);

  const fetchSupportedChains = async () => {
    try {
      const response = await fetch('/api/wallet');
      if (!response.ok) {
        toast.error('Failed to fetch supported chains');
        return;
      }
      const data = await response.json();
      if (data.success) {
        const chains = data.data.supportedChains.map((chain: { chain: string }) => chain.chain);
        setSupportedChains(chains);
      }
    } catch (error) {
      console.error('Error fetching supported chains:', error);
      toast.error('Failed to fetch supported chains');
    }
  };

  const handleAddWallet = () => {
    setWalletAddresses([...walletAddresses, { chain: '', address: '' }]);
  };

  const handleRemoveWallet = (index: number) => {
    const newWallets = walletAddresses.filter((_, i) => i !== index);
    setWalletAddresses(newWallets);
  };

  const handleWalletChange = (index: number, field: keyof WalletAddress, value: string) => {
    const newWallets = [...walletAddresses];
    newWallets[index] = {
      ...newWallets[index],
      [field]: value
    };
    setWalletAddresses(newWallets);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset to original values when canceling
      setWalletAddresses(userData?.withdrawalWallet || []);
    }
    setEditMode(!editMode);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate wallet addresses
      const invalidWallets = walletAddresses.filter(wallet => !wallet.chain || !wallet.address);
      if (invalidWallets.length > 0) {
        toast.error('Please fill in all wallet information');
        return;
      }

      // Check for duplicate chains
      const chains = walletAddresses.map(w => w.chain);
      if (new Set(chains).size !== chains.length) {
        toast.error('Duplicate chains are not allowed');
        return;
      }
      
      const response = await fetch('/api/profile/wallet', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          withdrawalWallet: walletAddresses
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wallet information');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Wallet information updated successfully!');
        setEditMode(false);
      } else {
        throw new Error(data.error || 'Failed to update wallet information');
      }
    } catch (error) {
      console.error('Error updating wallet information:', error);
      toast.error('Failed to update wallet information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading user information...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Card sx={{ boxShadow: 1, position: "relative" }}>
            <CardHeader
              title="Withdrawal Wallets"
              titleTypographyProps={{ variant: "h6", fontWeight: 500 }}
            />
            <CardContent>
              <Stack spacing={3}>
                {walletAddresses.map((wallet, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Stack spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel>Chain</InputLabel>
                        <Select
                          value={wallet.chain}
                          label="Chain"
                          onChange={(e) => handleWalletChange(index, 'chain', e.target.value)}
                          disabled={!editMode || loading}
                        >
                          {supportedChains.map((chain) => (
                            <MenuItem 
                              key={chain} 
                              value={chain}
                              disabled={walletAddresses.some((w, i) => i !== index && w.chain === chain)}
                            >
                              {chain}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Wallet Address"
                        value={wallet.address}
                        onChange={(e) => handleWalletChange(index, 'address', e.target.value)}
                        disabled={!editMode || loading}
                        placeholder={`Enter your ${wallet.chain || 'selected chain'} wallet address`}
                        InputProps={{ 
                          sx: { borderRadius: 1 },
                          endAdornment: !editMode && wallet.address ? (
                            <Tooltip title="Copy to clipboard">
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(wallet.address);
                                  toast.success("Wallet address copied to clipboard!");
                                }}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null
                        }}
                      />
                    </Stack>
                    {editMode && walletAddresses.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveWallet(index)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: -36,
                          color: 'error.main'
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}

                {editMode && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddWallet}
                    disabled={loading}
                    sx={{
                      alignSelf: 'flex-start',
                      mt: 1
                    }}
                  >
                    Add Wallet
                  </Button>
                )}
              </Stack>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                {editMode ? (
                  <>
                    <IconButton
                      onClick={handleEditToggle}
                      disabled={loading}
                      size="small"
                      color="inherit"
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        padding: 0.75,
                        transition: "0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                      aria-label="Cancel"
                    >
                      <CloseOutlined fontSize="small" />
                    </IconButton>

                    <IconButton
                      onClick={handleSubmit}
                      disabled={loading}
                      size="small"
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        padding: 0.75,
                        boxShadow: "none",
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                          boxShadow: "none",
                        },
                      }}
                      aria-label="Save"
                    >
                      {loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SaveOutlined fontSize="small" />
                      )}
                    </IconButton>
                  </>
                ) : (
                  <Tooltip title="Edit Wallets">
                    <IconButton
                      color="primary"
                      onClick={handleEditToggle}
                      disabled={loading}
                      size="small"
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        padding: 0.75,
                        transition: "0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                      aria-label="Edit"
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Card sx={{ boxShadow: 1 }}>
            <CardHeader
              title="Withdrawal Information"
              titleTypographyProps={{ variant: "h6", fontWeight: 500 }}
            />
            <CardContent>
              <Typography variant="body2" paragraph>
                Set up your withdrawal wallets to receive payments and
                withdrawals from your account.
              </Typography>
              <Typography variant="body2" paragraph>
                Make sure to provide accurate wallet addresses for each blockchain network
                to avoid delays in processing your withdrawals.
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Your withdrawal wallet addresses will be verified before you
                can make withdrawals. Please ensure they are correct.
              </Alert>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
