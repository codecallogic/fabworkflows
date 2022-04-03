import {useEffect, useState} from 'react'
import {Document, Page, Text, View, Image, StyleSheet} from '@react-pdf/renderer'
import moment from 'moment-timezone'
moment.tz(Date.now(), 'America/Los_Angeles')

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
  sectionOne: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: 1,
    margin: 10,
  },
  headingOne: {
    fontSize: 14,
    fontWeight: 700,
    paddingBottom: 3,
  },
  headingOneBold: {
    fontSize: 18,
    fontWeight: 700,
    paddingBottom: 3,
    color: '#404141'
  },
  sectionTwo: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    padding: 1,
    margin: 2,
    borderBottom: '1px dash #404141'
  },
  sectionRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: 1,
    margin: 2,
  },
  normal: {
    fontSize: 12,
    fontWeight: 500,
    paddingBottom: 3,
  },
  sectionThree: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 1,
    margin: 10,
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: '12px',
    backgroundColor: '#fd7e3c',
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 1
  }
})

const Quote = ({stateData, jobIssues}) => { 
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.sectionOne}>
          <View>
            <Text style={styles.headingOneBold}>Job Issues</Text>
          </View>
        </View>
        <View style={styles.sectionTwo}> 
          <View style={{ width: '50%'}}>
            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.headingOneBold}>Job Name: </Text>
              </View>
              <View>
                <Text style={styles.headingOne}>{stateData.name}</Text>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.headingOneBold}>Subject: </Text>
              </View>
              <View>
                <Text style={styles.headingOne}>{jobIssues.subject}</Text>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.headingOneBold}>Category: </Text>
              </View>
              <View>
                <Text style={styles.headingOne}>{jobIssues.category}</Text>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.headingOneBold}>Issue Type: </Text>
              </View>
              <View>
                <Text style={styles.headingOne}>Job</Text>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.headingOneBold}>Status: </Text>
              </View>
              <View>
                <Text style={styles.headingOne}>{jobIssues.status}</Text>
              </View>
            </View> 
          </View>
          <View style={{ width: '50%'}}>
            <View style={{ margin: 1}}>
              <Text style={styles.headingOne}>
                Last Update
              </Text>
              <Text style={styles.normal}>
                {moment(jobIssues.history[jobIssues.history.length - 1].createdAt).format('MM/DD/YYYY HH:mm:ss')}
              </Text>
            </View>
            <View style={{ margin: 1}}>
              <Text style={styles.headingOne}>
                Last Update By
              </Text>
              <Text style={styles.normal}>
                {jobIssues.history[jobIssues.history.length - 1].firstName} {jobIssues.history[jobIssues.history.length - 1].lastName}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionThree}>
          <Text style={styles.headingOneBold}>
            History
          </Text>
          {jobIssues.history.length > 0 && jobIssues.history.map((item, idx) => 
            <View key={idx} style={styles.box}>
              <Text style={styles.headingOne}>
                {item.firstName} ({moment(item.createdAt).format('MM/DD/YYYY HH:mm:ss')})
              </Text>
              <Text style={styles.normal}>
                Created
              </Text>
              <Text style={styles.normal}>
                Subject: {item.subject}
              </Text>
              <Text style={styles.normal}>
                Status: {item.status}
              </Text>
              <Text style={styles.normal}>
                Category: {item.category}
              </Text>
              {item.notes &&
                <Text style={styles.normal}>
                  {item.notes}
                </Text>
              }
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}

export default Quote
