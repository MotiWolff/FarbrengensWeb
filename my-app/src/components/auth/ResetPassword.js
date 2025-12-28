import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = [
    t('auth.resetPassword.steps.request'),
    t('auth.resetPassword.steps.verify'),
    t('auth.resetPassword.steps.reset')
  ];

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/request-reset', { email });
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בשליחת בקשת איפוס');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/verify-reset', { 
        email, 
        code: verificationCode
      });
      setActiveStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'קוד אימות שגוי');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    // הדפסת הערכים לבדיקה
    console.log('Reset Password Values:', {
      email,
      verificationCode,
      newPassword,
      confirmPassword
    });

    if (newPassword !== confirmPassword) {
      return setError('הסיסמאות אינן תואמות');
    }

    console.log('Sending reset password request:', {
      email,
      code: verificationCode,
      newPassword
    });
    
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        code: verificationCode,
        newPassword
      });
      
      console.log('Reset password response:', response.data);
      
      // אם הצליח, ננווט לדף ההתחברות
      navigate('/login');
    } catch (err) {
      console.error('Reset password error:', err.response?.data);
      setError(err.response?.data?.message || 'שגיאה באיפוס הסיסמה');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleRequestReset}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('auth.resetPassword.emailLabel')}
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('auth.resetPassword.submit')}
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box component="form" onSubmit={handleVerifyCode}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label={t('auth.resetPassword.codeLabel')}
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('auth.resetPassword.verify')}
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box component="form" onSubmit={handleResetPassword}>
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('auth.resetPassword.newPasswordLabel')}
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('auth.resetPassword.confirmPasswordLabel')}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('auth.resetPassword.submit')}
            </Button>
          </Box>
        );
      default:
        return 'שלב לא ידוע';
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {t('auth.resetPassword.title')}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {t(`auth.resetPassword.errors.${error}`)}
          </Alert>
        )}

        <Box sx={{ mt: 2, width: '100%' }}>
          {getStepContent(activeStep)}
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
