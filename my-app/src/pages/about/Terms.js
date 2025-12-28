import { Container, Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('terms.title')}
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('terms.acceptance.title')}
          </Typography>
          <Typography paragraph>
            {t('terms.acceptance.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('terms.userContent.title')}
          </Typography>
          <Typography paragraph>
            {t('terms.userContent.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('terms.conduct.title')}
          </Typography>
          <Typography paragraph>
            {t('terms.conduct.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('terms.liability.title')}
          </Typography>
          <Typography paragraph>
            {t('terms.liability.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('terms.changes.title')}
          </Typography>
          <Typography paragraph>
            {t('terms.changes.content')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Terms;
