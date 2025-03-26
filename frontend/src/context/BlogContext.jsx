import React, { createContext,useContext, useState } from 'react';
import api from '../api/client';

export const BlogContext = createContext();


export const useBlog = () => {
  return useContext(BlogContext);
};


export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blogs');
      setBlogs(response.data.data.blogs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlog = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      setCurrentBlog(response.data.data.blog);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post('/blogs', formData);
      setBlogs(prev => [response.data.data.blog, ...prev]);
      return response.data.data.blog;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id, formData) => {
    try {
      setLoading(true);
      const response = await api.patch(`/blogs/${id}`, formData);
      setBlogs(prev => prev.map(blog => 
        blog.id === id ? response.data.data.blog : blog
      ));
      if (currentBlog?.id === id) {
        setCurrentBlog(response.data.data.blog);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(blog => blog.id !== id));
      if (currentBlog?.id === id) {
        setCurrentBlog(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        currentBlog,
        loading,
        error,
        fetchBlogs,
        fetchBlog,
        createBlog,
        updateBlog,
        deleteBlog
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};