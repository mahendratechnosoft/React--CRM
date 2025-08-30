import EmployeeTopbar from "../../EmployeeTopbar";
import EmployeeSidebar from "../../EmployeeSidebar";
import { useState } from "react";

import MomListCompo from "../../../Components/Kickoff/MomCompo/MomListCompo";
const Momlist=()=>{
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

          <MomListCompo />
        </div>
      </>
    );
}

export default Momlist;