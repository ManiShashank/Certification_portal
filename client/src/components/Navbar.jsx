import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userName, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-brand">
        <span className="brand-logo">SCMS</span>
        <span className="brand-text">Certification Portal</span>
      </div>
      
      <div className="navbar-actions">
        {userName && (
          <span className="user-greeting">
            Hello, <strong>{userName}</strong> <span className="role-badge">{role}</span>
          </span>
        )}
        <button onClick={handleLogout} className="btn-nav-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
