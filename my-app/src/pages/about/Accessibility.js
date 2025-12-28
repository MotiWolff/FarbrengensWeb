import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Accessibility = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('accessibility.title')}
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('accessibility.commitment.title')}
          </Typography>
          <Typography paragraph>
            {t('accessibility.commitment.content')}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('accessibility.features.title')}
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary={t('accessibility.features.contrast')}
                secondary={t('accessibility.features.contrastDesc')}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary={t('accessibility.features.fontSize')}
                secondary={t('accessibility.features.fontSizeDesc')}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary={t('accessibility.features.keyboard')}
                secondary={t('accessibility.features.keyboardDesc')}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary={t('accessibility.features.altText')}
                secondary={t('accessibility.features.altTextDesc')}
              />
            </ListItem>
          </List>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {t('accessibility.contact.title')}
          </Typography>
          <Typography paragraph>
            {t('accessibility.contact.content')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Accessibility;
