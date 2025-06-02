import { 
  Box, 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Button,
} from '@mui/material';
import { 
  VerifiedUser as VerifiedIcon, 
  ErrorOutline as UnverifiedIcon,
  CheckCircle
} from '@mui/icons-material';

interface VerificationCardProps {
  title: string;
  isVerified: boolean | undefined;
  value: string;
  verifyAction?: () => void;
  verifyButtonText?: string;
  verifyButtonLink?: string;
}

const VerificationCard = ({ 
  title, 
  isVerified, 
  value, 
  verifyAction, 
  verifyButtonText = "Verify Now",
  verifyButtonLink
}: VerificationCardProps) => {
  
  const getVerificationStatus = (isVerified: boolean | undefined) => {
    return isVerified ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircle color="success" fontSize="small" />
        <Typography variant="body2" color="success.main">Verified</Typography>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <UnverifiedIcon color="error" fontSize="small" />
        <Typography variant="body2" color="error.main">Not Verified</Typography>
      </Box>
    );
  };

  const handleVerifyClick = () => {
    if (verifyButtonLink) {
      window.location.href = verifyButtonLink;
    } else if (verifyAction) {
      verifyAction();
    }
  };

  return (
    <Card sx={{ height: '100%', boxShadow: 1 }}>
      <CardHeader 
        title={title} 
        avatar={
          isVerified ? 
          <VerifiedIcon color="success" /> : 
          <UnverifiedIcon color="error" />
        }
        titleTypographyProps={{ variant: 'h6', fontWeight: 500 }}
      />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          {getVerificationStatus(isVerified)}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {title}: {value}
        </Typography>
        {!isVerified && (
          <Button 
            variant="contained" 
            size="small" 
            sx={{ mt: 1 }}
            onClick={handleVerifyClick}
          >
            {verifyButtonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationCard;