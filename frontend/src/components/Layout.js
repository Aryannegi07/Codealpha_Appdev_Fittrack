import React from "react";
import { NavLink } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <main className="main-content">{children}</main>

      <nav className="bottom-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `bottom-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="bottom-nav-icon">📊</span>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/log"
          className={({ isActive }) =>
            `bottom-nav-link log-btn ${isActive ? "active" : ""}`
          }
        >
          <span className="bottom-nav-icon">➕</span>
          <span>Log</span>
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            `bottom-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="bottom-nav-icon">👤</span>
          <span>Account</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
