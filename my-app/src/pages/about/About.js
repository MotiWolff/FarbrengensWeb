import { Container, Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('about.title')}
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('about.mission.title')}
          </Typography>
          <Typography paragraph>
            {t('about.mission.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('about.vision.title')}
          </Typography>
          <Typography paragraph>
            {t('about.vision.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('about.howItWorks.title')}
          </Typography>
          <Typography paragraph>
            {t('about.howItWorks.content')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;
