import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../../BaseComponet/axiosInstance";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { MdDoubleArrow } from "react-icons/md";
import styles from "./CreateSalesOrder.module.css";

const EditSalesOrder = ({ onCancel, onSave, orderId }) => {
  // --- Loading and Initial State ---
  const [loading, setLoading] = useState(true);

  // --- State for Order Details ---
  const [orderDetails, setOrderDetails] = useState({
    voucherNo: "",
    dated: "",
    buyersRef: "",
    paymentTerms: "",
    otherReferences: "",
    dispatchedThrough: "",
    destination: "",
    companyPan: "",
    customerName: "",
    createdDateTime: "",
  });

  // --- State for Buyer and Consignee ---
  const [buyerDetails, setBuyerDetails] = useState({
    customerName: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    code: "",
    country: "",
  });

  const [consigneeDetails, setConsigneeDetails] = useState({
    customerName: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    code: "",
    country: "",
  });

  // --- State for the dynamic product table ---
  const [products, setProducts] = useState([]);

  // --- State for terms of delivery ---
  const [termsOfDelivery, setTermsOfDelivery] = useState("");
  const [taxRates, setTaxRates] = useState({ cgst: 9, sgst: 9 });

  // --- Fetch Data on Component Mount ---
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error("No Order ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/sales/getSaleOrderById/${orderId}`
        );
        const { saleOrder, saleOrderItems } = response.data;

        setOrderDetails({
          voucherNo: saleOrder.voucherNo || "",
          dated: saleOrder.salesOrderDate
            ? new Date(saleOrder.salesOrderDate).toISOString().split("T")[0]
            : "",
          buyersRef: saleOrder.orderNo || "",
          paymentTerms: saleOrder.modeOfPayment || "",
          otherReferences: saleOrder.refrence || "",
          dispatchedThrough: saleOrder.dispatch || "",
          destination: saleOrder.destination || "",
          companyPan: saleOrder.panNumber || "",
          customerName: saleOrder.customerName || "",
          createdDateTime: saleOrder.createdDateTime || "",
        });
        setBuyerDetails({
          customerName: saleOrder.billingCompanyName || "",
          gstin: saleOrder.billingGSTIN || "",
          address: saleOrder.billingAddress || "",
          city: saleOrder.billingCity || "",
          state: saleOrder.billingState || "",
          code: saleOrder.billingcode || "",
          country: saleOrder.billingCountry || "",
        });
        setConsigneeDetails({
          customerName: saleOrder.shippingCompanyName || "",
          gstin: saleOrder.shippingGSTIN || "",
          address: saleOrder.shippingAddress || "",
          city: saleOrder.shippingCity || "",
          state: saleOrder.shippingState || "",
          code: saleOrder.shippinCode || "",
          country: saleOrder.shippingCountry || "",
        });
        setTermsOfDelivery(saleOrder.termsAndCondition || "");
        const formattedProducts = saleOrderItems.map((item) => ({
          id: item.saleOrderItemId,
          description: item.description || "",
          hsnSac: item.hsncode || "",
          dueOn: item.dueOnDate
            ? new Date(item.dueOnDate).toISOString().split("T")[0]
            : "",
          quantity: item.quantity || "",
          rate: item.rate || "",
          per: item.unit || "",
          amount: item.totalCost || 0,
        }));
        setProducts(
          formattedProducts.length > 0
            ? formattedProducts
            : [
                {
                  id: 1,
                  description: "",
                  hsnSac: "",
                  dueOn: "",
                  quantity: "",
                  rate: "",
                  per: "",
                  amount: 0,
                },
              ]
        );
      } catch (error) {
        console.error("Failed to fetch sales order details:", error);
        toast.error("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleDetailsChange = (e) =>
    setOrderDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBuyerChange = (e) =>
    setBuyerDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleConsigneeChange = (e) =>
    setConsigneeDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  const handleTaxChange = (e) =>
    setTaxRates((prev) => ({
      ...prev,
      [e.target.name]: parseFloat(e.target.value) || 0,
    }));
  const handleCopyBuyerToConsignee = () => setConsigneeDetails(buyerDetails);

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
    const qty = parseFloat(updatedProducts[index].quantity) || 0;
    const rate = parseFloat(updatedProducts[index].rate) || 0;
    updatedProducts[index].amount = qty * rate;
    setProducts(updatedProducts);
  };

  const addProduct = () =>
    setProducts([
      ...products,
      {
        id: Date.now(),
        description: "",
        hsnSac: "",
        dueOn: "",
        quantity: "",
        rate: "",
        per: "",
        amount: 0,
      },
    ]);
  const removeProduct = (index) => {
    if (products.length > 1)
      setProducts(products.filter((_, i) => i !== index));
  };

  const subtotal = products.reduce(
    (total, product) => total + (product.amount || 0),
    0
  );
  const cgst = subtotal * (taxRates.cgst / 100);
  const sgst = subtotal * (taxRates.sgst / 100);
  const grandTotal = subtotal + cgst + sgst;

  const handleSave = async () => {
    try {
      const saleOrder = {
        voucherNo: orderDetails.voucherNo,
        customerName: orderDetails.customerName,
        salesOrderDate: orderDetails.dated,
        panNumber: orderDetails.companyPan,
        modeOfPayment: orderDetails.paymentTerms,
        orderNo: orderDetails.buyersRef,
        refrence: orderDetails.otherReferences,
        dispatch: orderDetails.dispatchedThrough,
        destination: orderDetails.destination,
        termsAndCondition: termsOfDelivery,
        billingCompanyName: buyerDetails.customerName,
        billingAddress: buyerDetails.address,
        billingCountry: buyerDetails.country,
        billingState: buyerDetails.state,
        billingCity: buyerDetails.city,
        billingcode: buyerDetails.code,
        shippingCompanyName: consigneeDetails.customerName,
        shippingAddress: consigneeDetails.address,
        shippingCountry: consigneeDetails.country,
        shippingState: consigneeDetails.state,
        shippingCity: consigneeDetails.city,
        shippinCode: consigneeDetails.code,
        shippingGSTIN: consigneeDetails.gstin,
        billingGSTIN: buyerDetails.gstin,
        createdDateTime: orderDetails.createdDateTime,
      };
      const saleOrderItems = products.map(({ id, ...rest }) => ({
        description: rest.description,
        hsncode: rest.hsnSac,
        dueOnDate: rest.dueOn,
        quantity: rest.quantity,
        rate: rest.rate,
        unit: rest.per,
        totalCost: rest.amount,
      }));
      const payload = { saleOrder, saleOrderItems };
      console.log(
        "--- UPDATING SALES ORDER PAYLOAD ---",
        JSON.stringify(payload, null, 2)
      );
      await axiosInstance.put("/sales/updateSalesOrder", payload);
      toast.success("Sales order updated successfully.");
      if (onSave) onSave();
    } catch (error) {
      console.error(
        "Error updating sales order:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update sales order.");
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center">
        <h5>Loading Order Details...</h5>
      </div>
    );

  return (
    <Card>
      <Card.Header className="quotation-header">
        <Card.Title>Edit Sales Order</Card.Title>
      </Card.Header>
      <Card.Body className="quotation-body">
        <Container fluid>
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Voucher No</Form.Label>
                <Form.Control
                  type="text"
                  name="voucherNo"
                  value={orderDetails.voucherNo}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Dated</Form.Label>
                <Form.Control
                  type="date"
                  name="dated"
                  value={orderDetails.dated}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Buyer's Ref/Order No.</Form.Label>
                <Form.Control
                  type="text"
                  name="buyersRef"
                  value={orderDetails.buyersRef}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Mode/Terms of Payment</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentTerms"
                  value={orderDetails.paymentTerms}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Other References</Form.Label>
                <Form.Control
                  type="text"
                  name="otherReferences"
                  value={orderDetails.otherReferences}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Dispatched through</Form.Label>
                <Form.Control
                  type="text"
                  name="dispatchedThrough"
                  value={orderDetails.dispatchedThrough}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  type="text"
                  name="destination"
                  value={orderDetails.destination}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Company PAN</Form.Label>
                <Form.Control
                  type="text"
                  name="companyPan"
                  value={orderDetails.companyPan}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={orderDetails.customerName}
                  onChange={handleDetailsChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <Row className="mb-4 align-items-center justify-content-center">
            <Col md={5}>
              <Card className="h-100">
                <Card.Header as="h5">Buyer (Bill to)</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-2">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={buyerDetails.customerName}
                      onChange={handleBuyerChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>GSTIN/UIN</Form.Label>
                    <Form.Control
                      type="text"
                      name="gstin"
                      value={buyerDetails.gstin}
                      onChange={handleBuyerChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={buyerDetails.address}
                      onChange={handleBuyerChange}
                    />
                  </Form.Group>
                  <Row>
                    {/* <Col md={6}><Form.Group className="mb-2"><Form.Label>City</Form.Label><Form.Control type="text" name="city" value={buyerDetails.city} onChange={handleBuyerChange} /></Form.Group></Col> */}
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={buyerDetails.state}
                          onChange={handleBuyerChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="code"
                          value={buyerDetails.code}
                          onChange={handleBuyerChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {/* <Col md={6}><Form.Group><Form.Label>Country</Form.Label><Form.Control type="text" name="country" value={buyerDetails.country} onChange={handleBuyerChange} /></Form.Group></Col> */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md="auto">
              <Button
                variant="outline-secondary"
                onClick={handleCopyBuyerToConsignee}
                title="Copy Buyer details to Consignee"
              >
                <MdDoubleArrow />
              </Button>
            </Col>
            <Col md={5}>
              <Card className="h-100">
                <Card.Header as="h5">Consignee (Ship to)</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-2">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={consigneeDetails.customerName}
                      onChange={handleConsigneeChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>GSTIN/UIN</Form.Label>
                    <Form.Control
                      type="text"
                      name="gstin"
                      value={consigneeDetails.gstin}
                      onChange={handleConsigneeChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={consigneeDetails.address}
                      onChange={handleConsigneeChange}
                    />
                  </Form.Group>
                  <Row>
                    {/* <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={consigneeDetails.city}
                          onChange={handleConsigneeChange}
                        />
                      </Form.Group>
                    </Col> */}
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={consigneeDetails.state}
                          onChange={handleConsigneeChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="code"
                          value={consigneeDetails.code}
                          onChange={handleConsigneeChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {/* <Col md={6}>
                      <Form.Group>
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={consigneeDetails.country}
                          onChange={handleConsigneeChange}
                        />
                      </Form.Group>
                    </Col> */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <hr />
          <h5 className="mb-3">Products</h5>
          <Table responsive className={styles.professionalTable}>
            <thead>
              <tr>
                <th style={{ width: "5%" }} className="text-center">
                  SI NO
                </th>
                <th style={{ width: "35%" }}>Description</th>
                <th style={{ width: "12%" }}>HSN/SAC</th>
                <th style={{ width: "12%" }}>Due on</th>
                <th style={{ width: "8%" }}>Quantity</th>
                <th style={{ width: "10%" }}>Rate</th>
                <th style={{ width: "8%" }}>Per</th>
                <th style={{ width: "12%" }} className="text-end">
                  Amount
                </th>
                <th style={{ width: "5%" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td className="text-center fw-bold">{index + 1}</td>
                  <td className="inputCell">
                    <Form.Control
                      as="textarea"
                      rows={1}
                      name="description"
                      value={product.description}
                      onChange={(e) => handleProductChange(index, e)}
                      className="inputControl"
                    />
                  </td>
                  <td className="inputCell">
                    <Form.Control
                      type="text"
                      name="hsnSac"
                      value={product.hsnSac}
                      onChange={(e) => handleProductChange(index, e)}
                      className="inputControl"
                    />
                  </td>
                  <td className="inputCell">
                    <Form.Control
                      type="date"
                      name="dueOn"
                      value={product.dueOn}
                      onChange={(e) => handleProductChange(index, e)}
                      className="inputControl"
                    />
                  </td>
                  <td className="inputCell">
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, e)}
                      className="inputControl text-end"
                    />
                  </td>
                  <td className="inputCell">
                    <Form.Control
                      type="number"
                      name="rate"
                      value={product.rate}
                      onChange={(e) => handleProductChange(index, e)}
                      className="inputControl text-end"
                    />
                  </td>
                  <td className="inputCell">
                    <Form.Control
                      type="text"
                      name="per"
                      placeholder="e.g., pc"
                      value={product.per}
                      onChange={(e) => handleProductChange(index, e)}
                      className="inputControl"
                    />
                  </td>
                  <td className="text-end">
                    {product.amount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeProduct(index)}
                      disabled={products.length <= 1}
                    >
                      {" "}
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="text-end mb-4">
            <Button variant="success" size="sm" onClick={addProduct}>
              <FaPlusCircle /> Add Product
            </Button>
          </div>
          <Row>
            <Col md={7}>
              <Form.Group>
                <Form.Label className="fw-bold">Terms of Delivery</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={termsOfDelivery}
                  onChange={(e) => setTermsOfDelivery(e.target.value)}
                  placeholder="Enter terms of delivery..."
                />
              </Form.Group>
            </Col>
            <Col
              md={5}
              className="d-flex justify-content-end align-items-start"
            >
              <div
                className="p-3 w-100"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: ".25rem",
                }}
              >
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span className="fw-bold">
                    {subtotal.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>
                <Row className="mb-2 align-items-center">
                  <Col xs={5}>
                    <span className="text-muted">CGST @</span>
                  </Col>
                  <Col xs={3}>
                    <Form.Control
                      type="number"
                      name="cgst"
                      value={taxRates.cgst}
                      onChange={handleTaxChange}
                      className="inputControl text-end"
                    />
                  </Col>
                  <Col xs={4} className="text-end">
                    <span>
                      {cgst.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-2 align-items-center">
                  <Col xs={5}>
                    <span className="text-muted">SGST @</span>
                  </Col>
                  <Col xs={3}>
                    <Form.Control
                      type="number"
                      name="sgst"
                      value={taxRates.sgst}
                      onChange={handleTaxChange}
                      className="inputControl text-end"
                    />
                  </Col>
                  <Col xs={4} className="text-end">
                    <span>
                      {sgst.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </Col>
                </Row>
                <hr />
                <div className="d-flex justify-content-between fw-bold h5">
                  <span>Grand Total</span>
                  <span>
                    {grandTotal.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Body>
      <Card.Footer className="text-end quotation-footer">
        <Button variant="outline-secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Update Sales Order
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default EditSalesOrder;
