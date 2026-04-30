import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const Login = () => {
  const [role, setRole] = useState('student');
  const [emailOrUsn, setEmailOrUsn] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (role === 'admin') {
        res = await api.post('/admin/login', { email: emailOrUsn, password });
      } else {
        res = await api.post('/student/login', { emailOrUsn, password });
      }
      
      const { token, name, email } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userName', name || email); // Store for Navbar greeting

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="role-toggle">
          <button 
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Administrator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>{role === 'student' ? 'Email or USN' : 'Email Address'}</label>
            <input 
              type="text" 
              value={emailOrUsn} 
              onChange={(e) => setEmailOrUsn(e.target.value)} 
              required 
              placeholder={role === 'student' ? 'e.g. 1RV18CS001 or email@domain.com' : 'admin@domain.com'}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-auth">Login</button>
        </form>

        {role === 'student' && (
          <p className="auth-redirect">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
