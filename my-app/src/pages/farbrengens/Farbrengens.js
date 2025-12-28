import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import FarbrengensGrid from '../../components/farbrengens/FarbrengensGrid';
import FarbrengenService from '../../services/farbrengen.service';

const Farbrengens = () => {
  const [farbrengens, setFarbrengens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFarbrengens();
  }, []);

  const fetchFarbrengens = async () => {
    try {
      setLoading(true);
      const data = await FarbrengenService.getAllFarbrengens();
      setFarbrengens(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <FarbrengensGrid 
        farbrengens={farbrengens}
        loading={loading}
        error={error}
        onUpdate={fetchFarbrengens}
      />
    </Container>
  );
};

export default Farbrengens; 