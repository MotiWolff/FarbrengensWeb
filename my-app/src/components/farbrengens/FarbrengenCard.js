import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Navigation as NavigationIcon,
  LocalBar as BarIcon,
  Google as GoogleIcon,
  DirectionsCar as WazeIcon,
  Map as MapIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FarbrengenService from '../../services/farbrengen.service';

const typeColors = {
  men: 'primary',
  women: 'secondary',
  mixed: 'success',
  children: 'warning',
  tmimim: 'info',
  video: 'error'
};

const typeLabels = {
  men: 'גברים',
  women: 'נשים',
  mixed: 'מעורב',
  children: 'ילדים',
  tmimim: 'תמימים',
  video: 'שידור וידאו'
};

const FarbrengenCard = ({ farbrengen, onUpdate }) => {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [navigationMenuAnchor, setNavigationMenuAnchor] = useState(null);
  const [barsDialogOpen, setBarsDialogOpen] = useState(false);
  const [nearbyBars, setNearbyBars] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const canEdit = user && (user.isAdmin || user.id === farbrengen.userId);

  const handleDeleteClick = (farbrengen) => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await FarbrengenService.delete(farbrengen._id);
      onUpdate();
    } catch (err) {
      console.error('Error deleting farbrengen:', err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleNavigationClick = (event) => {
    setNavigationMenuAnchor(event.currentTarget);
  };

  const handleNavigationClose = () => {
    setNavigationMenuAnchor(null);
  };

  const openInNavigation = (platform) => {
    const address = encodeURIComponent(farbrengen.location);
    let url;

    switch (platform) {
      case 'google':
        url = `https://www.google.com/maps/search/?api=1&query=${address}`;
        break;
      case 'waze':
        url = `https://waze.com/ul?q=${address}`;
        break;
      case 'maps':
        // For iOS Maps (works only on iOS devices)
        url = `maps://maps.apple.com/?q=${address}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank');
    handleNavigationClose();
  };

  const handleFindBars = async () => {
    try {
      // Get coordinates from address first
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: farbrengen.location }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error('Could not find location'));
          }
        });
      });

      // Now call our API with the coordinates
      const response = await fetch(`/api/places/nearby-bars?lat=${result.lat()}&lng=${result.lng()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNearbyBars(data || []);
      setBarsDialogOpen(true);
    } catch (err) {
      console.error('Error fetching nearby bars:', err);
      // אפשר להוסיף כאן הודעת שגיאה למשתמש
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: 3,
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease-in-out'
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography 
            gutterBottom 
            variant="h5" 
            component="h2"
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            {farbrengen.title}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="body1">
                {new Date(farbrengen.date).toLocaleDateString('he-IL')}
                <Typography component="span" sx={{ mx: 1, color: 'text.secondary' }}>|</Typography>
                {farbrengen.time}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="body1">{farbrengen.location}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="body1">{farbrengen.speaker}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Chip 
              label={t(`farbrengen.types.${farbrengen.type}`)} 
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip 
              label={farbrengen.language} 
              color="secondary"
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip 
              label={farbrengen.gender} 
              color="info"
              variant="outlined"
              size="small"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mt: 2,
              minHeight: '3em',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {farbrengen.description}
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
          <Box>
            {canEdit && (
              <>
                <IconButton 
                  onClick={() => navigate(`/farbrengens/edit/${farbrengen._id}`)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDeleteClick(farbrengen)} 
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
          <Box>
            <IconButton onClick={handleNavigationClick}>
              <NavigationIcon />
            </IconButton>
            <IconButton 
              onClick={handleFindBars}
              color="primary"
            >
              <BarIcon />
            </IconButton>
            {farbrengen.isOnline && (
              <IconButton 
                color="primary"
                onClick={() => window.open(farbrengen.zoomLink, '_blank')}
              >
                <VideoCallIcon />
              </IconButton>
            )}
          </Box>
        </CardActions>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>מחיקת התוועדות</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את ההתוועדות?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleDelete} color="error">מחק</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={navigationMenuAnchor}
        open={Boolean(navigationMenuAnchor)}
        onClose={handleNavigationClose}
      >
        <MenuItem onClick={() => openInNavigation('google')}>
          <ListItemIcon><GoogleIcon /></ListItemIcon>
          <ListItemText primary={t('farbrengen.navigation.googleMaps')} />
        </MenuItem>
        <MenuItem onClick={() => openInNavigation('waze')}>
          <ListItemIcon><WazeIcon /></ListItemIcon>
          <ListItemText primary="Waze" />
        </MenuItem>
        <MenuItem onClick={() => openInNavigation('maps')}>
          <ListItemIcon><MapIcon /></ListItemIcon>
          <ListItemText primary="Apple Maps" />
        </MenuItem>
      </Menu>

      <Dialog 
        open={barsDialogOpen} 
        onClose={() => setBarsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('farbrengen.bars.title')}</DialogTitle>
        <DialogContent>
          {nearbyBars.length === 0 ? (
            <Typography>לא נמצאו חנויות אלכוהול בקרבת מקום</Typography>
          ) : (
            <List>
              {nearbyBars.map((place) => (
                <ListItem
                  key={place.place_id}
                  button
                  onClick={() => window.open(`https://www.google.com/maps/place/?q=place_id:${place.place_id}`, '_blank')}
                >
                  <ListItemIcon>
                    <BarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={place.name}
                    secondary={`${place.vicinity} • ${place.rating || 'No rating'} ⭐`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBarsDialogOpen(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FarbrengenCard;
