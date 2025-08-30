import EmployeeTopbar from "../../EmployeeTopbar";
import EmployeeSidebar from "../../EmployeeSidebar";
import { useState } from "react";

import BoMListCompo from "../../../Components/Kickoff/BoMCompo/BoMListCompo";
const Bomlist = () => {
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

        <BoMListCompo />
      </div>
    </>
  );
};

export default Bomlist;
