import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CompanySidebar from "../CompanySidebar";
import CompanyTopbar from "../CompanyTopbar";
import PaginationComponent from "../../Pagination/PaginationComponent";

import axiosInstance from "../../BaseComponet/axiosInstance";

import CustomerCreateContact from "../Customer/CustomerCreateContact";
import CustomerUpdateContact from "./CustomerUpdateContact";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CustomerContact.css";

import Swal from "sweetalert2";


const CustomerContact = () => {
  const location = useLocation();

  // Get customerId passed via navigation state or fallback
  const customerId = location.state?.customerId || "dummyCustomerId";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingContactId, setDeletingContactId] = useState(null);

  const [selectedContact, setSelectedContact] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/customer/getContacts/${customerId}`,
        {
          params: { page: currentPage, size: pageSize, search: searchText },
        }
      );

      console.log("response data", response.data);
      setContacts(response.data || []);
      setPageCount(1); // Update this accordingly if your API supports pagination info
    } catch (error) {
      toast.error("Failed to fetch contacts");
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchContacts();
    }
  }, [customerId, currentPage, pageSize, searchText]);

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(0);
  };

  const handleDeleteContact = (contactId) => {
    Swal.fire({
      title: "Delete Contact",
      text: "Are you sure you want to delete this contact?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF5C5C",
      cancelButtonColor: "#555",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/customer/deleteContacts/${contactId}`);
          toast.success("Contact deleted successfully");
          fetchContacts();
        } catch (error) {
          toast.error("Failed to delete contact");
          console.error(error);
        }
      }
    });
  };

  // Show update modal
  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setShowUpdateModal(true);
  };

  // Add a new handler for toggling status
  const handleStatusToggle = async (contact) => {
    try {
      // Toggle status locally for immediate UI feedback (optional)
      const updatedStatus = !contact.status;

      // Prepare updated contact payload
      const payload = {
        ...contact,
        status: updatedStatus,
      };

      // Send PUT request to update the contact status (adjust method and url as your backend expects)
      await axiosInstance.put("/customer/updateContact", payload);

      toast.success(
        `Status updated to ${updatedStatus ? "Active" : "Inactive"}`
      );

      // Refresh contacts list
      fetchContacts();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Status update error:", error);
    }
  };
  return (
    <>
      <CompanyTopbar onToggle={handleToggle} />
      <div className="slidebar-main-div">
        <CompanySidebar isCollapsed={isCollapsed} />

        <div className="slidebar-main-div-right-section">
          <div className="Companalist-main-card">
            <div className="row m-0 p-0 w-100 d-flex justify-content-between mb-2">
              <div className="col-md-3">
                <h4>Contact</h4>
              </div>

              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search Contacts Name"
                    value={searchText}
                    onChange={onSearchChange}
                  />
                </div>
              </div>

              <div className="col-md-6 d-flex justify-content-end">
                <button
                  className="btn btn-dark"
                  onClick={() => setShowModal(true)}
                >
                  + Contact
                </button>
              </div>
            </div>

            <div className="table-main-div">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                      <tr key={contact.id || index}>
                        <td>{index + 1 + currentPage * pageSize}</td>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.position}</td>
                        <td>{contact.phone}</td>
                        <td>
                          <label className="Company-customerList-switch">
                            <input
                              type="checkbox"
                              checked={contact.status}
                              onChange={() => handleStatusToggle(contact)}
                            />
                            <span className="Company-customerList-slider Company-customerList-round"></span>
                          </label>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => handleEditClick(contact)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No contacts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pagination-main-crd">
            <PaginationComponent
              currentPage={currentPage}
              pageSize={pageSize}
              pageCount={pageCount}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setCurrentPage(0);
                setPageSize(size);
              }}
            />
          </div>
        </div>
      </div>
      <CustomerCreateContact
        show={showModal}
        handleClose={() => setShowModal(false)}
        customerId={customerId}
        onContactCreated={fetchContacts} // refresh contacts after create
      />
    
      <CustomerUpdateContact
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        contact={selectedContact}
        onContactUpdated={() => fetchContacts()}
      />
      
      <ToastContainer />
    </>
  );
};

export default CustomerContact;
