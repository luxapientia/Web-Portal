import { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormHelperText,
    Skeleton,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { TrustPlan } from '@/models/TrustPlan';
import { AddButton } from './common';
import toast from 'react-hot-toast';
import { trustPlanSchema, type TrustPlanFormData } from '@/schemas/trust-plan.schema';
import { ZodError } from 'zod';

type FormErrors = {
    [K in keyof TrustPlanFormData]?: string;
} & {
    form?: string;
};

export default function TrustPlanTable() {
    const [trustPlans, setTrustPlans] = useState<TrustPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingPlan, setEditingPlan] = useState<TrustPlan | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isNewPlan, setIsNewPlan] = useState(false);
    const [errors, setErrors] = useState<FormErrors | null>(null);

    console.log(loading);

    useEffect(() => {
        fetchTrustPlans();
    }, []);

    const fetchTrustPlans = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/trust-plans');
            if (!response.ok) {
                toast.error('Failed to fetch trust plans');
                return;
            }
            const data = await response.json();
            setTrustPlans(data.data);
        } catch (error) {
            console.error('Error fetching trust plans:', error);
            toast.error('Failed to fetch trust plans');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (data: Partial<TrustPlanFormData>): boolean => {
        try {
            trustPlanSchema.parse(data);
            setErrors(null);
            return true;
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const formattedErrors: FormErrors = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    formattedErrors[path as keyof TrustPlanFormData] = err.message;
                });
                setErrors(formattedErrors);
                return false;
            }
            console.error('Error validating form:', error);
            return false;
        }
    };

    const handleAdd = () => {
        const newPlan = {
            _id: '',
            name: '',
            duration: 0,
            dailyInterestRate: 0
        } as TrustPlan;
        setEditingPlan(newPlan);
        setIsNewPlan(true);
        setIsDialogOpen(true);
        setErrors(null);
    };

    const handleEdit = (plan: TrustPlan) => {
        setEditingPlan(plan);
        setIsNewPlan(false);
        setIsDialogOpen(true);
        setErrors(null);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/trust-plans?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                toast.error('Failed to delete trust plan');
                return;
            }

            setTrustPlans(prev => prev.filter(p => p._id !== id));
            toast.success('Trust plan deleted successfully');
        } catch (error) {
            console.error('Error deleting trust plan:', error);
            toast.error('Failed to delete trust plan');
        }
    };

    const handleSave = async () => {
        if (!editingPlan) return;

        // Validate form before submission
        const isValid = validateForm(editingPlan);
        if (!isValid) {
            toast.error('Please fix the validation errors');
            return;
        }

        try {
            const url = isNewPlan ? '/api/admin/trust-plans' : `/api/admin/trust-plans`;
            const method = isNewPlan ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingPlan),
            });

            if (!response.ok) {
                toast.error(`Failed to ${isNewPlan ? 'create' : 'update'} trust plan`);
                return;
            }

            const data = await response.json();
            
            if (isNewPlan) {
                setTrustPlans(prev => [...prev, data.plan]);
            } else {
                setTrustPlans(prev => prev.map(p => p._id === editingPlan._id ? data.plan : p));
            }

            handleCloseDialog();
            toast.success(`Trust plan ${isNewPlan ? 'created' : 'updated'} successfully`);
        } catch (error) {
            console.error('Error saving trust plan:', error);
            toast.error(`Failed to ${isNewPlan ? 'create' : 'update'} trust plan`);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingPlan(null);
        setIsNewPlan(false);
        setErrors(null);
    };

    const handleInputChange = (field: keyof Omit<TrustPlan, '_id'>, value: string) => {
        setErrors(null);
        if (!editingPlan) return;

        const newValue = field === 'name' ? value : parseFloat(value) || 0;
        const updatedPlan = {
            ...editingPlan,
            [field]: newValue
        } as TrustPlan;

        setEditingPlan(updatedPlan);
    };

    const renderDialog = () => {
        if (!editingPlan) return null;

        const fields = [
            { name: 'name' as const, label: 'Plan Name', type: 'text' },
            { name: 'duration' as const, label: 'Duration (Days)', type: 'number' },
            { name: 'dailyInterestRate' as const, label: 'Daily Interest (%)', type: 'number' }
        ];

        return (
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isNewPlan ? 'Create New' : 'Edit'} Trust Plan
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={2}>
                        {fields.map((field) => (
                            <Box key={field.name}>
                                <TextField
                                    label={field.label}
                                    type={field.type}
                                    value={editingPlan[field.name]}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    fullWidth
                                    error={!!errors?.[field.name]}
                                />
                                {errors?.[field.name] && (
                                    <FormHelperText error>
                                        {errors?.[field.name]}
                                    </FormHelperText>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        color="primary"
                        disabled={errors ? Object.keys(errors).length > 0 : false}
                    >
                        {isNewPlan ? 'Create' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
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
                    Trust Plans
                </Typography>
                <AddButton
                    onClick={handleAdd}
                    label="Add Trust Plan"
                />
            </Stack>
            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Plan Name</TableCell>
                            <TableCell align="center">Duration (Days)</TableCell>
                            <TableCell align="center">Daily Interest (%)</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            // Loading skeleton
                            [...Array(3)].map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    {[...Array(4)].map((_, cellIndex) => (
                                        <TableCell key={`cell-${cellIndex}`} align="center">
                                            <Skeleton animation="wave" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : trustPlans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No plans found</TableCell>
                            </TableRow>
                        ) : (
                            trustPlans.map((plan: TrustPlan, index: number) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{plan.name}</TableCell>
                                    <TableCell align="center">{plan.duration}</TableCell>
                                    <TableCell align="center">{plan.dailyInterestRate}%</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(plan)}
                                                disabled={loading}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(plan._id.toString())}
                                                disabled={loading}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {renderDialog()}
        </Box>
    );
}
