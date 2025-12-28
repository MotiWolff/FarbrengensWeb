import { Container, Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Cookies = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('cookies.title')}
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('cookies.whatAre.title')}
          </Typography>
          <Typography paragraph>
            {t('cookies.whatAre.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('cookies.howWeUse.title')}
          </Typography>
          <Typography paragraph>
            {t('cookies.howWeUse.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('cookies.types.title')}
          </Typography>
          <Typography paragraph>
            {t('cookies.types.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('cookies.control.title')}
          </Typography>
          <Typography paragraph>
            {t('cookies.control.content')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Cookies;
