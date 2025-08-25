import React from "react";
import { FaSearch, FaBell, FaCog, FaUser, FaBars } from "react-icons/fa";
import "./NavbarTopSuperAdmin.css";


const NavbarTopSuperAdmin = ({ onToggle }) => {
  return (
    <div className="superadmin-topbar">
      <div className="superadmin-topbar__toggle-btn" onClick={onToggle}>
        <FaBars className="superadmin-topbar__icon" />
      </div>
      <div className="superadmin-topbar__search">
        <FaSearch className="superadmin-topbar__icon" />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="superadmin-topbar__icons">
        <FaBell className="superadmin-topbar__icon" />
        <FaCog className="superadmin-topbar__icon" />
        <FaUser className="superadmin-topbar__icon" />
      </div>
    </div>
  );
};

export default NavbarTopSuperAdmin;
