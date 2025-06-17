import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    Skeleton,
    Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface TransferSettings {
    transferFee: number;
    dailyTransferMaxLimit: number;
    dailyNumOfTransferLimit: number;
}

export default function TransferSetting() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<TransferSettings>({
        transferFee: 2,
        dailyTransferMaxLimit: 10000,
        dailyNumOfTransferLimit: 5,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof TransferSettings, string>>>({});

    useEffect(() => {
        fetchTransferSettings();
    }, []);

    const fetchTransferSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/transfer-settings');
            if (!response.ok) {
                throw new Error('Failed to fetch transfer settings');
            }
            const data = await response.json();
            setSettings(data.data);
        } catch (error) {
            console.error('Error fetching transfer settings:', error);
            toast.error('Failed to fetch transfer settings');
        } finally {
            setLoading(false);
        }
    };

    const validateField = (field: keyof TransferSettings, value: number): string | null => {
        if (isNaN(value)) {
            return 'Please enter a valid number';
        }

        switch (field) {
            case 'transferFee':
                if (value < 0) return 'Transfer fee percentage cannot be negative';
                if (value > 100) return 'Transfer fee percentage cannot exceed 100%';
                break;
            case 'dailyTransferMaxLimit':
                if (value < 0) return 'Daily transfer limit cannot be negative';
                if (value > 1000000) return 'Daily transfer limit cannot exceed 1,000,000';
                break;
            case 'dailyNumOfTransferLimit':
                if (value < 1) return 'Must allow at least 1 transfer per day';
                if (value > 100) return 'Daily transfer count cannot exceed 100';
                if (!Number.isInteger(value)) return 'Must be a whole number';
                break;
        }
        return null;
    };

    const handleInputChange = (field: keyof TransferSettings, value: string) => {
        const numValue = parseFloat(value);
        const error = validateField(field, numValue);
        
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));

        if (!error) {
            setSettings(prev => ({
                ...prev,
                [field]: numValue
            }));
        }
    };

    const handleSave = async () => {
        if (Object.values(errors).some(error => error !== null)) return;

        try {
            setSaving(true);
            const response = await fetch('/api/admin/transfer-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                throw new Error('Failed to update transfer settings');
            }

            toast.success('Transfer settings updated successfully');
            await fetchTransferSettings();
        } catch (error) {
            console.error('Error saving transfer settings:', error);
            toast.error('Failed to update transfer settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box>
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center" 
                mb={3}
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 2
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    Transfer Settings
                </Typography>
                <Button
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    variant="outlined"
                    disabled={Object.values(errors).some(error => error !== null) || saving}
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
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Stack>

            <Stack spacing={3} maxWidth={800} mx="auto">
                <Alert severity="info">
                    <Typography variant="body2">
                        These settings control transfer fees and limits within the platform.
                        Changes will affect all users immediately.
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
                    {loading ? (
                        <Stack spacing={3}>
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                        </Stack>
                    ) : (
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Transfer Fee (%)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={settings.transferFee}
                                    onChange={(e) => handleInputChange('transferFee', e.target.value)}
                                    error={!!errors.transferFee}
                                    helperText={errors.transferFee}
                                    inputProps={{
                                        min: 0,
                                        max: 100,
                                        step: 0.01
                                    }}
                                    placeholder="Enter transfer fee percentage"
                                    size="small"
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Daily Transfer Limit ($)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={settings.dailyTransferMaxLimit}
                                    onChange={(e) => handleInputChange('dailyTransferMaxLimit', e.target.value)}
                                    error={!!errors.dailyTransferMaxLimit}
                                    helperText={errors.dailyTransferMaxLimit}
                                    inputProps={{
                                        min: 0,
                                        step: 1
                                    }}
                                    placeholder="Enter daily transfer limit"
                                    size="small"
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Daily Transfer Count
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={settings.dailyNumOfTransferLimit}
                                    onChange={(e) => handleInputChange('dailyNumOfTransferLimit', e.target.value)}
                                    error={!!errors.dailyNumOfTransferLimit}
                                    helperText={errors.dailyNumOfTransferLimit}
                                    inputProps={{
                                        min: 1,
                                        step: 1
                                    }}
                                    placeholder="Enter daily transfer count"
                                    size="small"
                                />
                            </Box>
                        </Stack>
                    )}
                </Paper>
            </Stack>
        </Box>
    );
}
