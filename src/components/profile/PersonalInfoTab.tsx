// src/components/profile/PersonalInfoTab.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Divider,
  Tooltip,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  PhotoCamera,
  Close as CloseIcon,
  ContentCopy,
} from "@mui/icons-material";
import { User } from "@/models/User";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";

interface PersonalInfoTabProps {
  userData: User;
}

export function PersonalInfoTab({ userData }: PersonalInfoTabProps) {
  const { data: session } = useSession();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    idPassport: userData?.idPassport || '',
    image: userData?.image || '',
    invitationCode: userData?.invitationCode || '',
    myInvitationCode: userData?.myInvitationCode || '',
    isEmailVerified: userData?.isEmailVerified || false,
    isPhoneVerified: userData?.isPhoneVerified || false,
    isIdVerified: userData?.isIdVerified || false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarDialogOpen = () => {
    setAvatarDialogOpen(true);
  };

  const handleAvatarDialogClose = () => {
    setAvatarDialogOpen(false);
    // Reset avatar preview and file when dialog is closed without saving
    if (avatarFile) {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      setAvatarLoading(true);

      // Create a FormData object for the avatar
      const formDataWithFile = new FormData();
      formDataWithFile.append("avatar", avatarFile as File);

      // Send the avatar upload request
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formDataWithFile,
      });

      if (response) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setFormData((prev) => ({
            ...prev,
            image: data.avatarUrl,
          }));

          // Get the token from localStorage
          const token = localStorage.getItem('token');
          if (token) {
            // Sign in again with the token to refresh the session
            const result = await signIn('credentials', {
              accessToken: token,
              email: session?.user?.email,
              callbackUrl: '/dashboard',
              redirect: false
            });
            console.log(result);
          }

          toast.success("Avatar updated successfully!");
          setAvatarFile(null);
          setAvatarDialogOpen(false);
        } else {
          throw new Error(data.error || "Failed to update avatar");
        }
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
      // Reset avatar preview on error
      setAvatarPreview(null);
    } finally {
      setAvatarLoading(false);
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Avatar Change Dialog */}
      <Dialog
        open={avatarDialogOpen}
        onClose={handleAvatarDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Change Profile Picture
          <IconButton
            aria-label="close"
            onClick={handleAvatarDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Avatar
              sx={{
                width: 150,
                height: 150,
                mb: 3,
                boxShadow: 2,
              }}
              alt={formData.name}
              src={
                avatarPreview || formData.image || "/placeholder-avatar.jpg"
              }
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ mb: 2 }}
            >
              Select Image
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleAvatarChange}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleAvatarDialogClose}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAvatarUpload}
            color="primary"
            variant="contained"
            disabled={!avatarFile || avatarLoading}
            startIcon={avatarLoading ? <CircularProgress size={20} /> : null}
          >
            {avatarLoading ? "Uploading..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Left column - Avatar and status */}
        <Box
          sx={{
            width: { xs: "100%", md: "30%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box sx={{ position: "relative", margin: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Tooltip title="Change Avatar">
                  <IconButton
                    aria-label="change profile picture"
                    onClick={handleAvatarDialogOpen}
                    size="small"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                      width: 32,
                      height: 32,
                      border: "2px solid white",
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            >
              <Avatar
                sx={{
                  width: { xs: 100, md: 140 },
                  height: { xs: 100, md: 140 },
                  mb: 1,
                  boxShadow: 2,
                }}
                alt={formData.name}
                src={formData.image || "/placeholder-avatar.jpg"}
              />
            </Badge>
          </Box>
          <Typography variant="h6" gutterBottom fontWeight="500">
            {formData.name}
          </Typography>

          <Card sx={{ width: "100%", mb: 2, boxShadow: 1 }}>
            <CardHeader
              title="Build your team"
              titleTypographyProps={{ variant: "h6", fontWeight: 500, align: 'center' }}
            />
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Share this code with others to invite them to build your team
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ fontWeight: "medium", fontSize: "1.1rem" }}
                >
                  {formData.myInvitationCode || "N/A"}
                </Typography>
                {formData.myInvitationCode && (
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          formData.myInvitationCode || ""
                        );
                        toast.success("Invitation code copied to clipboard!");
                      }}
                      sx={{
                        padding: 0.5,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Invite friends and get rewards! You receive 2 USD (in your
                investment balance) for each invited user after their first
                deposit of 50 USD or More.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Right column - Form fields */}
        <Box sx={{ width: { xs: "100%", md: "70%" } }}>
          <Card sx={{ boxShadow: 1 }}>
            <CardHeader
              title="Personal Information"
              titleTypographyProps={{ variant: "h6", fontWeight: 500 }}
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1 },
                  }}
                  disabled={true}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    disabled={formData.isEmailVerified}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1 },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    // disabled={formData.isPhoneVerified}
                    variant="outlined"
                    disabled={true}
                    InputProps={{
                      sx: { borderRadius: 1 },
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="ID/Passport Number"
                  name="idPassport"
                  value={formData.idPassport || ""}
                  onChange={handleInputChange}
                  // disabled={formData.isIdVerified}
                  disabled={true}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1 },
                  }}
                />

                <TextField
                  fullWidth
                  label="Invitation Code (Optional)"
                  name="invitationCode"
                  value={formData.invitationCode || ""}
                  onChange={handleInputChange}
                  disabled={true}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1 },
                  }}
                  helperText="Enter invitation code if you were referred by someone"
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
