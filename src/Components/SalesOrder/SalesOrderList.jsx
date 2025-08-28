import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../../BaseComponet/axiosInstance";
import PaginationComponent from "../../Pagination/PaginationComponent";
import CreateSalesOrder from "./CreateSalesOrder";
import EditSalesOrder from "./EditSalesOrder";
import SalesOrderPDFModel from "./SalesOrderPDFModel";

const SalesOrderList = () => {
    const [salesOrders, setSalesOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [view, setView] = useState('list');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [salesOrderForPdf, setSalesOrderForPdf] = useState(null);

    const fetchSalesOrders = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/sales/getAllSaleOrder/${page}/${size}?customerName=${searchTerm}`
            );
            const data = response.data;
            setSalesOrders(data.salesOrderList || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching sales orders:", error);
            toast.error("Failed to fetch sales orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            const delayDebounceFn = setTimeout(() => {
                fetchSalesOrders();
            }, 500); // Debounce time of 500ms
            return () => clearTimeout(delayDebounceFn);
        }
    }, [page, size, view, searchTerm]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page on new search
    };

    const handleSave = () => {
        console.log("Save action triggered");
        setView('list');
        fetchSalesOrders(); // Refresh the list after saving
    };

    const handleEditClick = (id) => {
        setSelectedOrderId(id);
        setView('edit');
    };

    const handleCancel = () => {
        setView('list');
        setSelectedOrderId(null);
    }

    const handlePreviewClick = (id) => {
        setSalesOrderForPdf(id);
        setShowPdfModal(true);
    };

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const renderView = () => {
        switch (view) {
            case 'create':
                return (
                    <div className="p-4">
                        <CreateSalesOrder onSave={handleSave} onCancel={handleCancel} />
                    </div>
                );

            case 'edit':
                return (
                    <div className="p-4">
                        {/* In a real app, you would fetch order details by ID and pass them as props */}
                        {/* For now, we pass the ID to a component that would handle fetching and editing */}
                        <EditSalesOrder orderId={selectedOrderId} onSave={handleSave} onCancel={handleCancel} />
                    </div>
                );

            case 'list':
            default:
                return (
                    <>
                        <div className="Companalist-main-card">
                            <div className="row m-0 p-0 w-100 d-flex justify-content-between align-items-center mb-2">
                                <div className="col-md-3">
                                    <h4>Sales Orders</h4>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0"
                                            placeholder="Search by Company Name..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-5 d-flex justify-content-end">
                                    <button
                                        className="btn btn-dark me-1"
                                        onClick={() => setView('create')}
                                    >
                                        + Add Sales Order
                                    </button>
                                </div>
                            </div>
                            <div className="table-main-div">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Sales Order #</th>
                                            <th>Company Name</th>
                                            <th>Voucher No</th>
                                            <th>Order No</th>
                                            <th>Date</th>
                                            <th>Created Date</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center">Loading...</td>
                                            </tr>
                                        ) : salesOrders.length > 0 ? (
                                            salesOrders.map((order,idx) => (
                                                <tr key={order.saleOrderId}>
                                                    <td>{idx + 1 }</td>
                                                    <td>{order.customerName || '-'}</td>
                                                    <td>{order.voucherNo || '-'}</td>
                                                    <td>{order.orderNo || '-'}</td>
                                                    <td>{formatDate(order.salesOrderDate)}</td>
                                                    <td>{formatDate(order.createdDateTime)}</td>
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-sm btn-primary me-1"
                                                            onClick={() => handleEditClick(order.saleOrderId)}
                                                        >
                                                            <i className="bi bi-pencil-square me-1"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-primary btn-sm ms-2"
                                                            onClick={() => handlePreviewClick(order.saleOrderId)}
                                                        >
                                                            <i className="bi bi-file-pdf"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center">No sales orders found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="pagination-main-crd">
                            <PaginationComponent
                                currentPage={page}
                                pageSize={size}
                                pageCount={totalPages}
                                onPageChange={(newPage) => setPage(newPage)}
                                onPageSizeChange={(newSize) => {
                                    setSize(newSize);
                                    setPage(0);
                                }}
                            />
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="slidebar-main-div-right-section">
            {renderView()}
            {showPdfModal && (
                <SalesOrderPDFModel
                    show={showPdfModal}
                    onClose={() => setShowPdfModal(false)}
                    salesOrderId={salesOrderForPdf}
                />
            )}
        </div>
    );
}

export default SalesOrderList;