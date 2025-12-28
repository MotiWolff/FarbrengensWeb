import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const subjects = [
    'general',
    'technical',
    'content',
    'suggestion',
    'bug',
    'other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('שגיאה בשליחת הטופס');

      setFormData({ name: '', email: '', subject: '', message: '' });
      setStatus({
        type: 'success',
        message: t('contact.success')
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: t('contact.error')
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('contact.title')}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('contact.info.title')}
              </Typography>
              <Typography paragraph>
                {t('contact.info.address')}
              </Typography>
              <Typography paragraph>
                {t('contact.info.phone')}
              </Typography>
              <Typography paragraph>
                {t('contact.info.email')}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                {t('contact.hours.title')}
              </Typography>
              <Typography paragraph>
                {t('contact.hours.weekdays')}
              </Typography>
              <Typography paragraph>
                {t('contact.hours.friday')}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              {status.message && (
                <Alert severity={status.type} sx={{ mb: 2 }}>
                  {status.message}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  required
                  fullWidth
                  label={t('contact.form.name')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                />

                <TextField
                  required
                  fullWidth
                  type="email"
                  label={t('contact.form.email')}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                />

                <TextField
                  required
                  fullWidth
                  select
                  label={t('contact.form.subject')}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  margin="normal"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {t(`contact.subjects.${subject}`)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label={t('contact.form.message')}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  margin="normal"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  {t('contact.form.submit')}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Contact;
