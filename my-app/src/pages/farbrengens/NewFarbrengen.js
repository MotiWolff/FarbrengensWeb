import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FarbrengenForm from '../../components/farbrengens/FarbrengenForm';

const NewFarbrengen = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/farbrengens');
  };

  const handleSuccess = () => {
    navigate('/farbrengens');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        הוספת התוועדות חדשה
      </Typography>

      <FarbrengenForm 
        open={isOpen}
        onClose={handleClose}
        onSubmitSuccess={handleSuccess}
      />
    </Container>
  );
};

export default NewFarbrengen; 