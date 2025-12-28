import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t('footer.about.title'),
      links: [
        { name: t('footer.about.about'), path: '/about' },
        { name: t('footer.about.team'), path: '/team' },
        { name: t('footer.about.contact'), path: '/contact' }
      ]
    },
    {
      title: t('footer.legal.title'),
      links: [
        { name: t('footer.legal.terms'), path: '/terms' },
        { name: t('footer.legal.privacy'), path: '/privacy' },
        { name: t('footer.legal.cookies'), path: '/cookies' }
      ]
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-evenly">
          {footerSections.map((section) => (
            <Grid item xs={12} sm={4} key={section.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {section.title}
              </Typography>
              <Box>
                {section.links.map((link) => (
                  <Box key={link.name} sx={{ mb: 0.5 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      color="text.secondary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} {t('footer.copyright')}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
