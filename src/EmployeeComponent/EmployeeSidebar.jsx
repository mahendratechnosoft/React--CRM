import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  FaUsers, // 👥 Customers
  FaProjectDiagram, // 📂 Projects
  FaClock, // ⏱ Timesheet
  FaBullhorn, // 📢 Leads
  FaFileInvoice, // 📑 Work Order
  FaSignOutAlt, // 🚪 Logout
} from "react-icons/fa";
import "./EmployeeSidebar.css";
import axiosInstance from "../BaseComponet/axiosInstance";
const EmployeeSidebar = ({ isCollapsed, onAccessFetched  }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accessPermission, setAccessPermission] = useState({});
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

 useEffect(() => {
  fetchAccess();
}, []);

const fetchAccess = async () => {
  try {
    const response = await axiosInstance.get(`/company/getModuleAccessInfo`);
    setAccessPermission(response.data);
     if (onAccessFetched) {   // ✅ Only call if passed
      onAccessFetched(response.data);
    }
  } catch (err) {
    console.error("Failed to fetch access:", err);
  }
};

  return (
    <div className={`sidebar-employee ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-employee__brand">
        {!isCollapsed && "Employee Portal"}
      </div>

      <ul className="sidebar-employee__nav-links">
        {accessPermission?.customerOwnView && (
          <li
            className={`sidebar-employee__nav-item ${
              location.pathname === "/employee/cutomerList" ? "active" : ""
            }`}
          >
            <Link to="/employee/cutomerList">
              <FaUsers />
              {!isCollapsed && <span>Customer</span>}
            </Link>
          </li>
        )}
        {accessPermission?.projectOwnView && (
          <li
            className={`sidebar-employee__nav-item ${
              location.pathname === "/employee/projectList" ? "active" : ""
            }`}
          >
            <Link to="/employee/projectList">
              <FaProjectDiagram />
              {!isCollapsed && <span>Projects</span>}
            </Link>
          </li>
        )}
        {accessPermission?.timeSheetAccess && (
          <li
            className={`sidebar-employee__nav-item ${
              location.pathname === "/employee/timeSheet" ? "active" : ""
            }`}
          >
            <Link to="/employee/timeSheet">
              <FaClock />
              {!isCollapsed && <span>TimeSheet</span>}
            </Link>
          </li>
        )}
        {accessPermission?.leadModuleAccess && (
          <li
            className={`sidebar-employee__nav-item ${
              location.pathname === "/employee/Lead" ? "active" : ""
            }`}
          >
            <Link to="/employee/lead">
              <FaBullhorn />
              {!isCollapsed && <span>Leads</span>}
            </Link>
          </li>
        )}

        {accessPermission?.workOrderAccess && (
          <li
            className={`sidebar-employee__nav-item ${
              location.pathname === "/employee/workOrder" ? "active" : ""
            }`}
          >
            <Link to="/employee/workOrder">
              <FaFileInvoice />
              {!isCollapsed && <span>WrokOrder</span>}
            </Link>
          </li>
        )}
      </ul>
      {/* <div className="sidebar-employee__logout">
        <button onClick={handleLogout}>
          <FaSignOutAlt />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div> */}
    </div>
  );
};

export default EmployeeSidebar;
