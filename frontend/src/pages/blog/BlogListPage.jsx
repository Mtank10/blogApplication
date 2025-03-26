import React, { useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const BlogListPage = () => {
  const { blogs, loading, error, fetchBlogs } = useBlog();

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Blog Posts</Typography>
      <Button 
        variant="contained" 
        component={Link} 
        to="/blogs/create"
        sx={{ mb: 2 }}
      >
        Create New Blog
      </Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.description}</TableCell>
                <TableCell>
                  <Button 
                    component={Link} 
                    to={`/blogs/${blog.id}`}
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BlogListPage;