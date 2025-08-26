import { useState } from "react";
import CompanyTopbar from "../CompanyTopbar";
import CompanySidebar from "../CompanySidebar";
import SalesOrderList from "../../Components/SalesOrder/SalesOrderList";

const SalesOrder = ()=>{
  
    const [isCollapsed, setIsCollapsed] = useState(false);
    const handleToggle = () => {
      setIsCollapsed(!isCollapsed);
    }
  return(
    <>
      <CompanyTopbar onToggle={handleToggle} />
      <div className="slidebar-main-div">
        <CompanySidebar isCollapsed={isCollapsed} />
        <SalesOrderList/>
      </div>
    </>

  );
}

export default SalesOrder;