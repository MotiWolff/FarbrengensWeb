import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Avatar,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSuccess('הפרופיל עודכן בהצלחה');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('שגיאה בעדכון הפרופיל');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('profile.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t(`profile.roles.${user?.role}`)}
              </Typography>
            </Box>
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Alerts */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
            </Grid>
          )}
          {success && (
            <Grid item xs={12}>
              <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
            </Grid>
          )}

          {/* Profile Form */}
          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('profile.name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sx={{ direction: 'rtl' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('profile.email')}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sx={{ direction: 'rtl' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  {isEditing ? (
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => setIsEditing(false)}
                      >
                        ביטול
                      </Button>
                      <Button 
                        variant="contained" 
                        type="submit"
                      >
                        שמור שינויים
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                    >
                      ערוך פרופיל
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;