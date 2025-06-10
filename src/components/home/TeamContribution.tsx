import { Card, CardContent, Stack, Typography, Tooltip, Button, TextField, InputAdornment, IconButton, useTheme, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TeamContributionProps {
  invitationLink: string;
  invitationCode: string;
  copied: boolean;
  handleCopy: (text: string) => void;
}

export default function TeamContribution({ invitationLink, invitationCode, copied, handleCopy }: TeamContributionProps) {
  const user = useSession();
  const router = useRouter();

  const handleViewTeamStatus = () => {
    router.push('/home/team-contribution');
  };

  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: 4,
        boxShadow: 3,
        p: 1,
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e0f2f1 100%)',
        minWidth: 0,
        maxWidth: { xs: '100%', md: 420 },
        mx: { xs: 0, md: 'auto' },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}>
            Team Contribution
          </Typography>
          <Tooltip title="Total value contributed by your team">
            <InfoOutlinedIcon fontSize="small" color="action" />
          </Tooltip>
        </Stack>
        <Typography variant="h6" color="primary" fontWeight={800} mt={1} sx={{ fontSize: { xs: '1.3rem', md: '1.7rem' } }}>
          $5,000
        </Typography>

        {/* Inline Invitation UI */}
        <Typography variant="h6" fontWeight={700} mb={2} mt={3}>
          Share Link and Invitation Code
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <TextField
            value={invitationLink}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={copied ? 'Copied!' : 'Copy'}>
                    <IconButton onClick={() => handleCopy(invitationLink)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            size="small"
            fullWidth
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body1" color="text.secondary">
            Invitation Code :
          </Typography>
          <Typography variant="body1" fontWeight={800} color="primary.main">
            {user.data?.user.myInvitationCode}
          </Typography>
          <Tooltip title={copied ? 'Copied!' : 'Copy'}>
            <IconButton onClick={() => handleCopy(user.data?.user.myInvitationCode || '')}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {copied && <Typography variant="caption" color="success.main">Copied!</Typography>}
        </Stack>
      </CardContent>
      <Box sx={{
        p: 1
      }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleViewTeamStatus}
          sx={{
            mt: 2,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: { xs: '1rem', md: '1.1rem' },
            boxShadow: 1,
            transition: '0.2s',
            ':hover': { boxShadow: 3, transform: 'translateY(-2px)' },
            py: { xs: 1, md: 1.5 },
          }}
        >
          View My Team Status
        </Button>
      </Box>
    </Card>
  );
} 