import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BlogForm from './components/blog/BlogForm';
import BlogDetail from './components/blog/BlogDetail';
import BlogList from './components/blog/BlogList';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BlogProvider>
          <Header />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/create" element={<BlogForm />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
            </Route>
          </Routes>
        </BlogProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;