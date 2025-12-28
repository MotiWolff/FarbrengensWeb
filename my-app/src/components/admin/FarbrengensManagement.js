import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Block as RejectIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import FarbrengenService from '../../services/farbrengen.service';

const FarbrengensManagement = () => {
  const { t } = useTranslation();
  const [farbrengens, setFarbrengens] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFarbrengen, setSelectedFarbrengen] = useState(null);
  const navigate = useNavigate();

  const fetchFarbrengens = async () => {
    try {
      const data = await FarbrengenService.getAllFarbrengens();
      setFarbrengens(data);
    } catch (error) {
      console.error('Error fetching farbrengens:', error);
      setError('שגיאה בטעינת ההתוועדויות');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarbrengens();
  }, []);

  const handleStatusChange = async (farbrengenId, newStatus) => {
    try {
      await api.put(`/admin/farbrengens/${farbrengenId}/status`, {
        status: newStatus
      });
      await fetchFarbrengens();
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בעדכון סטטוס ההתוועדות');
    }
  };

  const handleDeleteClick = (farbrengen) => {
    setSelectedFarbrengen(farbrengen);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/farbrengens/${selectedFarbrengen._id}`);
      await fetchFarbrengens();
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה במחיקת ההתוועדות');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ direction: 'rtl' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">{t('admin.farbrengens.title')}</TableCell>
              <TableCell align="right">{t('admin.farbrengens.type')}</TableCell>
              <TableCell align="right">{t('admin.farbrengens.date')}</TableCell>
              <TableCell align="right">{t('admin.farbrengens.location')}</TableCell>
              <TableCell align="right">{t('admin.farbrengens.creator')}</TableCell>
              <TableCell align="right">{t('admin.farbrengens.status')}</TableCell>
              <TableCell align="right">{t('admin.farbrengens.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {farbrengens.map((farbrengen) => (
              <TableRow key={farbrengen._id}>
                <TableCell align="right">{farbrengen.title}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={t(`farbrengen.types.${farbrengen.type}`)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {new Date(farbrengen.date).toLocaleDateString('he-IL')}
                  <br />
                  {farbrengen.time}
                </TableCell>
                <TableCell align="right">{farbrengen.location}</TableCell>
                <TableCell align="right">{farbrengen.creator?.name}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={t(`admin.farbrengens.status.${farbrengen.status}`)}
                    color={farbrengen.status === 'approved' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => navigate(`/farbrengens/edit/${farbrengen._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteClick(farbrengen)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  {farbrengen.status !== 'approved' && (
                    <IconButton 
                      onClick={() => handleStatusChange(farbrengen._id, 'approved')}
                      color="success"
                    >
                      <ApproveIcon />
                    </IconButton>
                  )}
                  {farbrengen.status === 'approved' && (
                    <IconButton 
                      onClick={() => handleStatusChange(farbrengen._id, 'pending')}
                      color="warning"
                    >
                      <RejectIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen}>
        <DialogTitle>{t('admin.farbrengens.deleteTitle')}</DialogTitle>
        <DialogContent>
          {t('admin.farbrengens.deleteConfirmation', { title: selectedFarbrengen?.title })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarbrengensManagement;
