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
import "./EmployeeTopbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const EmployeeTopbar = ({ onToggle }) => {


    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };
  return (
    <div className="employee-topbar">
      <div className="employee-topbar__toggle-btn" onClick={onToggle}>
        <FaBars className="employee-topbar__icon" />
      </div>
      <div className="employee-topbar__search">
      logo
      </div>
      <div className="employee-topbar__icons">
        <FaBell className="employee-topbar__icon" />
        <FaUser className="employee-topbar__icon" />
          <FaClock
                  className="company-topbar__icon timesheet-icon"
                  title="Timesheet List"
                  // onClick={handleTimesheet}
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

export default EmployeeTopbar;
