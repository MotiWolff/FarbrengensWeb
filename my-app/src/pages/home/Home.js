import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  CardActions,
  Grid,
  InputAdornment,
  Chip,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FarbrengenService from '../../services/farbrengen.service';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingFarbrengens, setUpcomingFarbrengens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingFarbrengens = async () => {
      try {
        setLoading(true);
        const farbrengens = await FarbrengenService.getUpcoming();
        setUpcomingFarbrengens(farbrengens.slice(0, 3));
      } catch (err) {
        console.error('Error fetching farbrengens:', err);
        setUpcomingFarbrengens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingFarbrengens();
  }, []);

  // קומפוננטת טעינה
  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3].map((item) => (
        <Grid item xs={12} md={6} key={item}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={24} />
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Skeleton variant="rectangular" width={100} height={32} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* לוגו וכותרת */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <img
          src="/logo192.png"
          alt="Farbrengen Logo"
          style={{
            width: 120,
            height: 120,
            marginBottom: 16,
            filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))'
          }}
        />
        <Typography variant="h3" component="h1" sx={{ mb: 1, color: 'primary.main' }}>
          {t('home.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {t('home.subtitle')}
        </Typography>
      </Box>

      {/* חיפוש והוספה */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 6, 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          bgcolor: 'background.default',
          borderRadius: 3
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('home.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'white', borderRadius: 1 }}
        />
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/farbrengens/new')}
          sx={{ 
            minWidth: 200,
            height: 56,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          {t('home.addFarbrengen')}
        </Button>
      </Paper>

      {/* התוועדויות קרובות */}
      <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
        {t('home.upcomingFarbrengens')}
      </Typography>
      
      {loading ? (
        <LoadingSkeleton />
      ) : upcomingFarbrengens.length > 0 ? (
        <Grid container spacing={3}>
          {upcomingFarbrengens.map((farbrengen) => (
            <Grid item xs={12} md={6} key={farbrengen._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                '&:hover': {
                  boxShadow: 6
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {farbrengen.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                    <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {new Date(farbrengen.date).toLocaleDateString('he-IL')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                    <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {farbrengen.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {farbrengen.mashpia}
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Chip 
                    label={`${farbrengen.participants?.length || 0} משתתפים`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Button 
                    size="small" 
                    sx={{ ml: 'auto' }}
                    onClick={() => navigate(`/farbrengens/${farbrengen._id}`)}
                  >
                    {t('home.viewDetails')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'background.default',
            borderRadius: 3
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('home.noUpcomingFarbrengens')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/farbrengens/new')}
            sx={{ 
              mt: 2,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {t('home.addFirstFarbrengen')}
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Home;
