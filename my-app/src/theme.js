import { createTheme } from '@mui/material/styles';
import { heIL } from '@mui/material/locale';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#2D3250',
      light: '#424769',
      dark: '#1B1F3B'
    },
    secondary: {
      main: '#F6B17A',
      light: '#FFD4AA',
      dark: '#E68A45'
    },
    background: {
      default: '#F7F7F7',
      paper: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: [
      'Rubik',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif'
    ].join(','),
    h6: {
      fontWeight: 500,
      letterSpacing: 0.5
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.9)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2D3250',
          color: '#FFFFFF'
        }
      }
    }
  }
}, heIL);

export default theme; 