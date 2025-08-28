import { StyleSheet } from "@react-pdf/renderer";

const BORDER_COLOR = "#000";
const BORDER_WIDTH = 2;

export const SalesOrderPdfStyles = StyleSheet.create({
  // --- Basic page setup ---
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 55,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    color: "#000",
    flexDirection: "column",
  },
  titleContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  pageBorderFirst: {
    position: "absolute",
    top: 55,
    left: 19,
    right: 19,
    bottom: 19,
    borderStyle: "solid",
    borderColor: BORDER_COLOR,
    borderWidth: BORDER_WIDTH,
  },
  contentFirstPage: {
    paddingTop: 37,
  },

  topDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  topDetailsSubsequent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 20,
  },
  topDetailsLeft: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: BORDER_COLOR,
  },
  topDetailsRight: {
    flex: 1,
    marginRight: 1,
  },
  planetoInfo: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    alignItems: "center",
    marginLeft: 1,
  },
  planetoLogo: {
    width: 50,
    height: 50,
    borderStyle: "solid",
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    // Added for alignment
    alignItems: "center",
    justifyContent: "center",
  },
  planetoInfoText: {
    padding: 4,
    flex: 1,
  },
  shipTo: {
    padding: 4,
    marginLeft: 1,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  billTo: {
    padding: 4,
    marginLeft: 1,
  },

  // --- Top Right Details ---
  salesOrderDetails: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    flexDirection: "column",
  },
  voucherNo: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: BORDER_COLOR, // Corrected from borderBottomColor
    width: "50%",
  },
  dated: {
    padding: 4,
    width: "50%",
  },
  modeOfPayment: {
    padding: 4,
    textAlign: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: BORDER_COLOR,
    borderBottomColor: BORDER_COLOR, // Added for consistency
  },
  orderNO: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: BORDER_COLOR, // Corrected from borderBottomColor
    width: "50%",
  },
  otherReferences: {
    padding: 4,
    width: "50%",
  },
  dispatchDestination: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  dispatched: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: BORDER_COLOR, // Corrected from borderBottomColor
    width: "50%",
  },
  destination: {
    padding: 4,
    width: "50%",
  },
  termsOfDelivery: {
    padding: 6,
  },

  // --- Items Table ---
  itemsTable: {
    marginRight: 1,
    marginLeft: 1,
  },
  itemsTableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR, // Added for consistency
  },
  itemsTableHeaderColumn: {
    borderStyle: "solid",
    borderColor: BORDER_COLOR,
    borderRightWidth: 1,
  },
  itemsTableHeaderCell: {
    textAlign: "center",
    padding: 2,
    fontSize: 9, // Slightly smaller for headers
  },
  itemsTableContent: {
    flexDirection: "row",
  },
  itemsTableContentColumn: {
    borderStyle: "solid",
    borderColor: BORDER_COLOR,
    borderRightWidth: 1,
  },
  itemsTableTotal: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: BORDER_COLOR,
    borderBottomColor: BORDER_COLOR,
  },
  itemsTableContentCell: {
    textAlign: "center",
    padding: 2,
  },

  // --- Footer Section ---
  salesOrderFooter: {
    margin: 1,
    borderTopColor: BORDER_COLOR,
  },

  authorisedSignatory: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    // Removed margins, as the spacer now handles positioning
  },
  authorisedSignatoryContent: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 4,
    width: "40%", // Give it a defined width
    textAlign: "center",
  },
  mainContent: {
    flexGrow: 1,
  },
});
