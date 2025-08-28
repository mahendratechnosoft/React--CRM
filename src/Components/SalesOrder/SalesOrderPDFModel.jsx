import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import axiosInstance from "../../BaseComponet/axiosInstance";
import { toast } from "react-toastify";
import { SalesOrderPdfStyles as styles } from "./SalesOrderPdfStyles";
import { ToWords } from "to-words";

Font.registerHyphenationCallback((word) => [word]);
const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

const MyDocument = ({ data }) => {
  if (!data) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Loading document...</Text>
        </Page>
      </Document>
    );
  }

  const { saleOrder, saleOrderItems } = data;
  // console.log("saleOrderItems", JSON.stringify(saleOrderItems, null, 2));
  // console.log("saleOrder", JSON.stringify(saleOrder, null, 2));

  // --- 1. CALCULATIONS (Same as before) ---
  const { subtotal, totalQuantity } = saleOrderItems.reduce(
    (acc, item) => {
      acc.subtotal += parseFloat(item.totalCost) || 0;
      acc.totalQuantity += parseInt(item.quantity) || 0;
      return acc;
    },
    { subtotal: 0, totalQuantity: 0 }
  );

  const sgstRate = 0.09;
  const cgstRate = 0.09;
  const sgstAmount = subtotal * sgstRate;
  const cgstAmount = subtotal * cgstRate;
  const grandTotal = subtotal + sgstAmount + cgstAmount;

  // --- 2. NEW: DATA TRANSFORMATION ---
  // Create a new array with the original items
  let itemsWithTaxes = [...saleOrderItems];

  // Create the SGST row object as requested
  const sgstRow = {
    description: "Output - SGST @ 9% On Goods",
    hsncode: "", // Empty placeholder
    dueOnDate: "", // Empty placeholder
    quantity: "", // Empty placeholder
    rate: sgstRate * 100,
    unit: "%",
    totalCost: sgstAmount,
    isTaxRow: true, // A flag to identify this row if needed for special styling
  };

  // Create the CGST row object
  const cgstRow = {
    description: "Output - CGST @ 9% On Goods",
    hsncode: "",
    dueOnDate: "",
    quantity: "",
    rate: cgstRate * 100,
    unit: "%",
    totalCost: cgstAmount,
    isTaxRow: true,
  };

  // Add the new tax rows to the end of the items array
  itemsWithTaxes.push(sgstRow, cgstRow);

  // Formatting function for currency
  const formatCurrency = (value) => {
    if (isNaN(value)) return "";
    return parseFloat(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleContainer} fixed>
          <Text style={styles.title}>SALES ORDER</Text>
        </View>
        <View style={styles.pageBorderFirst} fixed />
        <View style={styles.mainContent}>
          <View style={styles.topDetails}>
            <View style={styles.topDetailsLeft}>
              <View style={styles.planetoInfo}>
                <View style={styles.planetoLogo}>
                  <Text>Planeto Logo</Text>
                  {/* <Image /> */}
                </View>
                <View style={styles.planetoInfoText}>
                  <Text style={{ fontWeight: "bold", marginBottom: 1 }}>
                    Planetto Tooltech Pvt Ltd
                  </Text>
                  <Text style={{ fontSize: 8, marginBottom: 1 }}>
                    Plot No. PAP-A-24, Phase-IV, MIDC Chakan, Behind Mahindra &
                    Mahindra , Nighoje, Pune- 410501
                  </Text>
                  <Text style={{ fontSize: 8, marginBottom: 1 }}>
                    GSTIN/UIN: 27AAJCP1545R1ZR
                  </Text>
                  <Text style={{ fontSize: 8, marginBottom: 1 }}>
                    State Name : Maharashtra, Code : 27
                  </Text>
                  <Text style={{ fontSize: 8, marginBottom: 1 }}>
                    CIN: U28999PN2017PTC170112
                  </Text>
                  <Text style={{ fontSize: 8 }}>
                    E-Mail : account@planetto.co.in, director@planetto.co.in
                  </Text>
                </View>
              </View>

              <View style={styles.shipTo}>
                <Text style={{ fontSize: 8, marginBottom: 1 }}>
                  Consignee (Ship to)
                </Text>
                <Text style={{ fontWeight: "bold", marginBottom: 1 }}>
                  {saleOrder.shippingCompanyName}
                </Text>
                <Text style={{ fontSize: 8, marginBottom: 1 }}>
                  {saleOrder.shippingAddress}
                </Text>
                <Text style={{ fontSize: 8, marginBottom: 1 }}>
                  GSTIN/UIN: {saleOrder.shippingGSTIN}
                </Text>
                <Text style={{ fontSize: 8, marginBottom: 1 }}>
                  State Name : {saleOrder.shippingState}, Code :
                  {saleOrder.shippinCode}
                </Text>
              </View>
              <View style={styles.billTo}>
                <Text style={{ fontSize: 8, marginBottom: 1 }}>
                  Buyer (Bill to)
                </Text>
                <Text style={{ fontWeight: "bold", marginBottom: 1 }}>
                  {saleOrder.billingCompanyName}
                </Text>
                <Text style={{ fontSize: 8, marginBottom: 1 }}>
                  {saleOrder.billingAddress}
                </Text>
                <Text style={{ fontSize: 8, marginBottom: 1 }}>
                  GSTIN/UIN: {saleOrder.billingGSTIN}
                </Text>
                <Text style={{ fontSize: 8, marginBottom: 1 }}>
                  State Name : {saleOrder.billingState}, Code :
                  {saleOrder.billingcode}
                </Text>
              </View>
            </View>
            <View style={styles.topDetailsRight}>
              <View style={styles.salesOrderDetails}>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.voucherNo}>
                    <Text>Voucher No.:</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {saleOrder.voucherNo}
                    </Text>
                  </View>
                  <View style={styles.dated}>
                    <Text>Dated: </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {saleOrder.salesOrderDate}
                    </Text>
                  </View>
                </View>

                <View style={styles.modeOfPayment}>
                  <Text>Mode/Terms of Payment: </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {saleOrder.modeOfPayment}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={styles.orderNO}>
                    <Text>Buyer's Ref./Order No.:</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {saleOrder.orderNo}
                    </Text>
                  </View>
                  <View style={styles.otherReferences}>
                    <Text>Other References: </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {saleOrder.refrence}
                    </Text>
                  </View>
                </View>

                <View style={styles.dispatchDestination}>
                  <View style={styles.dispatched}>
                    <Text>Dispatched through:</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {saleOrder.dispatch}
                    </Text>
                  </View>
                  <View style={styles.destination}>
                    <Text>Destination: </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {saleOrder.destination}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.termsOfDelivery}>
                <Text>Terms of Delivery: </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {saleOrder.termsAndCondition}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.itemsTable}>
            <View style={styles.itemsTableHeader}>
              <View style={[styles.itemsTableHeaderColumn, { flex: 0.5 }]}>
                <Text style={styles.itemsTableHeaderCell}>SI No</Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 8 }]}>
                <Text style={styles.itemsTableHeaderCell}>
                  Description of Goods
                </Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                <Text style={styles.itemsTableHeaderCell}>HSN/SAC</Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                <Text style={styles.itemsTableHeaderCell}>Due on</Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                <Text style={styles.itemsTableHeaderCell}>Quantity </Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                <Text style={styles.itemsTableHeaderCell}>Rate</Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 1 }]}>
                <Text style={styles.itemsTableHeaderCell}>per</Text>
              </View>
              <View style={[{ flex: 3 }]}>
                <Text style={styles.itemsTableHeaderCell}>Amount</Text>
              </View>
            </View>
            {itemsWithTaxes.map((item, index) => (
              <View style={styles.itemsTableContent} key={index} wrap={false}>
                <View style={[styles.itemsTableContentColumn, { flex: 0.5 }]}>
                  <Text style={styles.itemsTableContentCell}>
                    {!item.isTaxRow ? index + 1 : ""}
                  </Text>
                </View>
                <View style={[styles.itemsTableHeaderColumn, { flex: 8 }]}>
                  <Text
                    style={[
                      styles.itemsTableHeaderCell,
                      { fontWeight: "bold" },
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
                <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                  <Text style={styles.itemsTableHeaderCell}>
                    {item.hsncode}
                  </Text>
                </View>
                <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                  <Text style={styles.itemsTableHeaderCell}>
                    {item.dueOnDate}
                  </Text>
                </View>
                <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                  <Text
                    style={[
                      styles.itemsTableHeaderCell,
                      { fontWeight: "bold" },
                    ]}
                  >
                    {item.quantity}
                  </Text>
                </View>
                <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                  <Text style={styles.itemsTableHeaderCell}>{item.rate}</Text>
                </View>
                <View style={[styles.itemsTableHeaderColumn, { flex: 1 }]}>
                  <Text style={styles.itemsTableHeaderCell}>{item.unit}</Text>
                </View>
                <View style={[{ flex: 3 }]}>
                  <Text
                    style={[
                      styles.itemsTableHeaderCell,
                      { fontWeight: "bold" },
                    ]}
                  >
                    {formatCurrency(item.totalCost)}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.itemsTableTotal}>
              <View
                style={[styles.itemsTableContentColumn, { flex: 0.5 }]}
              ></View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 8 }]}>
                <Text
                  style={[
                    styles.itemsTableHeaderCell,
                    { fontWeight: "bold", textAlign: "right" },
                  ]}
                >
                  Total
                </Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                <Text style={styles.itemsTableHeaderCell}></Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                <Text style={styles.itemsTableHeaderCell}></Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                <Text
                  style={[styles.itemsTableHeaderCell, { fontWeight: "bold" }]}
                >
                  {totalQuantity}
                </Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 2 }]}>
                <Text style={styles.itemsTableHeaderCell}></Text>
              </View>
              <View style={[styles.itemsTableHeaderColumn, { flex: 1 }]}>
                <Text style={styles.itemsTableHeaderCell}></Text>
              </View>
              <View style={[{ flex: 3 }]}>
                <Text
                  style={[styles.itemsTableHeaderCell, { fontWeight: "bold" }]}
                >
                  {formatCurrency(grandTotal)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.salesOrderFooter}>
            <View style={{ padding: 10 }}>
              <Text>Amount Chargeable (in words):</Text>
              <Text style={{ fontWeight: "bold", marginTop: 5 }}>
                {toWords.convert(grandTotal)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.authorisedSignatory}>
          <View style={{ padding: 10 }}>
            <Text>
              Company's PAN{" "}
              <Text style={{ fontWeight: "bold" }}>
                : {saleOrder.panNumber}
              </Text>
            </Text>
          </View>
          <View style={styles.authorisedSignatoryContent}>
            <Text style={{ fontWeight: "bold", marginBottom: 35 }}>
              for Planetto Tooltech Pvt Ltd
            </Text>
            <Text>Authorised Signatory</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default function SalesOrderPDFModel({ show, onClose, salesOrderId }) {
  const [salesOrderData, setSalesOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (salesOrderId) {
      fetchSalesOrderData();
    } else {
      // Clear data when modal is closed or salesOrderId is null
      setSalesOrderData(null);
    }
  }, [salesOrderId]);

  const fetchSalesOrderData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/sales/getSaleOrderById/${salesOrderId}`
      );
      setSalesOrderData(response.data);
    } catch (error) {
      console.error("Failed to fetch sales order details:", error);
      toast.error("Could not load sales order details for preview.");
      setSalesOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Sales Order Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "80vh" }}>
        {isLoading || !salesOrderData ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <p>Loading Preview...</p>
          </div>
        ) : (
          <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
            <MyDocument data={salesOrderData} />
          </PDFViewer>
        )}
      </Modal.Body>
    </Modal>
  );
}
