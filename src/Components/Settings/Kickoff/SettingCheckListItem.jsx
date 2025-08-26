import React, { useState } from "react";

import ChecklistCategories from "../../../CompanyComponent/ChechlistItemSetting/ChecklistCategories";
import ChecklistItems from "../../../CompanyComponent/ChechlistItemSetting/ChecklistItems";
import "../../../CompanyComponent/BomCategorieSettings/BomCategory.css"; // <-- Import CSS for styling

const SettingCheckListItem = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State to manage which tab is currently active. 'categories' is the default.
  const [activeTab, setActiveTab] = useState("categories");

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="Setting-slidebar-main-div-right-section ">
        {/* --- Tab Navigation --- */}
        <div className="checklist-tabs">
          <button
            className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            CHECKLIST CATEGORIES
          </button>
          <button
            className={`tab-btn ${activeTab === "items" ? "active" : ""}`}
            onClick={() => setActiveTab("items")}
          >
            CHECKLIST ITEMS
          </button>
        </div>

        {/* --- Conditional Content Display --- */}
        <div className="checklist-content mt-4">
          {activeTab === "categories" ? (
            <ChecklistCategories />
          ) : (
            <ChecklistItems />
          )}
        </div>
      </div>
    </>
  );
};

export default SettingCheckListItem;
