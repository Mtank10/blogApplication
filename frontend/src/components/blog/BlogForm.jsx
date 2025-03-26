import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const BlogForm = ({ initialValues, onSubmit }) => {
  const [imageFile, setImageFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setImageFile(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    content: Yup.string().required('Content is required'),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      description: '',
      content: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('content', values.content);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      onSubmit(formData);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        id="title"
        name="title"
        label="Title"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        id="description"
        name="description"
        label="Description"
        multiline
        rows={4}
        value={formik.values.description}
        onChange={formik.handleChange}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        id="content"
        name="content"
        label="Content"
        multiline
        rows={8}
        value={formik.values.content}
        onChange={formik.handleChange}
        error={formik.touched.content && Boolean(formik.errors.content)}
        helperText={formik.touched.content && formik.errors.content}
        sx={{ mb: 2 }}
      />
      
      <Box {...getRootProps()} sx={{ border: '1px dashed gray', p: 2, mb: 2, textAlign: 'center' }}>
        <input {...getInputProps()} />
        {preview ? (
          <Box component="img" src={preview} sx={{ maxHeight: 200, maxWidth: '100%' }} />
        ) : (
          <Typography>Drag & drop a blog image here, or click to select</Typography>
        )}
      </Box>
      
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {initialValues ? 'Update Blog' : 'Create Blog'}
      </Button>
    </Box>
  );
};

export default BlogForm;