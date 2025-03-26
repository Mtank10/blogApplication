import React, { useState } from 'react';
import { Box, Typography, Avatar, Divider, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';
import CommentForm from './CommentForm';

const CommentList = ({ comments, blogId }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const { user } = useAuth();
  const { deleteComment } = useBlog();

  const handleReplyClick = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(blogId, commentId);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={comment.author.profileImage} sx={{ mr: 1 }} />
            <Typography fontWeight="bold">{comment.author.email}</Typography>
            <Typography sx={{ ml: 2 }} color="text.secondary">
              {new Date(comment.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography sx={{ ml: 6 }}>{comment.content}</Typography>
          
          <Box sx={{ ml: 6, mt: 1 }}>
            <Button size="small" onClick={() => handleReplyClick(comment.id)}>
              Reply
            </Button>
            {comment.author.id === user?.id && (
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(comment.id)}
                sx={{ ml: 1 }}
              >
                Delete
              </Button>
            )}
          </Box>

          {replyingTo === comment.id && (
            <Box sx={{ ml: 6, mt: 1 }}>
              <CommentForm
                blogId={blogId}
                parentId={comment.id}
                onSuccess={() => setReplyingTo(null)}
              />
            </Box>
          )}

          {comment.replies.length > 0 && (
            <Box sx={{ ml: 6, mt: 2 }}>
              {comment.replies.map((reply) => (
                <Box key={reply.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar src={reply.author.profileImage} sx={{ mr: 1, width: 24, height: 24 }} />
                    <Typography fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                      {reply.author.email}
                    </Typography>
                    <Typography sx={{ ml: 2, fontSize: '0.875rem' }} color="text.secondary">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography sx={{ ml: 4, fontSize: '0.875rem' }}>{reply.content}</Typography>
                  {reply.author.id === user?.id && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(reply.id)}
                      sx={{ ml: 4, fontSize: '0.75rem' }}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}

          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
};

export default CommentList;