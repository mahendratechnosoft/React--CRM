import { StyleSheet } from '@react-pdf/renderer';

export const QuotationPdfStyles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 8,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        color: '#000',
    },
    pageBorder: {
        position: 'absolute',
        top: 19,
        left: 19,
        right: 19,
        bottom: 19,
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 2,
    },
    // Top section with company logo and details
    companySection: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: '#000',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    logoPlaceholder: {
        width: '15%',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyDetails: {
        width: '85%',
        padding: 5,
        textAlign: 'center',
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        textDecoration: 'underline',
        marginBottom: 4,
    },
    companyAddress: {
        fontSize: 9,
        marginBottom: 4,
    },
    companyContact: {
        fontSize: 9,
    },
    // "QUOTATION" title section
    quotationTitleContainer: {
        backgroundColor: '#fbd4b4',
        textAlign: 'center',
        padding: 4,
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 1,
        borderTopWidth: 1,
    },

    quotationTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        textDecoration: 'underline',

    },
    detailsContainer: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    customerInfo: {
        width: '50%',
        padding: 5,
        borderRightStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#000',
    },
    detailsContainerPart2: {
        flexDirection: 'row',
    },

    tableRow: {
        flexDirection: "row",
    },
    tableCol: {
        flex: 1,
        borderStyle: "solid",
        borderColor: "#000",
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    leftCell: {
        borderLeftStyle: "solid",
        borderLeftWidth: 1,
        borderLeftColor: "#000",
        flex: 2,
        padding: 2
    },

    boldText: {
        fontWeight: "bold",
    },

    innerRow: {
        borderBottomWidth: 1,
        borderColor: "#000",
    },
    qtnNO: {
        padding: 2,
        borderBottomWidth: 1,
        borderColor: "#000",
    },
    massageSection: {
        paddingTop: 10,
        borderStyle: "solid",
        borderColor: "#000",
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },

    // Process Table styles
    tableProcesses: {
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 1,
    },
    tableProcessCol: {
        borderRightStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#000',
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    tableColHeader: {
        backgroundColor: '#fbd4b4',
    },
    processTableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    toolSizeCell: {
        borderRightWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fbd4b4',
        flexDirection: 'column',
    },
    toolSizeTop: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '100%',
        textAlign: 'center',
    },
    toolSizeBottomRow: {
        flexDirection: 'row',
        flexGrow: 1,
    },
    toolSizeSubCell: {
        flex: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    partRowWrapper: {},
    processTableContent: {
        display: 'flex',
        flexDirection: 'row',
    },
    cellText: {
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 2,
        paddingRight: 2,
        lineHeight: 0.7,
    },
    partViewImg: {
        width: '100%',
        height: '50px',
        objectFit: 'contain',
    },
    operationsCol: {
        display: 'flex',
        flexDirection: 'column',
    },
    opRow: {
        display: 'flex',
        flexDirection: 'row',
        borderColor: '#000',
        flexGrow: 1,
    },
    opRowBottomBorder: {
        borderBottomWidth: 1,
    },
    processOpCell: {
        borderRightWidth: 1,
        borderColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolSizeDataCell: {
        flexDirection: 'row',
        borderRightWidth: 1,
        borderColor: '#000',
        display: 'flex',
    },
    toolSizeDataSubCell: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subTotalRow: {
        display: 'flex',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fbd4b4',
    },
    subTotalSpacerCell: {
        flex: 10,
        borderColor: '#000',
    },
    subTotalLabelCell: {
        flex: 12,
        padding: 4,
        textAlign: 'right',
        display: 'flex',
        justifyContent: 'center',
    },
    subTotalValueCell: {
        flex: 3,
        padding: 2,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
    },

    grandTotalRow: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fbd4b4', // Light yellow background
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    grandTotalLabelCell: {
        flex: 12,
        padding: 5,
        textAlign: 'right',
        display: 'flex',
        justifyContent: 'center',
    },
    grandTotalValueCell: {
        flex: 3,
        padding: 2,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
    considerationsContainer: {
        marginTop: 10,
    },
    considerationsTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        backgroundColor: '#fbd4b4',
    },
    considerationsTable: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 5,
    },
    considerationsTableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    considerationsNumberCell: {
        flex: 0.4,
        borderRightWidth: 1,
        borderColor: '#000',
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 2
    },
    considerationsTitleCell: {
        flex: 2,
        borderRightWidth: 1,
        borderColor: '#000',
        display: 'flex',
        // justifyContent: 'center',
        padding: 2
    },
    considerationsDescriptionCell: {
        flex: 8,
        flexDirection: 'column',
    },
    descriptionItem: {
        padding: 1,
        textAlign: 'left',
    },
    descriptionItemBorder: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
    },
    closingContainer: {
        marginTop: 'auto', // Pushes this section to the bottom of the content flow
        borderStyle: 'solid',
        borderColor: '#000',
        borderTopWidth: 1, // It acts as a separator from the content above
    },
    closingRow: {
        padding: 4,
    },
    signatureImage: {
        width: 80,
        height: 30,
        objectFit: 'contain', // Ensures the image scales correctly
    },
    otherCompanyAddress: {
        marginTop: 4,
        lineHeight: 0.7
    },
    body: {
    }
});