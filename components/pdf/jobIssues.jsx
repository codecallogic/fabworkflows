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
                <Text style={styles.headingOne}>{stateData.jobIssues.length > 0 ? jobIssues.subject : ''}</Text>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.headingOneBold}>Category: </Text>
              </View>
              <View>
                <Text style={styles.headingOne}>{stateData.jobIssues.length > 0 ? jobIssues.category : ''}</Text>
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
                <Text style={styles.headingOne}>{stateData.jobIssues.length > 0 ? jobIssues.status : ''}</Text>
              </View>
            </View> 
          </View>
          <View style={{ width: '50%'}}>
            <View style={{ margin: 1}}>
              <Text style={styles.headingOne}>
                Last Update
              </Text>
              <Text style={styles.normal}>
                { stateData.jobIssues.length > 0
                  ? 
                  moment(jobIssues.history[jobIssues.history.length - 1].createdAt).format('MM/DD/YYYY HH:mm:ss')
                  : 
                  ''
                }
              </Text>
            </View>
            <View style={{ margin: 1}}>
              <Text style={styles.headingOne}>
                Last Update By
              </Text>
              <Text style={styles.normal}>
                { stateData.jobIssues.length > 0 
                  ?
                  `${jobIssues.history[jobIssues.history.length - 1].firstName} ${jobIssues.history[jobIssues.history.length - 1].lastName}`
                  :
                  ''
                }
              </Text>
            </View>
          </View>
        </View>
        {/* <View><Text><p class="ql-align-center"><strong>INDEPENDENT CONTRACTOR AGREEMENT</strong></p></Text></View>
        <View><Text><p class="ql-align-center"><strong>(Company)</strong></p><p class="ql-align-justify">&nbsp;</p></Text></View>
        <View><Text>
        <p class="ql-align-justify"> This Independent Contractor Agreement (“<strong><u>Agreement</u></strong>”) is entered into as of&nbsp;<span style="background-color: yellow;">_______________ __, _______,</span> by and between _________________________, with a principal place of business at _________________________________ (“<strong><u>Company</u></strong>”), and <span style="background-color: yellow;">____________,</span> a <span style="background-color: yellow;">____________ corporation</span>, with a principal place of business at <span style="background-color: yellow;">________________________________________</span> (“<strong><u>Contractor</u></strong>”).</p></Text></View>
        <View><Text><p class="ql-align-justify"> <strong>1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u>Services</u>.</strong></p>
        </Text></View>
        <View><Text><p class="ql-align-justify"> <strong>1.1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u>Nature of Services</u>.</strong>&nbsp;Contractor will perform the services, as more particularly described on Exhibit A, for Company as an independent contractor (the “<strong><u>Services</u></strong>”).&nbsp;The Services have been specially ordered and commissioned by Company.&nbsp;To the extent the Services include materials subject to copyright, Contractor agrees that the Services are done as “work made for hire” as that term is defined under U.S. copyright law, and that as a result, Company will own all copyrights in the Services. Contractor will perform such services in a diligent and workmanlike manner and in accordance with the schedule, if any, set forth in Exhibit A.&nbsp;The content, style, form and format of any work product of the Services shall be completely satisfactory to Company and shall be consistent with Company’s standards. Except as specified on Exhibit A, Company agrees that Contractor's services need not be rendered at any specific location and may be rendered at any location selected by Contractor.&nbsp;Contractor hereby grants Company the right, but not the obligation, to use and to license others the right to use Contractor's, and Contractor’s employees’, name, voice, signature, photograph, likeness and biographical information in connection with and related to the Services.</p>
        </Text></View>
        <View><Text>
        <p><br/>
        </p>
        </Text></View> */}
        <View style={styles.sectionThree}>
          <Text style={styles.headingOneBold}>
            History
          </Text>
          {stateData.jobIssues.length > 0 && jobIssues.history.map((item, idx) => 
            <View key={idx} style={styles.box}>
              <Text style={styles.headingOne}>
                {item.firstName ? item.firstName : ''} {item.createdAt ? `(${moment(item.createdAt).format('MM/DD/YYYY HH:mm:ss')})` : ''}
              </Text>
              <Text style={styles.normal}>
                Created
              </Text>
              <Text style={styles.normal}>
                Subject: {item.subject ? item.subject : ''}
              </Text>
              <Text style={styles.normal}>
                Status: {item.status ? item.status : ''}
              </Text>
              <Text style={styles.normal}>
                Category: {item.category ? item.category : ''}
              </Text>
              {item.notes 
                ?
                <Text style={styles.normal}>
                  {item.notes ? item.notes : ''}
                </Text>
                :
                null
              }
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}

export default Quote
