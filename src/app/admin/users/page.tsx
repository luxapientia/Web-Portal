'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Popover,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Avatar,
    CircularProgress,
    Skeleton,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { User } from '@/models/User';

interface FilterState {
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    createdAt: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
    field: keyof User | '';
    direction: SortDirection;
}

interface PaginatedResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

export default function UserManagementPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState<FilterState>({
        name: '',
        email: '',
        phone: '',
        role: 'all',
        status: 'all',
        createdAt: '',
    });
    const [sort, setSort] = useState<SortState>({
        field: '',
        direction: null,
    });
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [filterField, setFilterField] = useState<keyof FilterState | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Fetch users whenever page, rowsPerPage, filters, or sort changes
    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, filters, sort]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            
            // Construct query parameters
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: rowsPerPage.toString(),
                ...(filters.name && { name: filters.name }),
                ...(filters.email && { email: filters.email }),
                ...(filters.phone && { phone: filters.phone }),
                ...(filters.role !== 'all' && { role: filters.role }),
                ...(filters.status !== 'all' && { status: filters.status }),
                ...(filters.createdAt && { createdAt: filters.createdAt }),
                ...(sort.field && sort.direction && { 
                    sortBy: sort.field,
                    sortOrder: sort.direction 
                }),
            });

            const response = await fetch(`/api/admin/users?${queryParams}`);
            
            if (!response.ok) {
                setUsers([]);
                toast.error('Failed to fetch users');
                return;
            }

            const data = await response.json();
            if (data.success) {
                const paginatedData = data.data as PaginatedResponse;
                setUsers(paginatedData.data);
                setTotal(paginatedData.total);
            } else {
                setUsers([]);
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Fetching users error:', error);
            setUsers([]);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Event handlers
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>, field: keyof FilterState) => {
        setFilterAnchorEl(event.currentTarget);
        setFilterField(field);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
        setFilterField(null);
    };

    const handleFilterChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterField!]: value
        }));
        setPage(0); // Reset to first page when filter changes
    };

    const handleSort = (field: keyof User) => {
        setSort(prev => ({
            field,
            direction: 
                prev.field === field
                    ? prev.direction === 'asc'
                        ? 'desc'
                        : prev.direction === 'desc'
                        ? null
                        : 'asc'
                    : 'asc'
        }));
    };

    const handleRoleToggle = async (userId: string) => {
        try {
            const user = users.find(u => u._id === userId);
            if (!user) return;

            const newRole = user.role === 'admin' ? 'user' : 'admin';
            
            const response = await fetch(`/api/admin/users/role`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole, userId }),
            });

            if (!response.ok) {
                toast.error('Failed to update user role');
                return;
            }

            const data = await response.json();
            if (data.success) {
                toast.success('User role updated successfully');
                fetchUsers(); // Refresh the list
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Updating user role error:', error);
            toast.error('Failed to update user role');
        }
    };

    const handleStatusToggle = async (userId: string) => {
        try {
            const user = users.find(u => u._id === userId);
            if (!user) return;

            const statusMap = {
                'active': 'pending',
                'pending': 'suspended',
                'suspended': 'active'
            };
            
            const newStatus = statusMap[user.status as keyof typeof statusMap];

            const response = await fetch(`/api/admin/users/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, userId }),
            });

            if (!response.ok) {
                toast.error('Failed to update user status');
                return;
            }

            const data = await response.json();
            if (data.success) {
                toast.success('User status updated successfully');
                fetchUsers(); // Refresh the list
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Updating user status error:', error);
            toast.error('Failed to update user status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return { color: 'success', bg: '#E8F5E9' };
            case 'pending':
                return { color: 'warning', bg: '#FFF3E0' };
            case 'suspended':
                return { color: 'error', bg: '#FFEBEE' };
            default:
                return { color: 'default', bg: '#F5F5F5' };
        }
    };

    const renderSortIcon = (field: keyof User) => {
        if (sort.field !== field) return null;
        if (sort.direction === 'asc') return <ArrowUpwardIcon fontSize="small" />;
        if (sort.direction === 'desc') return <ArrowDownwardIcon fontSize="small" />;
        return null;
    };

    const renderFilterContent = () => {
        if (!filterField) return null;

        switch (filterField) {
            case 'role':
                return (
                    <FormControl fullWidth size="small">
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={filters.role}
                            label="Role"
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <MenuItem value="all">All Roles</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                );
            case 'status':
                return (
                    <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filters.status}
                            label="Status"
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="suspended">Suspended</MenuItem>
                        </Select>
                    </FormControl>
                );
            default:
                return (
                    <TextField
                        fullWidth
                        size="small"
                        label={`Filter by ${filterField}`}
                        value={filters[filterField]}
                        onChange={(e) => handleFilterChange(e.target.value)}
                    />
                );
        }
    };

    return (
        <AdminLayout>
            <Stack spacing={3}>
                <Typography variant="h5" fontWeight="bold">
                    User Management
                </Typography>

                {/* User Table */}
                <TableContainer 
                    component={Paper} 
                    elevation={0}
                    sx={{ 
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'auto',
                        position: 'relative',
                    }}
                >
                    {loading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(255, 255, 255, 0.7)',
                                zIndex: 1,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                                            User
                                            {renderSortIcon('name')}
                                        </Box>
                                        <IconButton size="small" onClick={(e) => handleFilterClick(e, 'name')}>
                                            <FilterIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
                                            Contact
                                            {renderSortIcon('email')}
                                        </Box>
                                        <IconButton size="small" onClick={(e) => handleFilterClick(e, 'email')}>
                                            <FilterIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ cursor: 'pointer' }} onClick={() => handleSort('role')}>
                                            Role
                                            {renderSortIcon('role')}
                                        </Box>
                                        <IconButton size="small" onClick={(e) => handleFilterClick(e, 'role')}>
                                            <FilterIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                                            Status
                                            {renderSortIcon('status')}
                                        </Box>
                                        <IconButton size="small" onClick={(e) => handleFilterClick(e, 'status')}>
                                            <FilterIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                                            Created At
                                            {renderSortIcon('createdAt')}
                                        </Box>
                                        <IconButton size="small" onClick={(e) => handleFilterClick(e, 'createdAt')}>
                                            <FilterIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                // Loading skeleton
                                [...Array(5)].map((_, index) => (
                                    <TableRow key={`skeleton-${index}`}>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Skeleton variant="circular" width={40} height={40} />
                                                <Box>
                                                    <Skeleton width={120} />
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                <Skeleton width={150} />
                                                <Skeleton width={100} />
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton width={80} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton width={80} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton width={100} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user: User, index: number) => (
                                    <TableRow 
                                        key={index}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            transition: 'background-color 0.2s',
                                        }}
                                    >
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar 
                                                    sx={{ width: 40, height: 40 }}
                                                >
                                                    {user.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2">
                                                        {user.name}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2">{user.email}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.phone}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                color={user.role === 'admin' ? 'primary' : 'default'}
                                                sx={{ 
                                                    fontWeight: 500,
                                                    textTransform: 'capitalize',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleRoleToggle(user._id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.status}
                                                size="small"
                                                sx={{
                                                    bgcolor: getStatusColor(user.status).bg,
                                                    color: `${getStatusColor(user.status).color}.main`,
                                                    fontWeight: 500,
                                                    textTransform: 'capitalize',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleStatusToggle(user._id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </TableContainer>

                {/* Filter Popover */}
                <Popover
                    open={Boolean(filterAnchorEl)}
                    anchorEl={filterAnchorEl}
                    onClose={handleFilterClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        sx: { p: 2, width: 250 }
                    }}
                >
                    {renderFilterContent()}
                </Popover>
            </Stack>
        </AdminLayout>
    );
}
