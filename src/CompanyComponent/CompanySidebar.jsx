import React, { useState } from "react";
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
} from "react-icons/fa";

import {


  FaBuilding,
  FaUserTag,
  FaUserTie,
  FaRandom,
  FaTimes,
  FaTimesCircle,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import "./CompanySidebar.css";

const CompanySidebar = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [kickoffOpen, setKickoffOpen] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const toggleKickoff = () => {
    setKickoffOpen(!kickoffOpen);
  };

  const isKickoffActive = [
    "/KickOffList",
    "/ChecklistSheet",
    "/BOMList",
    "/MomList",
  ].includes(location.pathname);
  return (
    <div className={`company-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="company-sidebar__brand">{!isCollapsed && "CRM-Tech"}</div>

      <ul className="company-sidebar__nav-links">
        <li className={location.pathname === "/compDash" ? "active" : ""}>
          <Link to="/compDash">
            <FaTachometerAlt />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
        </li>
        <li className={location.pathname === "/Leadlist" ? "active" : ""}>
          <Link to="/Leadlist">
            <FaBullhorn />
            {!isCollapsed && <span>Lead</span>}
          </Link>
        </li>
        <li className={location.pathname === "/Customer" ? "active" : ""}>
          <Link to="/Customer">
            <FaUsers />
            {!isCollapsed && <span>Customers</span>}
          </Link>
        </li>
        <li className={location.pathname === "/WorkOrder" ? "active" : ""}>
          <Link to="/WorkOrder">
            <FaFileInvoice />
            {!isCollapsed && <span>Work Order</span>}
          </Link>
        </li>
        <li className={location.pathname === "/EmployeeList" ? "active" : ""}>
          <Link to="/EmployeeList">
            <FaUserFriends />
            {!isCollapsed && <span>Employee</span>}
          </Link>
        </li>
        {/* <li className={location.pathname === "/department" ? "active" : ""}>
          <Link to="/department">
            <FaBuilding />
            {!isCollapsed && <span>Department</span>}
          </Link>
        </li>
        <li className={location.pathname === "/CompRole" ? "active" : ""}>
          <Link to="/CompRole">
            <FaUserTag />
            {!isCollapsed && <span>Role</span>}
          </Link>
        </li> */}
        <li className={location.pathname === "/Projectlist" ? "active" : ""}>
          <Link to="/Projectlist">
            <FaProjectDiagram />
            {!isCollapsed && <span>Project</span>}
          </Link>
        </li>
        {/* <li className={location.pathname === "/Staffmember" ? "active" : ""}>
          <Link to="/Staffmember">
            <FaUsers />
            {!isCollapsed && <span>Staff</span>}
          </Link>
        </li> */}
        <li
          className={
            location.pathname === "/CompanyTimeSheetList" ? "active" : ""
          }
        >
          <Link to="/CompanyTimeSheetList">
            <FaClock />
            {!isCollapsed && <span>TimeSheetList</span>}
          </Link>
        </li>

        <li
          className={`company-sidebar__settings-dropdown ${
            kickoffOpen ? "open" : ""
          } ${isKickoffActive ? "active" : ""}`} // add active if any child selected
        >
          <button
            type="button"
            onClick={toggleKickoff}
            className="company-sidebar__settings-toggle"
          >
            <FaRocket />
            {!isCollapsed && (
              <>
                <span className="flex-grow mx-2">Kickoff</span>
                {/* Arrow Toggle */}
                {kickoffOpen ? (
                  <FaChevronDown className="dropdown-arrow" />
                ) : (
                  <FaChevronRight className="dropdown-arrow" />
                )}
              </>
            )}
          </button>

          {kickoffOpen && (
            <ul className="company-sidebar__dropdown-menu">
              <li
                className={`p-0 ${
                  location.pathname === "/KickOffList" ? "active" : ""
                }`}
              >
                <Link to="/KickOffList">KickOffList</Link>
              </li>
              <li
                className={`p-0 ${
                  location.pathname === "/ChecklistSheet" ? "active" : ""
                }`}
              >
                <Link to="/ChecklistSheet">Checklist-Sheet</Link>
              </li>
              <li
                className={`p-0 ${
                  location.pathname === "/BOMList" ? "active" : ""
                }`}
              >
                <Link to="/BOMList">BOM</Link>
              </li>
              <li
                className={`p-0 ${
                  location.pathname === "/MomList" ? "active" : ""
                }`}
              >
                <Link to="/MomList">MOM</Link>
              </li>
            </ul>
          )}
        </li>

        <li className={location.pathname === "/QuotationList" ? "active" : ""}>
          <Link to="/QuotationList">
            <FaFileAlt />
            {!isCollapsed && <span>Quotation</span>}
          </Link>
        </li>

        <li className={location.pathname === "/SalesOrder" ? "active" : ""}>
          <Link to="/SalesOrder">
            <FaShoppingCart />
            {!isCollapsed && <span>Sales Order</span>}
          </Link>
        </li>

        {/* Settings Dropdown */}
        {/* <li
          className={`company-sidebar__settings-dropdown ${
            settingsOpen ? "open" : ""
          }`}
        >
          <button
            type="button"
            onClick={toggleSettings}
            className="company-sidebar__settings-toggle"
          >
            <FaCog />

            {!isCollapsed && (
              <>
                <span className="flex-grow mx-2">Settings</span>

                {settingsOpen ? (
                  <FaChevronDown className="dropdown-arrow" />
                ) : (
                  <FaChevronRight className="dropdown-arrow" />
                )}
              </>
            )}
          </button>

          {settingsOpen && (
            <ul className="company-sidebar__dropdown-menu">
              <li
                className={`p-0 ${
                  location.pathname === "/CompanySetting" ? "active" : ""
                }`}
              >
                <Link to="/CompanySetting">Company Information</Link>
              </li>
              <li
                className={`p-0 ${
                  location.pathname === "/CompanyBankDetailsSetting"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/CompanyBankDetailsSetting">Bank details</Link>
              </li>
              <li
                className={`p-0 ${
                  location.pathname === "/CheckListItemSetting" ? "active" : ""
                }`}
              >
                <Link to="/CheckListItemSetting">Checklist-Item</Link>
              </li>
              <li
                className={`p-0 ${
                  location.pathname === "/BomCategorySetting" ? "active" : ""
                }`}
              >
                <Link to="/BomCategorySetting">BOM Categories</Link>
              </li>
            </ul>
          )}
        </li> */}

        <li className={location.pathname === "/SettingParent" ? "active" : ""}>
          <Link to="/SettingParent">
            <FaCog />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CompanySidebar;
