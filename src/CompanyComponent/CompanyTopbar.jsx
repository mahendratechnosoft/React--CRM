import React from "react";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaBars,
  FaSignOutAlt,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import "./CompanyTopbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const CompanyTopbar = ({ onToggle }) => {
  const navigate = useNavigate();
   const handleLogout = () => {
     localStorage.clear();
     navigate("/login");
   };

   
 const handleTimesheet = () => {

   navigate("/CompanyTimeSheetList");
 };
  return (
    <div className="company-topbar">
      <div className="company-topbar__toggle" onClick={onToggle}>
        <FaBars className="company-topbar__icon" />
      </div>
      <div className="company-topbar__search">LOGO</div>
      <div className="company-topbar__icons">
        <FaBell className="company-topbar__icon" />
        <FaUser className="company-topbar__icon" />

        <FaClock
          className="company-topbar__icon timesheet-icon"
          title="Timesheet List"
          onClick={handleTimesheet}
        />

        <FaSignOutAlt
          className="company-topbar__icon logout-icon "
          title="Logout"
          onClick={handleLogout}
          style={{ color: "red" }}
        />
      </div>
    </div>
  );
};

export default CompanyTopbar;
