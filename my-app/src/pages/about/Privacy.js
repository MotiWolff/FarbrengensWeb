import { Container, Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('privacy.title')}
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('privacy.dataCollection.title')}
          </Typography>
          <Typography paragraph>
            {t('privacy.dataCollection.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('privacy.dataUse.title')}
          </Typography>
          <Typography paragraph>
            {t('privacy.dataUse.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('privacy.cookies.title')}
          </Typography>
          <Typography paragraph>
            {t('privacy.cookies.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('privacy.security.title')}
          </Typography>
          <Typography paragraph>
            {t('privacy.security.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('privacy.contact.title')}
          </Typography>
          <Typography paragraph>
            {t('privacy.contact.content')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Privacy;
