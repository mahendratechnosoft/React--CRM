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
import PlanetoLogo from "../Assets/CRm-Planeto-Logo.png";
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
        <img src={PlanetoLogo} alt="Planeto Logo" className="mx-5" style={{ width: "100px" }} />
      </div>

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
