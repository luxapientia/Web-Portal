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
} from "@mui/material";
import { EditOutlined, SaveOutlined, CloseOutlined, ContentCopy } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";

type WalletInfo = {
  type: string;
  id: string;
};

export default function WalletInfoTab() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    type: "",
    id: "",
  });

  // Update wallet info when user data changes
  useEffect(() => {
    if (user) {
      const walletType = user.withdrawalWallet?.type || "";
      const walletId = user.withdrawalWallet?.id || "";
      
      // Set wallet info from user data
      setWalletInfo({
        type: walletType,
        id: walletId,
      });
    }
  }, [user]);

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWalletInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (editMode && user) {
      // Reset wallet info to user data when canceling edit
      const walletType = user.withdrawalWallet?.type || "";
      const walletId = user.withdrawalWallet?.id || "";
      
      setWalletInfo({
        type: walletType,
        id: walletId,
      });
    }
    setEditMode(!editMode);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Prepare data for submission - only wallet info
      const walletData = {
        withdrawalWallet: walletInfo.type && walletInfo.id ? walletInfo : undefined
      };
      
      // Update user profile
      const response = await fetchWithAuth('/api/profile/wallet', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData),
        requireAuth: true
      });

      if (response) {
        const data = await response.json();
        if (data.success) {
          toast.success('Wallet information updated successfully!');
          
          // Update user data
          if (data.user) {
            login(localStorage.getItem('token') || '', data.user);
          }
          setEditMode(false);
        } else {
          throw new Error(data.error || 'Failed to update wallet information');
        }
      }
    } catch (error) {
      console.error('Error updating wallet information:', error);
      toast.error('Failed to update wallet information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
              title="Withdrawal Wallet"
              titleTypographyProps={{ variant: "h6", fontWeight: 500 }}
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  select
                  fullWidth
                  label="Wallet Type"
                  name="type"
                  value={walletInfo.type}
                  onChange={handleWalletChange}
                  disabled={!editMode || loading}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1 } }}
                >
                  <option value=""></option>
                  <option value="crypto">USDT(Ethereum), USDT(Tron)</option>
                </TextField>

                <TextField
                  fullWidth
                  label="Wallet ID / Account Number"
                  name="id"
                  value={walletInfo.id}
                  onChange={handleWalletChange}
                  disabled={!editMode || loading}
                  helperText="Enter your wallet address, bank account, or mobile money number"
                  variant="outlined"
                  InputProps={{ 
                    sx: { borderRadius: 1 },
                    endAdornment: !editMode && walletInfo.id ? (
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(walletInfo.id);
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
                          backgroundColor: "rgba(25, 118, 210, 0.08)", // primary light hover
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
                  <Tooltip title="Edit Wallet">
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
                Set up your withdrawal wallet to receive payments and
                withdrawals from your account.
              </Typography>
              <Typography variant="body2" paragraph>
                Make sure to provide accurate information to avoid delays in
                processing your withdrawals.
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Your withdrawal wallet information will be verified before you
                can make withdrawals.
              </Alert>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
