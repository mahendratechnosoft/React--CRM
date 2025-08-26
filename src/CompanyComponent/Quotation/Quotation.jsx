import { useState } from "react";
import QuotationList from "../../Components/Quotation/QuotationList";
import CompanySidebar from "../CompanySidebar";
import CompanyTopbar from "../CompanyTopbar";

const Quotation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <>
      <CompanyTopbar onToggle={handleToggle} />
      <div className="slidebar-main-div">
        <CompanySidebar isCollapsed={isCollapsed} />
        <QuotationList />
      </div>
    </>
  )

}

export default Quotation;