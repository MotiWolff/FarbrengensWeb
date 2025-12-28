import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { i18n } = useTranslation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', direction: i18n.dir() }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;