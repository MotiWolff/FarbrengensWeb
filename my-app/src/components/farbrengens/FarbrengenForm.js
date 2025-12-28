import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const FarbrengenForm = ({ open, onClose, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    speaker: '',
    type: '',
    language: '',
    gender: '',
    isOnline: false,
    zoomLink: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedData = {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        location: formData.location,
        speaker: formData.speaker || 'לא צוין',
        type: formData.type || 'כללי',
        language: formData.language || 'עברית',
        gender: formData.gender || 'מעורב',
        isOnline: Boolean(formData.isOnline),
        zoomLink: formData.zoomLink || ''
      };

      console.log('Token:', localStorage.getItem('token'));
      console.log('Submitting farbrengen data:', formattedData);
      
      const response = await api.post('/farbrengens', formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Server response:', response.data);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
      navigate('/farbrengens');
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'שגיאה ביצירת התוועדות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('farbrengen.add.title')}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            required
            id="title"
            name="title"
            label="כותרת"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            id="description"
            name="description"
            label="תיאור"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            id="date"
            name="date"
            label="תאריך"
            type="date"
            value={formData.date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            required
            id="time"
            name="time"
            label="שעה"
            type="time"
            value={formData.time}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            required
            id="location"
            name="location"
            label="מיקום"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            id="speaker"
            name="speaker"
            label="מרצה"
            value={formData.speaker}
            onChange={handleChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label">סוג התוועדות</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="סוג התוועדות"
            >
              <MenuItem value="כללי">כללי</MenuItem>
              <MenuItem value="חסידי">חסידי</MenuItem>
              <MenuItem value="מאמר">מאמר</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="language-label">שפה</InputLabel>
            <Select
              labelId="language-label"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              label="שפה"
            >
              <MenuItem value="עברית">עברית</MenuItem>
              <MenuItem value="אנגלית">אנגלית</MenuItem>
              <MenuItem value="יידיש">יידיש</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="gender-label">מיועד ל</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="מיועד ל"
            >
              <MenuItem value="מעורב">מעורב</MenuItem>
              <MenuItem value="גברים">גברים</MenuItem>
              <MenuItem value="נשים">נשים</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isOnline}
                onChange={handleSwitchChange}
                name="isOnline"
              />
            }
            label="התוועדות מקוונת"
            sx={{ mt: 2 }}
          />

          {formData.isOnline && (
            <TextField
              fullWidth
              id="zoomLink"
              name="zoomLink"
              label="קישור לזום"
              type="url"
              value={formData.zoomLink}
              onChange={handleChange}
              margin="normal"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'שומר...' : 'שמור התוועדות'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FarbrengenForm;
