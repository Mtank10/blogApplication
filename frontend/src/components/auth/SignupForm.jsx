import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Alert from '../ui/Alert';
import { useDropzone } from 'react-dropzone';

const SignupForm = () => {
  const { signup } = useAuth();
  const [error, setError] = React.useState(null);
  const [profileImage, setProfileImage] = React.useState(null);
  const [preview, setPreview] = React.useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setProfileImage(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  });

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
    
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
     
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('password', values.password);
        if (profileImage) {
          formData.append('profileImage', profileImage);
        }
        await signup(formData);
      } catch (err) {
        setError(err.response?.data?.message || 'Signup failed');
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      {error && <Alert severity="error" message={error} />}
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mb: 2 }}
        />
        
        
        <Box {...getRootProps()} sx={{ border: '1px dashed gray', p: 2, mb: 2, textAlign: 'center' }}>
          <input {...getInputProps()} />
          {preview ? (
            <Avatar src={preview} sx={{ width: 100, height: 100, mx: 'auto' }} />
          ) : (
            <Typography>Drag & drop a profile image here, or click to select</Typography>
          )}
        </Box>
        
        <Button type="submit" variant="contained" fullWidth>
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignupForm;