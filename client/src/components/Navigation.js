import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🚀</span>
            <span className="brand-text">MyApp</span>
          </Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/home" 
            className={`nav-link ${isActive('/home') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </Link>
          
          <Link 
            to="/maps" 
            className={`nav-link ${isActive('/maps') ? 'active' : ''}`}
          >
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">Maps</span>
          </Link>
          
          <button onClick={handleLogout} className="logout-button">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
