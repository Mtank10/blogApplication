import React from 'react';
import { Typography, Box, Button, Avatar, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import CommentList from '../comment/CommentList';
import CommentForm from '../comment/CommentForm';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBlog, loading, error, fetchBlog, deleteBlog } = useBlog();

  React.useEffect(() => {
    if (id) fetchBlog(id);
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
      navigate('/blogs');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert severity="error" message={error} />;
  if (!currentBlog) return <Typography>Blog not found</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">{currentBlog.title}</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/blogs/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={currentBlog.author.profileImage} sx={{ mr: 1 }} />
        <Typography>By {currentBlog.author.email}</Typography>
        <Typography sx={{ ml: 2 }} color="text.secondary">
          {new Date(currentBlog.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      {currentBlog.image && (
        <Box sx={{ mb: 3 }}>
          <img
            src={currentBlog.image}
            alt={currentBlog.title}
            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
          />
        </Box>
      )}

      <Typography variant="body1" paragraph>
        {currentBlog.content}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>

      <CommentForm blogId={currentBlog.id} />

      <CommentList comments={currentBlog.comments} blogId={currentBlog.id} />
    </Box>
  );
};

export default BlogDetail;