import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox
} from '@mui/material';



const validationSchema = Yup.object({
  raceType: Yup.string()
    .required('Please select a race type'),
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[A-Za-z]+$/, 'Only letters are allowed'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[A-Za-z]+$/, 'Only letters are allowed'),
  age: Yup.number()
    .required('Age is required')
    // Allow under-18 entries to be submitted but they'll be flagged for review.
    .min(0, 'Please enter a valid age')
    .max(100, 'Please enter a valid age'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  acceptedWaiver: Yup.boolean()
    .required('You must accept the waiver')
    .oneOf([true], 'You must accept the waiver to register'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedRaceType = location.state?.raceType || '';
  
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      age: '',
      email: '',
      raceType: preSelectedRaceType,
      acceptedWaiver: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // In a real application, you would submit the form data to your backend here
      console.log(values);
      // Navigate to success page with race type information
      navigate('/registration-success', { 
        state: { 
          raceType: values.raceType,
          email: values.email
        }
      });
    },
  });

  return (
    <Box sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 0 }, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 900,
            mb: { xs: 3, sm: 4 },
            textAlign: 'center',
            fontSize: { xs: '2.5rem', sm: '3.75rem' },
            lineHeight: { xs: 1.2, sm: 1.167 },
            background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          REGISTRATION
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: '1px solid rgba(63,175,93,0.2)',
            background: 'rgba(63,175,93,0.05)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Registration Process:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  minWidth: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#3FAF5D',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                1
              </Typography>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Complete Registration Form
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill out all required information and submit the form
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  minWidth: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#3FAF5D',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                2
              </Typography>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Initial Email with Payment Instructions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You'll receive an email with QR codes for payment via CashApp or Venmo and your registration details
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  minWidth: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#3FAF5D',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                3
              </Typography>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Complete Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use either CashApp or Venmo to complete your payment (Full Marathon: $55 | Half Marathon: $50) - Includes race medal and exclusive event t-shirt
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  minWidth: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#3FAF5D',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                4
              </Typography>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Confirmation Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Once payment is received, you'll get a second email with your runner number and event details
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              mt: 3, 
              color: 'error.main', 
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            * Please note: No refunds will be processed for this race under any circumstances.
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              {/* Personal Information Section */}
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Personal Information
              </Typography>

              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { sm: '1fr 1fr' } }}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z]/g, '');
                    formik.setFieldValue('firstName', value);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  inputProps={{
                    pattern: '[A-Za-z]*',
                  }}
                />

                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z]/g, '');
                    formik.setFieldValue('lastName', value);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  inputProps={{
                    pattern: '[A-Za-z]*',
                  }}
                />
              </Box>

              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { sm: '1fr 1fr' } }}>
                <TextField
                  fullWidth
                  id="age"
                  name="age"
                  label="Age"
                  type="number"
                  value={formik.values.age}
                  onChange={(e) => {
                    // clamp values above 100
                    const raw = e.target.value;
                    let num = raw === '' ? '' : Number(raw);
                    if (num !== '' && Number.isFinite(num)) {
                      if (num > 100) num = 100;
                      if (num < 0) num = 0;
                    }
                    formik.setFieldValue('age', num);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                />

                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Box>

              {/* Race Type Selection */}
              <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Race Selection
                </Typography>
                
                <FormControl error={formik.touched.raceType && Boolean(formik.errors.raceType)}>
                  <FormLabel id="race-type-group-label" sx={{ mb: 2 }}>
                    Select your race type
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="race-type-group-label"
                    name="raceType"
                    value={formik.values.raceType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                      gap: 2 
                    }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          borderColor: formik.values.raceType === 'full' ? '#3FAF5D' : 'rgba(0,0,0,0.1)',
                          borderWidth: formik.values.raceType === 'full' ? 2 : 1,
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#3FAF5D',
                          },
                          '& .MuiTypography-h6': {
                            fontSize: { xs: '1.125rem', sm: '1.25rem' }
                          },
                          '& .MuiTypography-body2': {
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }
                        }}
                      >
                        <FormControlLabel
                          value="full"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Full Marathon
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                42.2 km • $55 (Includes medal & t-shirt)
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderColor: formik.values.raceType === 'half' ? '#3FAF5D' : 'rgba(0,0,0,0.1)',
                          borderWidth: formik.values.raceType === 'half' ? 2 : 1,
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#3FAF5D',
                          },
                        }}
                      >
                        <FormControlLabel
                          value="half"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Half Marathon
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                21.1 km • $50 (Includes medal & t-shirt)
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Paper>
                    </Box>
                  </RadioGroup>
                  {formik.touched.raceType && formik.errors.raceType && (
                    <FormHelperText error>{formik.errors.raceType}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Waiver Section */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Race Participation Waiver and Release of Liability
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    By checking the box below, I acknowledge and agree to the following:
                  </Typography>

                  <Box component="ul" sx={{ pl: { xs: 0, sm: 2 }, listStylePosition: 'inside' }}>
                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Voluntary Participation</strong> – I am voluntarily choosing to participate in this group run.
                      I understand this is not an officially organized race or sanctioned athletic event.
                    </Typography>

                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Assumption of Risk</strong> – I understand that running and physical activity involve inherent
                      risks, including but not limited to injury, illness, accidents, or other hazards. I accept full
                      responsibility for my own health, safety, and wellbeing during this event.
                    </Typography>

                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Medical Responsibility</strong> – I acknowledge that no medical services, emergency care, or
                      personnel will be provided by the organizers of this group run. I am solely responsible for my own
                      medical needs, including any treatment, medication, or insurance coverage.
                    </Typography>

                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Release of Liability</strong> – I release and discharge the organizers, group leaders,
                      volunteers, and fellow participants from any and all liability, claims, demands, or causes of action
                      that may arise from my participation. This release applies to any injury, loss, or damage that occurs
                      before, during, or after the event.
                    </Typography>

                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Acknowledgment of Understanding</strong> – By checking this box, I confirm I have read and
                      understood this waiver, and I freely accept and assume all risks associated with participation.
                    </Typography>
                  </Box>
                </Paper>

                <FormControlLabel
                  control={
                    <Checkbox
                      id="acceptedWaiver"
                      name="acceptedWaiver"
                      checked={formik.values.acceptedWaiver}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label="I have read and agree to the waiver and release of liability"
                />
                {formik.touched.acceptedWaiver && formik.errors.acceptedWaiver && (
                  <FormHelperText error>{formik.errors.acceptedWaiver}</FormHelperText>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 2 },
                  width: { xs: '100%', sm: 'auto' },
                  background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1C4C89 0%, #3FAF5D 100%)',
                  },
                }}
              >
                Complete Registration
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;