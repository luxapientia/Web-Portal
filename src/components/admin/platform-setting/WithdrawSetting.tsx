import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    FormHelperText,
    Skeleton,
    Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface WithdrawSettings {
    withdrawMaxLimit: number;
    withdrawPeriod: number;
}

export default function WithdrawSetting() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<WithdrawSettings>({
        withdrawMaxLimit: 50000,
        withdrawPeriod: 24,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof WithdrawSettings, string>>>({});

    useEffect(() => {
        fetchWithdrawSettings();
    }, []);

    const fetchWithdrawSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/withdraw-settings');
            if (!response.ok) {
                throw new Error('Failed to fetch withdraw settings');
            }
            const data = await response.json();
            setSettings(data.data);
        } catch (error) {
            console.error('Error fetching withdraw settings:', error);
            toast.error('Failed to fetch withdraw settings');
        } finally {
            setLoading(false);
        }
    };

    const validateField = (field: keyof WithdrawSettings, value: number): string | null => {
        if (isNaN(value)) {
            return 'Please enter a valid number';
        }

        switch (field) {
            case 'withdrawMaxLimit':
                if (value < 0) return 'Maximum withdrawal limit cannot be negative';
                if (value > 1000000) return 'Maximum withdrawal limit cannot exceed 1,000,000';
                break;
            case 'withdrawPeriod':
                if (value < 1) return 'Withdrawal period must be at least 1 hour';
                if (value > 168) return 'Withdrawal period cannot exceed 168 hours (1 week)';
                if (!Number.isInteger(value)) return 'Must be a whole number';
                break;
        }
        return null;
    };

    const handleInputChange = (field: keyof WithdrawSettings, value: string) => {
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
            const response = await fetch('/api/admin/withdraw-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                throw new Error('Failed to update withdraw settings');
            }

            toast.success('Withdraw settings updated successfully');
            await fetchWithdrawSettings();
        } catch (error) {
            console.error('Error saving withdraw settings:', error);
            toast.error('Failed to update withdraw settings');
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
                    Withdraw Settings
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
                        These settings control withdrawal limits and cooldown periods.
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
                        </Stack>
                    ) : (
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Maximum Withdrawal Limit ($)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={settings.withdrawMaxLimit}
                                    onChange={(e) => handleInputChange('withdrawMaxLimit', e.target.value)}
                                    error={!!errors.withdrawMaxLimit}
                                    helperText={errors.withdrawMaxLimit}
                                    inputProps={{
                                        min: 0,
                                        step: 1
                                    }}
                                    placeholder="Enter maximum withdrawal limit"
                                    size="small"
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Withdrawal Cooldown Period (hours)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={settings.withdrawPeriod}
                                    onChange={(e) => handleInputChange('withdrawPeriod', e.target.value)}
                                    error={!!errors.withdrawPeriod}
                                    helperText={errors.withdrawPeriod}
                                    inputProps={{
                                        min: 1,
                                        max: 168,
                                        step: 1
                                    }}
                                    placeholder="Enter withdrawal cooldown period"
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