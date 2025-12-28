import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  SupervisorAccount as AdminIcon,
  Person as UserIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setError('אין לך הרשאות לצפות בדף זה');
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token);
      
      // הדפסת ה-headers שנשלחים
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.log('Headers being sent:', headers);
      
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Full error:', error);
      console.log('Request headers:', error.config?.headers);
      console.log('Response data:', error.response?.data);
      setError('שגיאה בטעינת המשתמשים');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    setDialogType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      let response;
      switch (dialogType) {
        case 'block':
          response = await api.put(`/api/admin/users/${selectedUser._id}/toggle-block`);
          setUsers(users.map(user => 
            user._id === selectedUser._id ? response.data : user
          ));
          break;
        case 'role':
          response = await api.put(`/api/admin/users/${selectedUser._id}/toggle-role`);
          setUsers(users.map(user => 
            user._id === selectedUser._id ? response.data : user
          ));
          break;
        case 'delete':
          await api.delete(`/api/admin/users/${selectedUser._id}`);
          setUsers(users.filter(user => user._id !== selectedUser._id));
          break;
        default:
          break;
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error performing action:', error);
      setError('שגיאה בביצוע הפעולה');
    }
  };

  const getDialogContent = () => {
    switch (dialogType) {
      case 'block':
        return {
          title: selectedUser?.isBlocked ? 'ביטול חסימת משתמש' : 'חסימת משתמש',
          content: selectedUser?.isBlocked 
            ? `האם אתה בטוח שברצונך לבטל את חסימת המשתמש ${selectedUser?.name}?`
            : `האם אתה בטוח שברצונך לחסום את המשתמש ${selectedUser?.name}?`,
          color: selectedUser?.isBlocked ? "success" : "error"
        };
      case 'role':
        return {
          title: selectedUser?.role === 'admin' ? 'הסרת הרשאות מנהל' : 'הענקת הרשאות מנהל',
          content: selectedUser?.role === 'admin'
            ? `האם אתה בטוח שברצונך להסיר הרשאות מנהל מ${selectedUser?.name}?`
            : `האם אתה בטוח שברצונך להעניק הרשאות מנהל ל${selectedUser?.name}?`,
          color: "warning"
        };
      case 'delete':
        return {
          title: 'מחיקת משתמש',
          content: `האם אתה בטוח שברצונך למחוק את המשתמש ${selectedUser?.name}?`,
          color: "error"
        };
      default:
        return { title: '', content: '', color: "primary" };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>שם</TableCell>
              <TableCell>אימייל</TableCell>
              <TableCell>תפקיד</TableCell>
              <TableCell>תאריך הצטרפות</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {user.role === 'admin' ? <AdminIcon color="primary" /> : <UserIcon />}
                    {user.role === 'admin' ? 'מנהל' : 'משתמש'}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('he-IL')}
                </TableCell>
                <TableCell>
                  <Typography color={user.isBlocked ? "error" : "success"}>
                    {user.isBlocked ? 'חסום' : 'פעיל'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="פעולות">
                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="פרטים נוספים">
                    <IconButton onClick={() => {
                      setSelectedUser(user);
                      setUserDetailsOpen(true);
                    }}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('block')}>
          {selectedUser?.isBlocked ? 'בטל חסימה' : 'חסום משתמש'}
        </MenuItem>
        <MenuItem onClick={() => handleAction('role')}>
          {selectedUser?.role === 'admin' ? 'הסר הרשאות מנהל' : 'הפוך למנהל'}
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          מחק משתמש
        </MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {getDialogContent().title}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {getDialogContent().content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>ביטול</Button>
          <Button 
            onClick={handleConfirmAction} 
            color={getDialogContent().color}
            autoFocus
          >
            אישור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={userDetailsOpen} 
        onClose={() => setUserDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>פרטי משתמש</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedUser.name}
              </Typography>
              <Typography><strong>אימייל:</strong> {selectedUser.email}</Typography>
              <Typography><strong>תפקיד:</strong> {selectedUser.role === 'admin' ? 'מנהל' : 'משתמש'}</Typography>
              <Typography><strong>סטטוס:</strong> {selectedUser.isBlocked ? 'חסום' : 'פעיל'}</Typography>
              <Typography><strong>תאריך הצטרפות:</strong> {new Date(selectedUser.createdAt).toLocaleDateString('he-IL')}</Typography>
              <Typography><strong>עדכון אחרון:</strong> {new Date(selectedUser.updatedAt).toLocaleDateString('he-IL')}</Typography>
              {/* Add more user details as needed */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDetailsOpen(false)}>סגור</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
