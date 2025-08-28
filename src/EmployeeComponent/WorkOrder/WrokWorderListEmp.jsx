import EmployeeTopbar from "../EmployeeTopbar";
import EmployeeSidebar from "../EmployeeSidebar";
import { useState } from "react";
import WorkOrderList from "../../Components/WorkOrder/WorkOrderList";
const TimeSheetEmp=()=>{
    const [isCollapsed, setIsCollapsed] = useState(false); // for toggle
   
    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleAccessFetched = (permissionData) => {
        localStorage.setItem("access", JSON.stringify(permissionData));
    };
    return(
        <>
        {/* Topbar */}
            <EmployeeTopbar onToggle={handleToggle} />
            <div className="slidebar-main-div">
                {/* sidebar */}
                <EmployeeSidebar isCollapsed={isCollapsed} onAccessFetched={handleAccessFetched} />
                <div className="slidebar-main-div-right-section">

                   <WorkOrderList/>

                </div>
            </div>
        </>
    )
}

export default TimeSheetEmp;