import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";


import {
  FaTachometerAlt, // Dashboard
  FaBullhorn, // Lead
  FaUsers, // Customers
  FaFileInvoice, // Work Order
  FaUserFriends, // Employees
  FaProjectDiagram, // Projects
  FaClock, // Timesheet
  FaRocket, // Kickoff
  FaListAlt, // Checklist
  FaCogs, // BOM (Settings/Config like gears)
  FaRegStickyNote, // MOM (Notes)
  FaFileAlt, // Quotation
  FaShoppingCart, // Sales Order
  FaCog, // Settings
  FaSignOutAlt, // Logout (if added)
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import "./EmployeeSidebar.css";
import axiosInstance from "../BaseComponet/axiosInstance";
const EmployeeSidebar = ({ isCollapsed, onAccessFetched }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accessPermission, setAccessPermission] = useState({});
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [kickoffOpen, setKickoffOpen] = useState(false);


  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const toggleKickoff = () => {
    setKickoffOpen(!kickoffOpen);
  };

  const isKickoffActive = [
    "/employee/kickofflist",
    "/ChecklistSheet",
    "/BOMList",
    "/MomList",
  ].includes(location.pathname);








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

        <li
          className={`sidebar-employee__settings-dropdown ${
            kickoffOpen ? "open" : ""
          } ${
            [
              "/employee/kickofflist",
              "/ChecklistSheet",
              "/BOMList",
              "/MomList",
            ].includes(location.pathname)
              ? "active"
              : ""
          }`}
        >
          <button
            type="button"
            onClick={toggleKickoff}
            className="sidebar-employee__settings-toggle"
          >
            <FaRocket />
            {!isCollapsed && (
              <>
                <span className="flex-grow mx-2">Kickoff</span>
                {kickoffOpen ? (
                  <FaChevronDown className="sidebar-employee__dropdown-arrow" />
                ) : (
                  <FaChevronRight className="sidebar-employee__dropdown-arrow" />
                )}
              </>
            )}
          </button>

          {kickoffOpen && (
            <ul className="sidebar-employee__dropdown-menu">
              {accessPermission?.kickOffAccess && (
                <li
                  className={` ${
                    location.pathname === "/employee/kickofflist"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/employee/kickofflist">KickOff</Link>
                </li>
              )}
              {accessPermission?.checklistAccess && (
                <li
                  className={` ${
                    location.pathname === "/ChecklistSheet" ? "active" : ""
                  }`}
                >
                  <Link to="/ChecklistSheet">Checklist-Sheet</Link>
                </li>
              )}
              {accessPermission?.kickOffAccess && (
                <li
                  className={` ${
                    location.pathname === "/BOMList" ? "active" : ""
                  }`}
                >
                  <Link to="/BOMList">BOM</Link>
                </li>
              )}
              {accessPermission?.kickOffAccess && (
                <li
                  className={` ${
                    location.pathname === "/MomList" ? "active" : ""
                  }`}
                >
                  <Link to="/MomList">MOM</Link>
                </li>
              )}
            </ul>
          )}
        </li>
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
