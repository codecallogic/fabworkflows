import {useEffect, useState} from 'react'
import {Document, Page, Text, View, Image, StyleSheet} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 35,
    paddingRight: 35
  },
  section: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    padding: 1,
    margin: 15,
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-end',
    width: 150,
  },
  sectionContainerTwo: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-end',
    width: 350,
  },
  image: {
    objectFit: 'contain',
    width: 200
  },
  heading: {
    fontSize: 18,
    fontWeight: 700,
    paddingBottom: 3
  },
  headingTwo: {
    fontSize: 16,
    fontWeight: 700,
    paddingBottom: 3
  },
  subheading: {
    fontSize: 12,
    fontWeight: 200,
    padding: 2,
  },
  sectionTable: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 1,
    marginTop: 15
  },
  sectionTableTwo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    padding: 1,
    marginTop: 15
  },
  sectionRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 3,
  },
  sectionRowTwo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    padding: 3,
  },
  sectionContainerThree: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    margin: 0
  },
  sectionContainerFour: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 0,
    margin: 0
  },
  headingTable: {
    fontSize: 12,
    fontWeight: 700,
    padding: 10,
    width: 200,
    color: 'white',
    backgroundColor: '#fd7e3c',
  },
  headingTableTwo: {
    fontSize: 12,
    fontWeight: 700,
    padding: 10,
    color: 'white',
    backgroundColor: '#fd7e3c',
    textAlign: 'center',
    width: '100%'
  },
  tableRow: {
    fontSize: 12,
    fontWeight: 300,
    textAlign: 'center',
    padding: 10,
    width: 200,
  },
  tableRowTwo: {
    fontSize: 12,
    fontWeight: 300,
    textAlign: 'center',
    padding: 10,
    width: '100%',
    borderBottom: '1px solid #fd7e3c'
  },
  tableColumn: {
    fontSize: 12,
    fontWeight: 300,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #fd7e3c',
    padding: 10,
    color: '#fd7e3c',
    width: 100,
    marginLeft: 5
  },
  fontStyleOne: {
    fontSize: 12,
    fontWeight: 200,
    padding: 2,
    textTransform: 'uppercase'
  },
  fontStyleTwo: {
    fontSize: 9,
    fontWeight: 200,
    padding: 2,
  },
  qualification: {
    position: 'fixed',
    bottom: 1,
    width: '100%',
    marginTop: 30
  },
  sectionSignature: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10mm'
  },
  line: {
    width: '40mm',
    borderBottom: '1px solid black',
    marginRight: '8mm'
  },
  lineTwo: {
    width: '25mm',
    borderBottom: '1px solid black',
    marginRight: '8mm'
  }
})

const Quote = ({date, order, contact_name, address, city, state, zip_code, phone, lines, subtotal, tax, total, po_number, salesperson}) => { 
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <View>
            <Image src='/media/logo_1.jpeg' style={styles.image}></Image>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.heading}>Fabworkflow</Text>
            <Text style={styles.subheading}>720 East Elizabeth Ave.</Text>
            <Text style={styles.subheading}>Linden NJ 07036</Text>
            <Text style={styles.subheading}>908-718-5616</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionContainerTwo}>
            <Text style={styles.headingTwo}>Quotation For:</Text>
            <Text style={styles.subheading}>{contact_name}</Text>
            <Text style={styles.subheading}>{address}</Text>
            <Text style={styles.subheading}>{city}, {state}, {zip_code}</Text>
            <Text style={styles.subheading}>{phone}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.heading}>Quote</Text>
            <Text style={styles.subheading}>{date}</Text>
            <Text style={styles.subheading}>Order: {order}</Text>
          </View>
        </View>
        <View style={styles.sectionContainerThree}>
          <View style={styles.sectionTable}>
            <Text style={styles.headingTable}>Salesperson</Text>
            <Text style={styles.headingTable}>P.O Number</Text>
          </View>
          <View style={styles.sectionRow}>
            <Text style={styles.tableRow}>{salesperson ? salesperson : 'unprovided'}</Text>
            <Text style={styles.tableRow}>{po_number ? po_number : 'unprovided'}</Text>
          </View>
        </View>
        <View style={styles.sectionContainerThree}>
          <View style={styles.sectionTableTwo}>
            <Text style={styles.headingTableTwo}>Quantity</Text>
            <Text style={styles.headingTableTwo}>Description</Text>
            <Text style={styles.headingTableTwo}>Unit Price</Text>
            <Text style={styles.headingTableTwo}>Taxable</Text>
            <Text style={styles.headingTableTwo}>Amount</Text>
          </View>
          {lines.length > 0 && lines.map((item) =>
            <View style={styles.sectionRow}>
              <Text style={styles.tableRowTwo}>{item.quantity}</Text>
              <Text style={styles.tableRowTwo}>{item.description}</Text>
              <Text style={styles.tableRowTwo}>{item.price}</Text>
              <Text style={styles.tableRowTwo}>{item.taxable ? 'yes' : 'no'}</Text>
              <Text style={styles.tableRowTwo}>${+item.price.replace('$', "") * +item.quantity}</Text>
            </View>
          )}
        </View>
        <View style={styles.sectionContainerFour}>
          <View style={styles.sectionRowTwo}>
            <Text style={styles.fontStyleOne}>Subtotal</Text>
            <View style={styles.tableColumn}>
              <Text>$</Text>
              <Text>{subtotal}</Text>
            </View>
          </View>
          <View style={styles.sectionRowTwo}>
            <Text style={styles.fontStyleOne}>Tax Rate</Text>
            <View style={styles.tableColumn}>
              <Text></Text>
              <Text>{tax} %</Text>
            </View>
          </View>
          <View style={styles.sectionRowTwo}>
            <Text style={styles.fontStyleOne}>Total</Text>
            <View style={styles.tableColumn}>
              <Text>$</Text>
              <Text>{total}</Text>
            </View>
          </View>
        </View>
        <View style={styles.qualification}>
          <Text style={styles.headingTwo}>Qualification</Text>
          <Text style={styles.fontStyleTwo}>* Price has been estimated from scaled drawings or by client’s information. The final price is to be determined from dimensions of full-sized templates.</Text>
          <Text style={styles.fontStyleTwo}>* Any deviation or alteration from the template specifications involving extra material or labor will become an extra charge over the above estimate.</Text>
          <Text style={styles.fontStyleTwo}>* Client is responsible to disconnect all plumbing, gas or electric. Removal of old countertops is available upon request(Fee will apply). We do not engage in any electrical, plumbing, carpentry, caulking, leveling cabinets or tile work.</Text>
          <Text style={styles.fontStyleTwo}>* Final seam location to be determined at the time of template.</Text>
          <Text style={styles.fontStyleTwo}>* A deposit is required before the template. Balance is due on installation,1% daily fee incurred for payments post-install.</Text>
          <Text style={styles.fontStyleTwo}>* If the client is not home when the template or installation team comes a charge of $250 will apply to the final bill.</Text>
          <Text style={styles.fontStyleTwo}>* Marble and Granite by nature are subject to change color, tone, and design. We are not responsible for the difference.</Text>
          <Text style={styles.fontStyleTwo}>* All countertops are made from natural granite, therefore, natural 'imperfections'(patterns, streaks, color variances, etc) will exist. Changes can not be made to these natural patterns and color variations. Seam(s) will exist depending on the size of the kitchen countertop, please consult the granite template technician on site for more details.</Text>
          <Text style={styles.fontStyleTwo}>* We reserve the right to cancel any estimate or order at any time without any reason. (Will refund Funds.)</Text>
          <Text style={styles.fontStyleTwo}>* All sales are final. No Refunds.</Text>
        </View>
        <View style={styles.sectionSignature}>
          <Text style={styles.subheading}>Accepted By</Text>
          <Text style={styles.line}></Text>
          <Text style={styles.subheading}>Signature</Text>
          <Text style={styles.line}></Text>
          <Text style={styles.subheading}>Date</Text>
          <Text style={styles.lineTwo}></Text>
        </View>
      </Page>
    </Document>
  )
}

export default Quote
