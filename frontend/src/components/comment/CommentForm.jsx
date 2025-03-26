import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';

const CommentForm = ({ blogId, parentId, onSuccess }) => {
  const [content, setContent] = useState('');
  const { createComment } = useBlog();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    try {
      await createComment(blogId, content, parentId);
      setContent('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to create comment:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography>Please log in to leave a comment</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder={parentId ? 'Write your reply...' : 'Write your comment...'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button type="submit" variant="contained">
        {parentId ? 'Post Reply' : 'Post Comment'}
      </Button>
    </Box>
  );
};

export default CommentForm;