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
import { InterestMatrix, CreateInterestMatrixInput } from '@/models/InterestMatrix';
import { AddButton } from './common';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { ZodError } from 'zod';

const interestMatrixSchema = z.object({
    level: z.coerce.number()
        .int("Level must be an integer")
        .min(0, "Level must be a positive number"),
    name: z.string()
        .min(1, "Name is required")
        .max(50, "Name must be less than 50 characters"),
    startAccountValue: z.coerce.number()
        .min(0, "Start account value must be a positive number"),
    endAccountValue: z.coerce.number()
        .min(0, "End account value must be a positive number"),
    startActiveMembers: z.coerce.number()
        .int("Start active members must be an integer")
        .min(0, "Start active members must be a positive number"),
    endActiveMembers: z.coerce.number()
        .int("End active members must be an integer")
        .min(0, "End active members must be a positive number"),
    promotionReward: z.coerce.number()
        .min(0, "Promotion reward must be a positive number")
        .max(1000000, "Promotion reward cannot exceed 1,000,000"),
    uplineDepositAmount: z.coerce.number()
        .min(0, "Upline deposit amount must be a positive number"),
    uplineDepositReward: z.coerce.number()
        .min(0, "Upline deposit reward must be a positive number")
        .max(100, "Upline deposit reward percentage cannot exceed 100"),
    dailyTasksCountAllowed: z.coerce.number()
        .int("Daily tasks count must be an integer")
        .min(0, "Daily tasks count must be a positive number")
        .max(100, "Daily tasks count cannot exceed 100"),
    dailyTasksRewardPercentage: z.coerce.number()
        .min(0, "Daily tasks reward percentage must be a positive number")
        .max(100, "Daily tasks reward percentage cannot exceed 100")
}).refine((data) => {
    return data.endAccountValue > data.startAccountValue;
}, {
    message: "End account value must be greater than start account value",
    path: ["endAccountValue"]
}).refine((data) => {
    return data.endActiveMembers > data.startActiveMembers;
}, {
    message: "End active members must be greater than start active members",
    path: ["endActiveMembers"]
}).refine((data) => {
    return data.endActiveMembers - data.startActiveMembers >= 5;
}, {
    message: "Active members range must be at least 5",
    path: ["endActiveMembers"]
});

type FormErrors = {
    [K in keyof CreateInterestMatrixInput]?: string;
} & {
    form?: string;
};

export default function InterestMatrixTable() {
    const [matrices, setMatrices] = useState<InterestMatrix[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingMatrix, setEditingMatrix] = useState<Partial<InterestMatrix> | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isNewMatrix, setIsNewMatrix] = useState(false);
    const [errors, setErrors] = useState<FormErrors | null>(null);

    console.log(loading);

    useEffect(() => {
        fetchMatrices();
    }, []);

    const fetchMatrices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/interest-matrix');
            if (!response.ok) {
                toast.error('Failed to fetch interest matrices');
                return;
            }
            const data = await response.json();
            setMatrices(data.matrices);
        } catch (error) {
            console.error('Error fetching matrices:', error);
            toast.error('Failed to fetch interest matrices');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (data: Partial<CreateInterestMatrixInput>): boolean => {
        try {
            interestMatrixSchema.parse(data);
            setErrors(null);
            return true;
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const formattedErrors: FormErrors = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    formattedErrors[path as keyof CreateInterestMatrixInput] = err.message;
                });
                setErrors(formattedErrors);
                return false;
            }
            console.error('Error validating form:', error);
            return false;
        }
    };

    const handleAdd = () => {
        const newMatrix = {
            level: 0,
            name: '',
            startAccountValue: 0,
            endAccountValue: 0,
            startActiveMembers: 0,
            endActiveMembers: 0,
            promotionReward: 0,
            uplineDepositAmount: 0,
            uplineDepositReward: 100,
            dailyTasksCountAllowed: 0,
            dailyTasksRewardPercentage: 0
        };
        setEditingMatrix(newMatrix);
        setIsNewMatrix(true);
        setIsDialogOpen(true);
        setErrors(null);
    };

    const handleEdit = (matrix: InterestMatrix) => {
        setEditingMatrix(matrix);
        setIsNewMatrix(false);
        setIsDialogOpen(true);
        setErrors(null);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/interest-matrix?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                toast.error('Failed to delete interest matrix');
                return;
            }

            setMatrices(prev => prev.filter(m => m._id !== id));
            toast.success('Interest matrix deleted successfully');
        } catch (error) {
            console.error('Error deleting matrix:', error);
            toast.error('Failed to delete interest matrix');
        }
    };

    const handleSave = async () => {
        if (!editingMatrix) return;

        const isValid = validateForm(editingMatrix);
        if (!isValid) {
            toast.error('Please fix the validation errors');
            return;
        }

        try {
            const url = '/api/admin/interest-matrix';
            const method = isNewMatrix ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingMatrix),
            });

            if (!response.ok) {
                toast.error(`Failed to ${isNewMatrix ? 'create' : 'update'} interest matrix`);
                return;
            }

            const data = await response.json();
            
            if (isNewMatrix) {
                setMatrices(prev => [...prev, data.matrix]);
            } else {
                setMatrices(prev => prev.map(m => m._id === editingMatrix._id ? data.matrix : m));
            }

            handleCloseDialog();
            toast.success(`Interest matrix ${isNewMatrix ? 'created' : 'updated'} successfully`);
        } catch (error) {
            console.error('Error saving matrix:', error);
            toast.error(`Failed to ${isNewMatrix ? 'create' : 'update'} interest matrix`);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingMatrix(null);
        setIsNewMatrix(false);
        setErrors(null);
    };

    const handleInputChange = (field: keyof CreateInterestMatrixInput, value: string) => {
        setErrors(null);
        if (!editingMatrix) return;

        const newValue = field === 'name' ? value : parseFloat(value) || 0;
        const updatedMatrix = {
            ...editingMatrix,
            [field]: newValue
        };

        setEditingMatrix(updatedMatrix);
    };

    console.log('errors', errors);

    const renderDialog = () => {
        if (!editingMatrix) return null;

        const fields = [
            { name: 'level' as const, label: 'Level', type: 'number' },
            { name: 'name' as const, label: 'Name', type: 'text' },
            { name: 'startAccountValue' as const, label: 'Start Account Value ($)', type: 'number' },
            { name: 'endAccountValue' as const, label: 'End Account Value ($)', type: 'number' },
            { name: 'startActiveMembers' as const, label: 'Start Active Members', type: 'number' },
            { name: 'endActiveMembers' as const, label: 'End Active Members', type: 'number' },
            { name: 'promotionReward' as const, label: 'Promotion Reward ($)', type: 'number' },
            { name: 'uplineDepositAmount' as const, label: 'Upline Deposit Amount ($)', type: 'number' },
            { name: 'uplineDepositReward' as const, label: 'Upline Deposit Reward ($)', type: 'number' },
            { name: 'dailyTasksCountAllowed' as const, label: 'Daily Tasks Count', type: 'number' },
            { name: 'dailyTasksRewardPercentage' as const, label: 'Daily Tasks Reward (%)', type: 'number' }
        ];

        return (
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isNewMatrix ? 'Create New' : 'Edit'} Interest Matrix
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={2}>
                        {fields.map((field) => (
                            <Box key={field.name}>
                                <TextField
                                    label={field.label}
                                    type={field.type}
                                    value={editingMatrix[field.name]}
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
                        {isNewMatrix ? 'Create' : 'Save'}
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
                    Interest Matrix
                </Typography>
                <AddButton
                    onClick={handleAdd}
                    label="Add Interest Matrix"
                />
            </Stack>
            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Level</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Account Value Range ($)</TableCell>
                            <TableCell align="center">Active Members Range</TableCell>
                            <TableCell align="center">Promotion Reward ($)</TableCell>
                            <TableCell align="center">Upline Deposit Amount ($)</TableCell>
                            <TableCell align="center">Upline Deposit Reward ($)</TableCell>
                            <TableCell align="center">Daily Tasks</TableCell>
                            <TableCell align="center">Task Reward (%)</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            // Loading skeleton
                            [...Array(3)].map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    {[...Array(9)].map((_, cellIndex) => (
                                        <TableCell key={`cell-${cellIndex}`} align="center">
                                            <Skeleton animation="wave" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : matrices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center">No interest matrices found</TableCell>
                            </TableRow>
                        ) : (
                            matrices.map((matrix: InterestMatrix) => (
                                <TableRow key={matrix._id}>
                                    <TableCell align="center">{matrix.level}</TableCell>
                                    <TableCell align="center">{matrix.name}</TableCell>
                                    <TableCell align="center">
                                        {matrix.startAccountValue} - {matrix.endAccountValue}
                                    </TableCell>
                                    <TableCell align="center">
                                        {matrix.startActiveMembers} - {matrix.endActiveMembers}
                                    </TableCell>
                                    <TableCell align="center">${matrix.promotionReward}</TableCell>
                                    <TableCell align="center">${matrix.uplineDepositAmount}</TableCell>
                                    <TableCell align="center">${matrix.uplineDepositReward}</TableCell>
                                    <TableCell align="center">{matrix.dailyTasksCountAllowed}</TableCell>
                                    <TableCell align="center">{matrix.dailyTasksRewardPercentage}%</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(matrix)}
                                                disabled={loading}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(matrix._id)}
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
