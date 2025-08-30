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
  const [salesOpen, setSalesOpen] = useState(false);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const toggleKickoff = () => {
    setKickoffOpen(!kickoffOpen);
  };

  const toggleSales = () => {
    setSalesOpen(!salesOpen);
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
              "/employee/Bomlist",
              "/employee/MomListCompo",
              "/employee/CheckList",
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

              {accessPermission?.bomAccess && (
                <li
                  className={` ${
                    location.pathname === "/employee/Bomlist" ? "active" : ""
                  }`}
                >
                  <Link to="/employee/Bomlist">BOM</Link>
                </li>
              )}
              {accessPermission?.momAccess && (
                <li
                  className={` ${
                    location.pathname === "/employee/MomListCompo"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/employee/MomListCompo">MOM</Link>
                </li>
              )}

              {accessPermission?.checkSheetAccess && (
                <li
                  className={` ${
                    location.pathname === "/employee/CheckList" ? "active" : ""
                  }`}
                >
                  <Link to="/employee/CheckList">Check List</Link>
                </li>
              )}
            </ul>
          )}
        </li>

        <li
          className={`sidebar-employee__settings-dropdown ${
            salesOpen ? "open" : ""
          } ${
            [
              "/employee/SalesOrderListEmp",
              "/employee/QuotationListEmp",
            ].includes(location.pathname)
              ? "active"
              : ""
          }`}
        >
          <button
            type="button"
            onClick={toggleSales}
            className="sidebar-employee__settings-toggle"
          >
            <FaRocket />
            {!isCollapsed && (
              <>
                <span className="flex-grow mx-2">Sales</span>
                {salesOpen ? (
                  <FaChevronDown className="sidebar-employee__dropdown-arrow" />
                ) : (
                  <FaChevronRight className="sidebar-employee__dropdown-arrow" />
                )}
              </>
            )}
          </button>

          {salesOpen && (
            <ul className="sidebar-employee__dropdown-menu">
              {accessPermission?.salesOrderAccess && (
                <li
                  className={` ${
                    location.pathname === "/employee/SalesOrderListEmp"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/employee/SalesOrderListEmp">Sales Order</Link>
                </li>
              )}

              {accessPermission?.quotationAccess && (
                <li
                  className={` ${
                    location.pathname === "/employee/QuotationListEmp"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/employee/QuotationListEmp">Quotation</Link>
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
