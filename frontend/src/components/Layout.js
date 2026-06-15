import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">🏃 FitTrack</div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">📊</span> Dashboard
        </NavLink>

        <NavLink
          to="/log"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">➕</span> Log Activity
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">👤</span> Account
        </NavLink>

        <div className="sidebar-bottom">
          {user && (
            <div
              style={{
                fontSize: 13,
                color: "#718096",
                padding: "8px 12px",
              }}
            >
              <div
                style={{
                  fontWeight: 500,
                  color: "#1A202C",
                }}
              >
                {user.fullName || user.username}
              </div>

              <div>{user.email}</div>
            </div>
          )}
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;