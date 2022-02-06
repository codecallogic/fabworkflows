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
  sectionTwo: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10mm'
  },
  sectionThree: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10mm'
  },
  sectionSignature: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10mm'
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-end',
    width: 150,
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
    fontSize: 18,
    fontWeight: 300,
    paddingBottom: 3
  },
  subheading: {
    fontSize: 12,
    fontWeight: 200,
    padding: 2,
  },
  subheadingTwo: {
    fontSize: 12,
    fontWeight: 200,
    padding: 2,
    marginTop: '5mm'
  },
  subheadingGray: {
    fontSize: 14,
    fontWeight: 200,
    paddingTop: 5,
    color: '#99A6B5',
    textTransform: 'capitalize'
  },
  sectionTwoItem: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '10mm',
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

const Agreement = ({stateData, account_name}) => {

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
        <View style={styles.sectionTwo}>
          {/* <View style={styles.sectionTwoItem}>
            <Text style={styles.heading}>Account Name:</Text>
            <Text style={styles.subheadingGray}>{account_name ? account_name : 'unknown'}</Text>
          </View> */}
          <View style={styles.sectionTwoItem}>
            <Text style={styles.heading}>Quote Name</Text>
            <Text style={styles.subheadingGray}>{stateData.quote_name ? stateData.quote_name : 'unknown'}</Text>
          </View>
          <View style={styles.sectionTwoItem}>
            <Text style={styles.heading}>Quote Date</Text>
            <Text style={styles.subheadingGray}>{stateData.quote_date ? stateData.quote_date : 'unknown'}</Text>
          </View>
        </View>
        <View style={styles.sectionThree}>
          <Text style={styles.headingTwo}>AGREEMENT</Text>
          <Text style={styles.subheading}>Customer Information: NATURAL STONE & QUARTZ STONE</Text>
          <Text style={styles.subheadingTwo}>Thank you for your stone order. We at Innovate Stones appreciate your business. In order to serve you better and prevent any misunderstanding about your order, we would like to review the following information.</Text>
          <Text style={styles.subheadingTwo}>1 Year Warranty: Please note this warranty does not cover staining, chipping scratching or etching due to improper maintenance, neglect misuse or for circumstances beyond the range of our limit warranty. (Please visit our website for detailed warranty information) Warranty is only valid if customer registers the warranty online. Customer has 5 days to register for warranty.</Text>
          <Text style={styles.subheadingTwo}>Product:</Text>
          <Text style={styles.subheading}>Natural Stone:</Text>
          <Text style={styles.subheadingTwo}>• Variation in the natural stone (quartz) color, pattern, size shape and shade are inherited and unique characteristics are to be expected with this product. This does not affect the product performance in any manner.</Text>
          <Text style={styles.subheading}>• Quartz Stone is structurally more resistant to surface damage than other stone. However , all stone can be damaged by excessive force or pressure.</Text>
          <Text style={styles.subheading}>• Quartz is not a seamless product, seams are visible. Where there are seams, the product pattern and shade can change.</Text>
          <Text style={styles.subheading}>• Natural stone can be damaged by sudden and rapid change of temperature, especially near edges, as well as direct or sustained heating of the top. Quartz may not withstand the direct transfer of heat form pots and pans and other cooking units such as electric frying pans and griddles, some crock pots or roaster ovens and heat lamps. Therefore the use of hot pad or trivet is recommended.</Text>
          <Text style={styles.subheading}>• Quartz honed and semi-gloss products will appear dull and not shinny.</Text>
          <Text style={styles.subheading}>• Quartz installation is optimized when walls and cabinets are properly prepared for installations. This includes, but is not limited to, structurally sound, straight, level and square walls and cabinets, lack of which may cause poor installation and poor seam fit, or inconsistent countertop overhang and placement.</Text>
          <Text style={styles.subheading}>• Carefree: No sealing, polishing, reconditioning. Simply wash with warm water. It’s that simple.</Text>
          <Text style={styles.subheading}>• Food Safe:Quartz is a non-porous surface for food preparation.</Text>
          <Text style={styles.subheading}>• Stain Resistant: Quartz will resist stains from juices, food coloring, coffee, tea, wine, grapes, nail polish, paint,and permanent markers.</Text>
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

export default Agreement
