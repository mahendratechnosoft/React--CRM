import React, { useEffect, useState } from "react";
import CompanySidebar from "../../CompanyComponent/CompanySidebar";
import CompanyTopbar from "../../CompanyComponent/CompanyTopbar";
import PaginationComponent from "../../Pagination/PaginationComponent";
import "./Setting.css";

import SettingDep from "./SettingDep";

import SettingRole from "./SettingRole";
import Companyinfo from "./General/Companyinfo";
import CompnayBankinfo from "./General/CompnayBankinfo";

import SettingBomCategories from "./Kickoff/SettingBomCategories";
import SettingCheckListItem from "./Kickoff/SettingCheckListItem";
function SettingParent() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

   const [selectedSection, setSelectedSection] = useState("Companyinfo");
  return (
    <>
      <CompanyTopbar onToggle={handleToggle} />
      <div className="slidebar-main-div">
        <CompanySidebar isCollapsed={isCollapsed} />

        <div className="slidebar-main-div-right-section">
          <p className="h3">Settings</p>

          <div className="setttings-main-div">
            <div className="setttings-main-div-left-col">
              <div className="settings-group">
                <div className="settings-group-heading">General</div>
                <ul>
                  <li
                    className={
                      selectedSection === "Companyinfo" ? "active" : ""
                    }
                    onClick={() => setSelectedSection("Companyinfo")}
                  >
                    Companyinfo
                  </li>
                  <li
                    className={
                      selectedSection === "BankDetails" ? "active" : ""
                    }
                    onClick={() => setSelectedSection("BankDetails")}
                  >
                    Bank Details
                  </li>
                </ul>
              </div>

              <div className="settings-group">
                <div className="settings-group-heading">Role & Department</div>
                <ul>
                  <li
                    className={selectedSection === "Role" ? "active" : ""}
                    onClick={() => setSelectedSection("Role")}
                  >
                    Role
                  </li>
                  <li
                    className={selectedSection === "Department" ? "active" : ""}
                    onClick={() => setSelectedSection("Department")}
                  >
                    Department
                  </li>
                </ul>
              </div>

              <div className="settings-group">
                <div className="settings-group-heading">KickOff</div>
                <ul>
                  <li
                    className={
                      selectedSection === "CheckListItem" ? "active" : ""
                    }
                    onClick={() => setSelectedSection("CheckListItem")}
                  >
                    CheckList Item
                  </li>
                  <li
                    className={
                      selectedSection === "BomCategories" ? "active" : ""
                    }
                    onClick={() => setSelectedSection("BomCategories")}
                  >
                    BomCategories
                  </li>
                </ul>
              </div>
            </div>

            <div className="setttings-main-div-right-col">
              {selectedSection === "Companyinfo" && <Companyinfo />}
              {selectedSection === "BankDetails" && <CompnayBankinfo />}
              {selectedSection === "Role" && <SettingRole />}
              {selectedSection === "Department" && <SettingDep />}

              {selectedSection === "CheckListItem" && <SettingBomCategories />}
              {selectedSection === "BomCategories" && <SettingCheckListItem />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingParent;
