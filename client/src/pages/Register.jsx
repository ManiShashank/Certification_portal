import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usn.length !== 10) {
      setError('USN must be exactly 10 characters');
      return;
    }
    
    try {
      const res = await api.post('/student/register', { name, usn, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Register to upload your certifications</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="John Doe"
            />
          </div>

          <div className="input-group">
            <label>USN</label>
            <input 
              type="text" 
              value={usn} 
              onChange={(e) => setUsn(e.target.value)} 
              required 
              placeholder="e.g. 1RV18CS001"
              maxLength={10}
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="student@domain.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
              placeholder="Min 6 characters"
            />
          </div>

          <button type="submit" className="btn-auth">Register</button>
        </form>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
