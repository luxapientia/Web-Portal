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

interface DomainSettings {
    domain: string;
}

export default function DomainSetting() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<DomainSettings>({
        domain: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDomainSettings();
    }, []);

    const fetchDomainSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/domain-settings');
            if (!response.ok) {
                throw new Error('Failed to fetch domain settings');
            }
            const data = await response.json();
            setSettings(data.data);
        } catch (error) {
            console.error('Error fetching domain settings:', error);
            toast.error('Failed to fetch domain settings');
        } finally {
            setLoading(false);
        }
    };

    const validateDomain = (domain: string): string | null => {
        if (!domain) {
            return 'Domain is required';
        }

        const domainRegex = /^(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})|(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))$/;
        if (!domainRegex.test(domain)) {
            return 'Invalid domain format';
        }

        return null;
    };

    const handleInputChange = (value: string) => {
        const validationError = validateDomain(value);
        setError(validationError);
        setSettings(prev => ({
            ...prev,
            domain: value
        }));
    };

    const handleSave = async () => {
        if (error) return;

        try {
            setSaving(true);
            const response = await fetch('/api/admin/domain-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update domain settings');
            }

            toast.success('Domain settings updated successfully');
            await fetchDomainSettings();
        } catch (error) {
            console.error('Error saving domain settings:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update domain settings');
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
                    Domain Settings
                </Typography>
                <Button
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    variant="outlined"
                    disabled={!!error || saving}
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
                        Configure the domain for your platform. This domain will be used for all platform-related communications and links.
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
                        <Skeleton height={80} />
                    ) : (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Platform Domain
                            </Typography>
                            <TextField
                                fullWidth
                                type="text"
                                value={settings.domain}
                                onChange={(e) => handleInputChange(e.target.value)}
                                error={!!error}
                                helperText={error}
                                placeholder="Enter your platform domain (e.g., example.com)"
                                size="small"
                            />
                            <FormHelperText>
                                Enter the domain name without http:// or https:// (e.g., example.com)
                            </FormHelperText>
                        </Box>
                    )}
                </Paper>
            </Stack>
        </Box>
    );
}
