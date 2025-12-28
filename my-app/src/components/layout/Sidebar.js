import React from 'react';
import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Language as LanguageIcon,
  AdminPanelSettings as AdminIcon,
  LogoutRounded as LogoutIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const Sidebar = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isRTL = i18n.dir() === 'rtl';
  const navigate = useNavigate();

  console.log('Sidebar - user:', user);
  console.log('Sidebar - isAuthenticated:', !!user);

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { text: t('nav.home'), icon: <HomeIcon />, path: '/' },
    { text: t('nav.farbrengens'), icon: <EventIcon />, path: '/farbrengens' },
    { text: t('nav.profile'), icon: <PersonIcon />, path: '/profile' },
    ...(user?.role === 'admin' ? [{
      text: t('nav.admin'),
      icon: <AdminIcon />,
      path: '/admin'
    }] : [])
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        flexDirection: isRTL ? 'row-reverse' : 'row' 
      }}>
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: 'secondary.main',
            fontWeight: 'bold'
          }}
        >
          F
        </Avatar>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Farbrengen
        </Typography>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  mx: 2,
                  my: 0.5,
                  borderRadius: 2,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  ...(isActive && {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  })
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'white', 
                    minWidth: 40,
                    mr: isRTL ? 'auto' : 3,
                    ml: isRTL ? 3 : 'auto'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    textAlign: isRTL ? 'right' : 'left',
                    '& .MuiListItemText-primary': { 
                      fontWeight: isActive ? 500 : 400 
                    } 
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      <Box sx={{ p: 2, mt: 'auto' }}>
        <ListItemButton
          onClick={() => i18n.changeLanguage(i18n.language === 'he' ? 'en' : 'he')}
          sx={{
            borderRadius: 2,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <ListItemIcon 
            sx={{ 
              color: 'white', 
              minWidth: 40,
              mr: isRTL ? 'auto' : 3,
              ml: isRTL ? 3 : 'auto'
            }}
          >
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText 
            primary={i18n.language === 'he' ? 'English' : 'עברית'} 
            sx={{ textAlign: isRTL ? 'right' : 'left' }}
          />
        </ListItemButton>

        {!!user && (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              mt: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: 'white',
                minWidth: 40,
                mr: isRTL ? 'auto' : 3,
                ml: isRTL ? 3 : 'auto'
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary={t('nav.logout')} 
              sx={{ textAlign: isRTL ? 'right' : 'left' }}
            />
          </ListItemButton>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        color="inherit"
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              ...(isRTL ? {
                right: 16
              } : {
                left: 16
              })
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              width: '100%',
              color: 'primary.main',
              fontWeight: 500,
              textAlign: isRTL ? 'right' : 'left',
              ...(isRTL ? {
                pr: 7
              } : {
                pl: 7
              })
            }}
          >
            {t('app.title')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor={isRTL ? 'right' : 'left'}
        open={isOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          '& .MuiDrawer-paperAnchorRight': {
            transform: isOpen ? 'none !important' : 'translateX(100%) !important'
          },
          '& .MuiDrawer-paperAnchorLeft': {
            transform: isOpen ? 'none !important' : 'translateX(-100%) !important'
          }
        }}
        SlideProps={{
          direction: isRTL ? 'left' : 'right'
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
