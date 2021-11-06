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
})

const Quote = ({date, order, contact_name, address, city, state, zip_code, phone}) => {  
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
      </Page>
    </Document>
  )
}

export default Quote
