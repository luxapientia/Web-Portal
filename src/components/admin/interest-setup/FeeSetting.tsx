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
    Tooltip,
} from '@mui/material';
import {
    Info as InfoIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function FeeSetting() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fee, setFee] = useState<number>(2)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFeeSettings();
    }, []);

    const fetchFeeSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/fee');
            if (!response.ok) {
                throw new Error('Failed to fetch fee settings');
            }
            const data = await response.json();
            setFee(data.data);
        } catch (error) {
            console.error('Error fetching fee settings:', error);
            toast.error('Failed to fetch fee settings');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (value: string) => {
        setError(null);
        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            setError('Please enter a valid number');
            return;
        }

        if (numValue < 0) {
            setError('Fee percentage cannot be negative');
            return;
        }

        if (numValue > 100) {
            setError('Fee percentage cannot exceed 100%');
            return;
        }

        setFee(Number(value));
    };

    const handleSave = async () => {
        if (error) return;

        try {
            setSaving(true);
            const response = await fetch('/api/admin/fee', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fee),
            });

            if (!response.ok) {
                throw new Error('Failed to update fee settings');
            }

            toast.success('Fee settings updated successfully');
            await fetchFeeSettings(); // Refresh data after update
        } catch (error) {
            console.error('Error saving fee settings:', error);
            toast.error('Failed to update fee settings');
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
                    Platform Fee Settings
                </Typography>
            </Stack>

            <Stack spacing={3} maxWidth={800}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        About Platform Transfer Fees
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Platform transfer fees are charged on all transactions within the platform.
                        This fee helps maintain platform operations and security. The fee is calculated
                        as a percentage of the transaction amount and is automatically deducted during each transfer.
                    </Typography>
                </Alert>

                <Paper
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: 'divider',
                        p: 3
                    }}
                >
                    {loading ? (
                        <Skeleton animation="wave" height={60} />
                    ) : (
                        <Stack spacing={3}>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                    <Typography variant="subtitle2">
                                        Platform Fee Percentage
                                    </Typography>
                                    <Tooltip title="This percentage will be applied to all transactions on the platform">
                                        <InfoIcon fontSize="small" color="action" />
                                    </Tooltip>
                                </Stack>
                                <TextField
                                    type="number"
                                    value={fee}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    fullWidth
                                    error={!!error}
                                    InputProps={{
                                        endAdornment: '%',
                                    }}
                                    inputProps={{
                                        step: '0.01',
                                        min: 0,
                                        max: 100
                                    }}
                                />
                                {error && (
                                    <FormHelperText error>
                                        {error}
                                    </FormHelperText>
                                )}
                            </Box>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={!!error || saving}
                                sx={{ alignSelf: 'flex-start' }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Stack>
                    )}
                </Paper>
            </Stack>
        </Box>
    );
}
