import { useState, useEffect } from 'react';
import { 
  Grid, 
  Container, 
  Typography, 
  Box,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FarbrengenCard from './FarbrengenCard';
import FarbrengenService from '../../services/farbrengen.service';

const FarbrengensGrid = ({ farbrengens, loading, error, onUpdate }) => {
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    sortBy: 'date' // אפשרויות: date, title
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const filteredAndSortedFarbrengens = farbrengens
    .filter(farbrengen => {
      if (filters.type !== 'all' && farbrengen.type !== filters.type) return false;
      if (filters.search && !farbrengen.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          התוועדויות
        </Typography>
        
        {user && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => navigate('/farbrengens/new')}
            sx={{
              borderRadius: 2,
              px: 3
            }}
          >
            הוסף התוועדות
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        mb: 4,
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <TextField
          select
          label="סוג התוועדות"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">הכל</MenuItem>
          <MenuItem value="men">גברים</MenuItem>
          <MenuItem value="women">נשים</MenuItem>
          <MenuItem value="mixed">מעורב</MenuItem>
          <MenuItem value="children">ילדים</MenuItem>
          <MenuItem value="tmimim">תמימים</MenuItem>
          <MenuItem value="video">שידור וידאו</MenuItem>
        </TextField>
        
        <TextField
          select
          label="מיין לפי"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="date">תאריך</MenuItem>
          <MenuItem value="title">כותרת</MenuItem>
        </TextField>
        
        <TextField
          label="חיפוש"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" m={4}>
          <CircularProgress />
        </Box>
      ) : filteredAndSortedFarbrengens.length === 0 ? (
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mt: 8 }}
        >
          לא נמצאו התוועדויות
        </Typography>
      ) : (
        <Grid 
          container 
          spacing={3}
          sx={{
            mt: 2,
            '& .MuiGrid-item': {
              display: 'flex'
            }
          }}
        >
          {filteredAndSortedFarbrengens.map((farbrengen) => (
            <Grid item xs={12} sm={6} md={4} key={farbrengen._id}>
              <FarbrengenCard 
                farbrengen={farbrengen}
                onUpdate={onUpdate}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FarbrengensGrid;
