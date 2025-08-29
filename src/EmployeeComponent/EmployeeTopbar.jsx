import React, { useEffect, useState } from "react";
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
import PlanetoLogo from "../Assets/CRm-Planeto-Logo.png";
import axiosInstance from "../BaseComponet/axiosInstance";
const EmployeeTopbar = ({ onToggle, onAccessFetched }) => {
  const [accessPermission, setAccessPermission] = useState({});

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTimesheet = () => {
    navigate("/employee/timeSheet");
  };

  useEffect(() => {
    fetchAccess();
  }, []);

  const fetchAccess = async () => {
    try {
      const response = await axiosInstance.get(`/company/getModuleAccessInfo`);
      setAccessPermission(response.data);
      if (onAccessFetched) {
        // ✅ Only call if passed
        onAccessFetched(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch access:", err);
    }
  };
  return (
    <div className="employee-topbar">
      <div className="employee-topbar__toggle-btn" onClick={onToggle}>
        <FaBars className="employee-topbar__icon" />

        <img
          src={PlanetoLogo}
          alt="Planeto Logo"
          className="mx-5"
          style={{ width: "100px" }}
        />
      </div>

      <div className="employee-topbar__icons">
        <FaBell className="employee-topbar__icon" />
        <FaUser className="employee-topbar__icon" />

        {accessPermission?.timeSheetAccess && (
          <FaClock
            className="company-topbar__icon timesheet-icon"
            title="Timesheet List"
            onClick={handleTimesheet}
          />
        )}
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
