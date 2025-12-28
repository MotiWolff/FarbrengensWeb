import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  Person,
  Language,
  People
} from '@mui/icons-material';
import FarbrengenService from '../../services/farbrengen.service';

const FarbrengenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farbrengen, setFarbrengen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFarbrengen();
  }, [id]);

  const fetchFarbrengen = async () => {
    try {
      setLoading(true);
      const data = await FarbrengenService.getFarbrengenById(id);
      setFarbrengen(data);
    } catch (err) {
      setError('שגיאה בטעינת פרטי ההתוועדות');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/farbrengens')} sx={{ mt: 2 }}>
          חזרה לרשימת התוועדויות
        </Button>
      </Container>
    );
  }

  if (!farbrengen) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">התוועדות לא נמצאה</Alert>
        <Button onClick={() => navigate('/farbrengens')} sx={{ mt: 2 }}>
          חזרה לרשימת התוועדויות
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {farbrengen.title}
          </Typography>
          <Chip 
            label={farbrengen.status === 'approved' ? 'מאושר' : 'ממתין לאישור'} 
            color={farbrengen.status === 'approved' ? 'success' : 'warning'}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            תיאור
          </Typography>
          <Typography variant="body1" paragraph>
            {farbrengen.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday color="primary" />
            <Typography>
              {new Date(farbrengen.date).toLocaleDateString('he-IL')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime color="primary" />
            <Typography>{farbrengen.time}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="primary" />
            <Typography>{farbrengen.location}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" />
            <Typography>מרצה: {farbrengen.speaker}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Language color="primary" />
            <Typography>שפה: {farbrengen.language}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People color="primary" />
            <Typography>קהל: {farbrengen.gender}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>סוג: {farbrengen.type}</Typography>
          </Box>

          {farbrengen.isOnline && farbrengen.zoomLink && (
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                href={farbrengen.zoomLink}
                target="_blank"
                fullWidth
              >
                הצטרף לזום
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/farbrengens')}
            fullWidth
          >
            חזרה לרשימה
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate(`/farbrengens/edit/${id}`)}
            fullWidth
          >
            ערוך
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FarbrengenDetail;
