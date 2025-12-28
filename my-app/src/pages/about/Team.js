import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Email as EmailIcon, LinkedIn as LinkedInIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Team = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: 'הרב ישראל ישראלי',
      role: t('team.roles.founder'),
      image: '/images/team/member1.jpg',
      email: 'israel@example.com',
      linkedin: 'https://linkedin.com/in/israel'
    },
    // ... יתר חברי הצוות
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('team.title')}
        </Typography>
        
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          {t('team.subtitle')}
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {teamMembers.map((member) => (
            <Grid item key={member.name} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="260"
                  image={member.image}
                  alt={member.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {member.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <IconButton href={`mailto:${member.email}`}>
                      <EmailIcon />
                    </IconButton>
                    <IconButton href={member.linkedin} target="_blank">
                      <LinkedInIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Team;
