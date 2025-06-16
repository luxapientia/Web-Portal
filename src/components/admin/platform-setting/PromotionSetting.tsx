import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    FormHelperText,
    Alert,
    Skeleton,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface PromotionSettings {
    firstDepositBonusPercentage: number;
    firstDepositBonusPeriod: number;
}

export default function PromotionSetting() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<PromotionSettings>({
        firstDepositBonusPercentage: 100,
        firstDepositBonusPeriod: 180,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof PromotionSettings, string>>>({});

    useEffect(() => {
        fetchPromotionSettings();
    }, []);

    const fetchPromotionSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/promotion-settings');
            if (!response.ok) {
                throw new Error('Failed to fetch promotion settings');
            }
            const data = await response.json();
            setSettings(data.data);
        } catch (error) {
            console.error('Error fetching promotion settings:', error);
            toast.error('Failed to fetch promotion settings');
        } finally {
            setLoading(false);
        }
    };

    const validateField = (field: keyof PromotionSettings, value: number): string | null => {
        if (isNaN(value)) {
            return 'Please enter a valid number';
        }

        switch (field) {
            case 'firstDepositBonusPercentage':
                if (value < 0) return 'Bonus percentage cannot be negative';
                if (value > 1000) return 'Bonus percentage cannot exceed 1000%';
                break;
            case 'firstDepositBonusPeriod':
                if (value < 1) return 'Bonus period must be at least 1 day';
                if (value > 365) return 'Bonus period cannot exceed 365 days';
                if (!Number.isInteger(value)) return 'Must be a whole number';
                break;
        }
        return null;
    };

    const handleInputChange = (field: keyof PromotionSettings, value: string) => {
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
            const response = await fetch('/api/admin/promotion-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update promotion settings');
            }

            toast.success('Promotion settings updated successfully');
            await fetchPromotionSettings();
        } catch (error) {
            console.error('Error saving promotion settings:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update promotion settings');
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
                    Promotion Settings
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
                        Configure the first deposit bonus settings. Users will receive a percentage bonus on their first deposit,
                        which becomes withdrawable after the specified period.
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
                                    First Deposit Bonus (%)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={settings.firstDepositBonusPercentage}
                                    onChange={(e) => handleInputChange('firstDepositBonusPercentage', e.target.value)}
                                    error={!!errors.firstDepositBonusPercentage}
                                    helperText={errors.firstDepositBonusPercentage}
                                    inputProps={{
                                        min: 0,
                                        max: 1000,
                                        step: 1
                                    }}
                                    placeholder="Enter first deposit bonus percentage"
                                    size="small"
                                />
                                <FormHelperText>
                                    Users will receive this percentage of their first deposit as a bonus
                                </FormHelperText>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Bonus Lock Period (days)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={settings.firstDepositBonusPeriod}
                                    onChange={(e) => handleInputChange('firstDepositBonusPeriod', e.target.value)}
                                    error={!!errors.firstDepositBonusPeriod}
                                    helperText={errors.firstDepositBonusPeriod}
                                    inputProps={{
                                        min: 1,
                                        max: 365,
                                        step: 1
                                    }}
                                    placeholder="Enter bonus lock period in days"
                                    size="small"
                                />
                                <FormHelperText>
                                    The bonus amount will be locked for this many days before it becomes withdrawable
                                </FormHelperText>
                            </Box>
                        </Stack>
                    )}
                </Paper>
            </Stack>
        </Box>
    );
} 