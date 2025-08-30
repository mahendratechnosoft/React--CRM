import EmployeeTopbar from "../../EmployeeTopbar";
import EmployeeSidebar from "../../EmployeeSidebar";
import { useState } from "react";

import CheckListCompo from "../../../Components/Kickoff/CheckList/CheckListCompo";
const CheckList = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // for toggle

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleAccessFetched = (permissionData) => {
    localStorage.setItem("access", JSON.stringify(permissionData));
  };
  return (
    <>
      {/* Topbar */}
      <EmployeeTopbar onToggle={handleToggle} />
      <div className="slidebar-main-div">
        {/* sidebar */}
        <EmployeeSidebar
          isCollapsed={isCollapsed}
          onAccessFetched={handleAccessFetched}
        />

        <CheckListCompo />
      </div>
    </>
  );
};

export default CheckList;
