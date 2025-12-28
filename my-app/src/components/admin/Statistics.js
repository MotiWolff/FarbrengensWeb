import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Alert, CircularProgress } from '@mui/material';
import api from '../../services/api';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('שגיאה בטעינת הסטטיסטיקות');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="info">אין נתונים זמינים</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                משתמשים רשומים
              </Typography>
              <Typography variant="h4">
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                התוועדויות
              </Typography>
              <Typography variant="h4">
                {stats.totalFarbrengens}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {stats.farbrengensByType && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  התוועדויות לפי סוג
                </Typography>
                {stats.farbrengensByType.map((type) => (
                  <Box key={type._id} sx={{ mt: 1 }}>
                    <Typography>
                      {type._id}: {type.count}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Statistics;
