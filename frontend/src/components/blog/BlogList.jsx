import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';

const BlogList = () => {
  const { blogs, loading, error, fetchBlogs } = useBlog();

  React.useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Alert severity="error" message={error} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Blog Posts</Typography>
        <Button variant="contained" component={Link} to="/blogs/create">
          Create New Blog
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={blog.author.profileImage} sx={{ mr: 1 }} />
                    {blog.author.email}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button component={Link} to={`/blogs/${blog.id}`}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BlogList;