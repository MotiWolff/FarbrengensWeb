import { Container, Typography, Box, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  WhatsApp as WhatsAppIcon,
  Chat as ChatIcon 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Support = () => {
  const { t } = useTranslation();

  const supportChannels = [
    {
      title: t('support.channels.email'),
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      description: t('support.channels.emailDesc'),
      action: t('support.channels.emailAction'),
      link: 'mailto:farbrengensapp@gmail.com'
    },
    {
      title: t('support.channels.phone'),
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      description: t('support.channels.phoneDesc'),
      action: t('support.channels.phoneAction'),
      link: 'tel:+972534277063'
    },
    {
      title: t('support.channels.whatsapp'),
      icon: <WhatsAppIcon sx={{ fontSize: 40 }} />,
      description: t('support.channels.whatsappDesc'),
      action: t('support.channels.whatsappAction'),
      link: 'https://wa.me/15166196779'
    },
    {
      title: t('support.channels.chat'),
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      description: t('support.channels.chatDesc'),
      action: t('support.channels.chatAction'),
      link: '#'
    }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('support.title')}
        </Typography>

        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          {t('support.subtitle')}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {supportChannels.map((channel, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2, color: 'primary.main' }}>
                    {channel.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {channel.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {channel.description}
                  </Typography>
                  <Button
                    variant="contained"
                    href={channel.link}
                    target={channel.link.startsWith('http') ? '_blank' : '_self'}
                    rel={channel.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Support;
