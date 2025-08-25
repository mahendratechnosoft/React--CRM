import React, { useEffect, useState } from "react"; // <-- Make sure useState and useEffect are imported here
import { Modal } from "react-bootstrap";
import { Document, Page, Text, View, PDFViewer, Image } from "@react-pdf/renderer";
import axiosInstance from "../../BaseComponet/axiosInstance";
import { toast } from "react-toastify";
import { QuotationPdfStyles as styles } from "./QuotationPdfStyles";

const MyDocument = ({ data }) => {
  if (!data) {
    return <Document><Page style={styles.page}><Text>Loading document...</Text></Page></Document>;
  }



  const { quotationInfo, partsAndProcess, consideration } = data;
  const grandTotal = (partsAndProcess || []).reduce((total, part) => {
    const partSubTotal = (part.partProcess || []).reduce((subTotal, process) => {
      const cost = Number(String(process.totalCost || '0').replace(/,/g, ''));
      return subTotal + (isNaN(cost) ? 0 : cost);
    }, 0);
    return total + partSubTotal;
  }, 0);
  console.log("Quotation data:", quotationInfo);

  const groupedConsiderations = (consideration || []).reduce((acc, current) => {
    const title = current.titel; // Handle typo from backend
    if (!acc[title]) {
      acc[title] = {
        title: title,
        descriptions: [],
      };
    }
    acc[title].descriptions.push(current.description);
    return acc;
  }, {});

  const considerationGroups = Object.values(groupedConsiderations);


  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.mainContainer]}>
        <View style={styles.pageBorder} fixed />
        <View >
          <View fixed>
            {/* Top Section: Company Info */}
            <View style={styles.companySection}>
              <View style={styles.logoPlaceholder}>
                {/* As requested, the image is skipped for now.
                                When ready, you can add it like this:
                                <Image src="/path/to/your/logo.png" style={styles.logo} />
                            */}
              </View>
              <View style={styles.companyDetails}>
                <Text style={styles.companyName}>PLANETTO TOOLTECH PVT LTD</Text>
                <Text style={styles.companyAddress}>Plot No. PAP-A24, Phase-IV, MIDC Chakan, Nighoje,</Text>
                <Text style={styles.companyAddress}>Behind Mahindra & Mahindra, Pune - 410501, Maharashtra, India.</Text>
                <Text style={styles.companyContact}>MO: +91 89565 31300 / +91 98221 88090, GST No. 27AAJCP1343R1ZR</Text>
              </View>
            </View>

            {/* Middle Section: Quotation Title */}
            <View style={styles.quotationTitleContainer}>
              <Text style={styles.quotationTitle}>QUOTATION</Text>
            </View>

            {/* Bottom Section: Customer and Quotation Details */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {/* Column 1 (Left) */}
                <View style={[styles.tableCol, styles.leftCell, { flex: 3 }]}>
                  <Text
                    style={styles.boldText}
                    hyphenationCallback={(word) => [word]} // Add this to prevent breaking long company names
                  >
                    M/S. {quotationInfo.companyName || "N/A"}
                  </Text>
                  <Text
                    style={styles.otherCompanyAddress}
                    hyphenationCallback={(word) => [word]} // Add this to prevent breaking words in the address
                  >
                    {quotationInfo.address + ", " + quotationInfo.city + ", " + quotationInfo.state
                      + ", " + quotationInfo.country + " - " + quotationInfo.zip || "N/A"}
                  </Text>
                </View>

                {/* Column 2 (Center) */}
                <View style={[styles.tableCol, { flex: 2 }]}>
                  {/* Row 1 inside the column */}
                  <View style={[styles.innerRow]}>
                    <Text style={[styles.boldText, { padding: 2 }]}>
                      Kind Attn. : {quotationInfo.contactPersonName || "N/A"}
                    </Text>
                  </View>

                  {/* Row 2 inside the column */}
                  <View>
                    <Text style={[{ padding: 2, lineHeight: 0.7 }]}>
                      Reference :- {quotationInfo.refrence || "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Column 3 (Right - Labels) */}
                <View style={[styles.tableCol, styles.rightCell, { flex: 1 }]}>
                  <Text style={[styles.qtnNO]}>QUOTATION NO:</Text>
                  <Text style={[styles.qtnNO]}>QUOTATION DATE:</Text>
                  <Text style={[{ padding: 2 }]}>SUPPLIER CODE:</Text>
                </View>

                {/* Column 4 (Right - Values) */}
                <View style={[styles.tableCol, styles.rightCell, { flex: 1 }]}>
                  <Text style={[styles.qtnNO, styles.boldText]}>{quotationInfo.quotationNumber || "N/A"}</Text>
                  <Text style={[styles.qtnNO, styles.boldText]}>{quotationInfo.quotationDate || "N/A"}</Text>
                  <Text style={[{ padding: 2 }, styles.boldText]}>{quotationInfo.supplierCode || "N/A"}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Middle Section: Quotation Details */}
          <View style={styles.massageSection}>
            <Text style={[{ padding: 2 }]}>Dear Sir/Madam,</Text>
            <Text style={[{ padding: 2 }]}>We thank you for your enquiry and are pleased to quote our lowest quotation for
              <Text style={styles.boldText}>{" " + quotationInfo.projectName + " Project" || "N/A"}</Text>.</Text>
          </View>

          {/* process table section  */}
          <View style={styles.tableProcesses}>
            <View style={styles.processTableHeader}>
              <View style={[styles.tableProcessCol, styles.tableColHeader, { flex: 1 }]}>
                <Text style={[styles.boldText, styles.cellText]}>Sl #</Text>
              </View>
              <View style={[styles.tableProcessCol, styles.tableColHeader, { flex: 3 }]}>
                <Text style={[styles.boldText, styles.cellText]}>Part No & Name</Text>
              </View>
              <View style={[styles.tableProcessCol, styles.tableColHeader, { flex: 3 }]}>
                <Text style={[styles.boldText, styles.cellText]}>Part Size, Matl & Thk</Text>
              </View>
              <View style={[styles.tableProcessCol, styles.tableColHeader, { flex: 3 }]}>
                <Text style={[styles.boldText, styles.cellText]}>Part View</Text>
              </View>
              <View style={[styles.tableProcessCol, styles.tableColHeader, { flex: 3 }]}>
                <Text style={[styles.boldText, styles.cellText]}>Tool Construction</Text>
              </View>
              <View style={[styles.tableProcessCol, styles.tableColHeader, { flex: 2 }]}>
                <Text style={[styles.boldText, styles.cellText]}>OP No</Text>
              </View>
              <View style={[styles.tableProcessCol, styles.tableColHeader, { flex: 4 }]}>
                <Text style={[styles.boldText, styles.cellText]}>Description</Text>
              </View>

              {/* Main container for the "Tool Size" header cell */}
              <View style={[styles.toolSizeCell, { flex: 3 }]}>

                {/* Top part: "Tool Size (mm)" text */}
                <View style={styles.toolSizeTop}>
                  <Text style={[styles.boldText, { padding: 2 }]}>Tool Size (mm)</Text>
                </View>

                {/* Bottom part: The row for "L | W | H" */}
                <View style={styles.toolSizeBottomRow}>

                  {/* Sub-cell View for 'L'. The border is on this View. */}
                  <View style={[styles.toolSizeSubCell, { borderRightWidth: 1 }]}>
                    <Text style={styles.boldText}>L</Text>
                  </View>

                  {/* Sub-cell View for 'W'. The border is on this View. */}
                  <View style={[styles.toolSizeSubCell, { borderRightWidth: 1 }]}>
                    <Text style={styles.boldText}>W</Text>
                  </View>

                  {/* Sub-cell View for 'H'. No right border needed. */}
                  <View style={styles.toolSizeSubCell}>
                    <Text style={styles.boldText}>H</Text>
                  </View>

                </View>
              </View>

              {/* Last cell uses unified style and removes its right border */}
              <View style={[styles.tableProcessCol, styles.tableColHeader, { flex: 3, borderRightWidth: 0 }]}>
                <Text style={[styles.boldText, styles.cellText]}>Tool Cost</Text>
              </View>
            </View>

            {partsAndProcess.map((item, index) => {

              const subTotalValue = (item.partProcess || []).reduce((accumulator, process) => {
                const cost = Number(String(process.totalCost || '0').replace(/,/g, ''));
                return accumulator + (isNaN(cost) ? 0 : cost);
              }, 0);

              return (
                <View key={index} style={styles.partRowWrapper} >
                  <View style={styles.processTableContent}>

                    <View style={[styles.tableProcessCol, { flex: 1 }]}>
                      <Text style={styles.cellText}>{index + 1}</Text>
                    </View>

                    <View style={[styles.tableProcessCol, { flex: 2.95 }]}>
                      <Text style={styles.cellText}>
                        {item.partNo || "N/A"}{"\n"}
                        {item.partName || "N/A"}
                      </Text>
                    </View>

                    <View style={[styles.tableProcessCol, { flex: 2.95 }]}>
                      <Text style={styles.cellText}>
                        {(() => {
                          const details = [];

                          // Conditionally add Part Size if it's present (and not an empty string)
                          if (item.partSize != null && item.partSize !== '') {
                            details.push(`Part Size - ${item.partSize}`);
                          }

                          // Conditionally add Part Weight if it's present (and not an empty string)
                          if (item.partWeight != null && item.partWeight !== '') {
                            details.push(`Part Weight - ${item.partWeight}`);
                          }

                          // Always add Material and Thickness
                          details.push(`Matl - ${item.material || "N/A"}`);
                          details.push(`Thk - ${item.thickness || "N/A"}`);

                          return details.join('\n');
                        })()}
                      </Text>
                    </View>

                    <View style={[styles.tableProcessCol, { flex: 2.77, padding: 2, flexDirection: 'column', gap: 3 }]}>
                      {(item.partImagesWithId || []).length > 0 ? (
                        (item.partImagesWithId || []).map((img, i) => (
                          <Image key={i} src={"data:image/jpeg;base64," + img.base64Image} style={styles.partViewImg} />
                        ))
                      ) : (
                        <Text style={styles.cellText}>N/A</Text>
                      )}
                    </View>

                    <View style={[styles.operationsCol, { flex: 15 }]} wrap={true}>
                      {(item.partProcess || []).map((process, i) => {
                        const isLastItem = i === (item.partProcess || []).length - 1;
                        
                        return(
                        <View key={"process-" + i} style={[styles.opRow, !isLastItem && styles.opRowBottomBorder]} wrap={false}>
                          <View style={[styles.processOpCell, { flex: 3 }]}>
                            <Text style={styles.cellText}>
                              {process.toolConstruction || "N/A"}
                            </Text>
                          </View>

                          <View style={[styles.processOpCell, { flex: 2 }]}>
                            <Text style={styles.cellText}>{process.oprationNumber || "N/A"}</Text>
                          </View>
                          <View style={[styles.processOpCell, { flex: 4 }]}>
                            <Text style={styles.cellText}>{process.description || "N/A"}</Text>
                          </View>
                          <View style={[styles.toolSizeDataCell, { flex: 3 }]}>
                            <View style={styles.toolSizeDataSubCell}>
                              <Text style={styles.cellText}>{process.length ?? "-"}</Text>
                            </View>
                            <View style={styles.toolSizeDataSubCell}>
                              <Text style={styles.cellText}>{process.width ?? "-"}</Text>
                            </View>
                            <View style={[styles.toolSizeDataSubCell, { borderRightWidth: 0 }]}>
                              <Text style={styles.cellText}>{process.height ?? "-"}</Text>
                            </View>
                          </View>
                          <View style={[styles.processOpCell, { flex: 3, borderRightWidth: 0 }]}>
                            {/* Formatting the individual tool cost */}
                            <Text style={styles.cellText}>
                              {Number(String(process.totalCost || '0').replace(/,/g, '')).toLocaleString('en-IN')}
                            </Text>
                          </View>
                        </View>
                      );
                      })}
                    </View>
                  </View>

                  {/* SUB TOTAL ROW - Correctly Aligned */}
                  <View style={styles.subTotalRow}>
                    <View style={styles.subTotalSpacerCell}></View>
                    <View style={styles.subTotalLabelCell}>
                      <Text style={styles.boldText}>SUB TOTAL:</Text>
                    </View>
                    {/* --- VALUE UPDATED HERE --- */}
                    <View style={styles.subTotalValueCell}>
                      <Text style={styles.boldText}>
                        {subTotalValue.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            })}
            {/* GRAND TOTAL ROW */}
            <View style={styles.grandTotalRow}>
              <View style={styles.subTotalSpacerCell}></View>
              <View style={styles.grandTotalLabelCell}>
                <Text style={[styles.boldText, { color: '#c00000' }]}>GRAND TOTAL:</Text>
              </View>
              <View style={styles.grandTotalValueCell}>
                <Text style={[styles.boldText, { color: '#c00000' }]}>
                  {grandTotal.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
          {/* QUOTATION CONSIDERATIONS SECTION */}
          <View style={styles.considerationsContainer}>
            <Text style={styles.considerationsTitle}>QUOTATION CONSIDERATIONS :</Text>
            <View style={styles.considerationsTable}>
              {considerationGroups.map((group, index) => (
                <View key={index} style={styles.considerationsTableRow}>
                  {/* Column 1: Serial Number (Vertically Centered) */}
                  <View style={styles.considerationsNumberCell}>
                    <Text style={styles.cellText}>{index + 1}</Text>
                  </View>

                  {/* Column 2: Title (Vertically Centered) */}
                  <View style={styles.considerationsTitleCell}>
                    <Text style={[styles.cellText, { textAlign: 'left' }]}>{group.title || 'N/A'}</Text>
                  </View>

                  {/* Column 3: Descriptions (Container for multiple lines) */}
                  <View style={styles.considerationsDescriptionCell}>
                    {group.descriptions.map((desc, descIndex) => (
                      <View
                        key={descIndex}
                        style={[
                          styles.descriptionItem,
                          descIndex < group.descriptions.length - 1 ? styles.descriptionItemBorder : {}
                        ]}
                      >
                        <Text style={[styles.cellText, { textAlign: 'left' }]}>{desc || 'N/A'}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Closing and Signature Section */}
          <View style={styles.closingContainer}>
            <View style={styles.closingRow}>
              <Text>We trust you will find our prices competitive and look forward to the pleasure of receiving your valuable order.</Text>
            </View>
            <View style={styles.closingRow}>
              <Text>Thanking you,</Text>
            </View>
            <View style={styles.closingRow}>
              <Text style={styles.boldText}>For PLANETTO TOOLTECH PVT LTD.</Text>
            </View>
            <View style={[styles.closingRow, { height: 40 }]}>
              <Image src="https://i.ibb.co/7jPgQ5z/lokesh-sign.png" style={styles.signatureImage} />
            </View>
            <View style={styles.closingRow}>
              <Text style={styles.boldText}>Authorized Signatory</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document >
  );
};

export default function QuotationPDFModel({ show, onClose, quotationId }) {

  const [quotationData, setQuotationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (quotationId) {
      fetchQuotationData();
    }
  }, [quotationId]);

  const fetchQuotationData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/sales/getQuoatation/${quotationId}`);
      setQuotationData(response.data);
    } catch (error) {
      console.error("Failed to fetch quotation details:", error);
      toast.error("Could not load quotation details for preview.");
      setQuotationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Quotation Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "80vh" }}>
        {isLoading || !quotationData ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <p>Loading Preview...</p>
          </div>
        ) : (
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <MyDocument data={quotationData} />
          </PDFViewer>
        )}
      </Modal.Body>
    </Modal>
  );
}