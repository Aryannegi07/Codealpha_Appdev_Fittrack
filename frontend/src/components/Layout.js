import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">🏃 FitTrack</div>
        <NavLink to="/dashboard"  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="icon">📊</span> Dashboard</NavLink>
        <NavLink to="/log"        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="icon">➕</span> Log Activity</NavLink>
        <NavLink to="/history"    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="icon">📋</span> History</NavLink>
        <div className="sidebar-bottom">
          {user && (
            <div style={{ fontSize: 13, color: '#718096', padding: '8px 12px', marginBottom: 8 }}>
              <div style={{ fontWeight: 500, color: '#1A202C' }}>{user.fullName || user.username}</div>
              <div>{user.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}
          >
            <span className="icon">🚪</span> Logout
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;