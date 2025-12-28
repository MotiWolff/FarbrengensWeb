import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import FarbrengenForm from '../../components/farbrengens/FarbrengenForm';
import FarbrengenService from '../../services/farbrengen.service';

const EditFarbrengen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farbrengen, setFarbrengen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarbrengen = async () => {
      try {
        const data = await FarbrengenService.getFarbrengenById(id);
        setFarbrengen(data);
      } catch (err) {
        console.error('Error fetching farbrengen:', err);
        setError('שגיאה בטעינת ההתוועדות');
      } finally {
        setLoading(false);
      }
    };

    fetchFarbrengen();
  }, [id]);

  const handleClose = () => {
    navigate('/farbrengens');
  };

  const handleSuccess = () => {
    navigate('/farbrengens');
  };

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );

  if (error) return (
    <Container>
      <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
    </Container>
  );

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        עריכת התוועדות
      </Typography>
      <FarbrengenForm
        open={true}
        onClose={handleClose}
        onSubmitSuccess={handleSuccess}
        initialData={farbrengen}
        isEdit={true}
      />
    </Container>
  );
};

export default EditFarbrengen; 