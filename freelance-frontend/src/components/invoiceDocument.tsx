import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  smallText: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#6c757d",
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#343a40",
    marginRight: 8,
    marginBottom: 5,
  },
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 25,
  },
  section: {
    flexGrow: 1,
    paddingVertical: 25,
    paddingHorizontal: 20,
    border: "1px solid #000000",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  normalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clientInfo: {
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    width: "25%",
    borderRightColor: "#000",
    borderRightStyle: "solid",
    padding: 5,
    textAlign: "right",
    fontSize: 12,
  },
  tableCellLeft: {
    textAlign: "left",
  },
  tableHeader: {
    backgroundColor: "#E4E4E4",
    fontSize: 12,
    fontWeight: "bold",
  },
  totalAmountContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginTop: 50,
    padding: 5,
  },
})

interface InvoiceDocumentProps {
  billingCompany: string
  billingAddress: string
  billingEmail: string
  clientCompany: string
  clientAddress: string
  clientEmail: string
  clientContact: string
  dueDate: Date
  bankAccount: string
  itemDescription: string
  itemQuantity: number
  itemPrice: number
}

export default function InvoiceDocument(props: InvoiceDocumentProps) {
  const {
    billingCompany,
    billingAddress,
    billingEmail,
    clientCompany,
    clientAddress,
    clientEmail,
    clientContact,
    dueDate,
    bankAccount,
    itemDescription,
    itemQuantity,
    itemPrice,
  } = props

  const totalAmount = itemQuantity * itemPrice

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.clientInfo}>
              <Text style={styles.subHeader}>From:</Text>
              <Text style={styles.smallText}>
                {clientCompany ? clientCompany : "Client Company"}
              </Text>
              <Text style={styles.smallText}>
                {clientAddress ? clientAddress : "Client Address"}
              </Text>
              <Text style={styles.smallText}>
                {clientEmail ? clientEmail : "Client Email"}
              </Text>
              <Text style={styles.smallText}>
                P: {clientContact ? clientContact : "Client Contact"}
              </Text>
            </View>

            <View style={styles.header}>
              <Text
                style={{ fontSize: 38, fontWeight: "bold", color: "#495057" }}
              >
                Invoice
              </Text>
              <Text style={{ fontSize: 14, color: "#adb5bd" }}>
                Invoice No: #0000001
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.clientInfo}>
              <Text style={styles.subHeader}>Bill To:</Text>
              <Text style={styles.smallText}>
                {billingCompany ? billingCompany : "Billing Company"}
              </Text>
              <Text style={styles.smallText}>
                {billingAddress ? billingAddress : "Billing Address"}
              </Text>
              <Text style={styles.smallText}>
                {billingEmail ? billingEmail : "Billing Email"}
              </Text>
            </View>

            <View style={styles.clientInfo}>
              <View style={styles.normalRow}>
                <Text style={styles.subHeader}>Invoice Date:</Text>
                <Text style={styles.smallText}>
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.normalRow}>
                <Text style={styles.subHeader}>Due Date:</Text>
                <Text style={styles.smallText}>
                  {new Date(dueDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.normalRow}>
                <Text style={styles.subHeader}>Bank Account:</Text>

                <Text style={styles.smallText}>
                  {bankAccount ? bankAccount : "Bank Account"}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableCellLeft]}>
                  Item Description
                </Text>
                <Text style={styles.tableCell}>Qty</Text>
                <Text style={styles.tableCell}>Price</Text>
                <Text style={styles.tableCell}>Amount</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellLeft]}>
                  {itemDescription ? itemDescription : "Item 1"}
                </Text>
                <Text style={styles.tableCell}>
                  {itemQuantity ? itemQuantity : "2"}
                </Text>
                <Text style={styles.tableCell}>
                  {itemPrice ? itemPrice : "10.00"}
                </Text>
                <Text style={styles.tableCell}>{totalAmount}</Text>
              </View>
            </View>
          </View>

          <View style={styles.totalAmountContainer}>
            <View style={styles.clientInfo}>
              <View style={styles.normalRow}>
                <Text style={styles.subHeader}>Total Amount:</Text>
                <Text style={styles.smallText}>
                  SGD {totalAmount ? totalAmount : "0.00"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
