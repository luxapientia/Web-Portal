import { Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AddButtonProps {
    onClick: () => void;
    label: string;
}

export const AddButton = ({ onClick, label }: AddButtonProps) => (
    <Button
        onClick={onClick}
        startIcon={<AddIcon />}
        variant="outlined"
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
        {label}
    </Button>
); 