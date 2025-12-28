import { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper
} from '@mui/material';
import UserManagement from './UserManagement';
import FarbrengensManagement from './FarbrengensManagement';
import Statistics from './Statistics';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('admin.dashboard.title')}
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
        >
          <Tab label={t('admin.dashboard.users')} />
          <Tab label={t('admin.dashboard.farbrengens')} />
          <Tab label={t('admin.dashboard.statistics')} />
        </Tabs>
      </Paper>

      {currentTab === 0 && <UserManagement />}
      {currentTab === 1 && <FarbrengensManagement />}
      {currentTab === 2 && <Statistics />}
    </Container>
  );
};

export default AdminDashboard;
