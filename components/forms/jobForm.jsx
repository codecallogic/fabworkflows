import { useState, useEffect, useRef } from 'react'
import SVG from '../../files/svgs'
import Calendar from 'react-calendar'
import Table from '../tableAltForm'
import 'react-calendar/dist/Calendar.css';
import { PDFViewer } from '@react-pdf/renderer';
import JobIssues from '../../components/pdf/jobIssues'

//// HELPERS
import { manageFormFields } from '../../helpers/forms'
import { 
  quoteSort, 
  activitySort,
  purchaseOrderSort,
  jobIssueSort,
} from '../../helpers/sorts'
import { 
  validateDate, 
  formatDate, 
  generateRandomNumber, 
  returnIfTrue, 
  checkObjectValues, 
  validateNumber,
  multipleFiles
} from '../../helpers/validations'
import { returnSelectedData } from '../../helpers/modals';

const JobForm = ({
  token,
  title,
  dynamicSVG,
  setDynamicSVG,
  modal,
  setModal,
  message, 
  setMessage,
  loading,
  setLoading,
  edit,
  setEdit,
  setModalEdit,
  controls,
  setControls,
  resetCheckboxes,
  selectID,
  setSelectID,

  //// DATA
  typeOfData,
  componentData,
  allData,
  setAllData,
  originalData,
  editData,
  extractingStateData,
  
  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  setDynamicType,
  setDynamicKey,
  addImages,

  ///// CRUD
  submitCreate,
  submitUpdate,
  submitDeleteFile
}) => {

  const createType                  = 'CREATE_JOB'
  const resetType                   = 'RESET_JOB'
  const resetTypeContact            = 'RESET_CONTACT'
  const filesType                   = 'ADD_ARRAY_WITH_ITEMS'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('black')
  const [input_dropdown, setInputDropdown] = useState('')
  const [save, setSave] = useState(false)
  const [activityHeaders, setActivityHeaders] = useState([])
  const [purchaseOrderHeaders, setPurchaseOrderHeaders] = useState([])
  const [jobIssueHeaders, setJobIssueHeaders] = useState([])
  
  useEffect(() => {
    
    const isEmpty = Object.values(stateData).every( x => x === '' || x.length < 1 || x === '0.00')
    
    if(!isEmpty) return (setMessage(''), setSave(true))
    if(isEmpty) return setSave(false)

  }, [stateData])

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

  useEffect(() => {
    
    !stateData.invoice ? stateMethod(createType, 'invoice', generateRandomNumber()) : null
    
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])

  useEffect(() => {
    let objectActivities = new Object()
    Object.values(activitySort).forEach( (item) => { objectActivities[item] = item })
    setActivityHeaders((oldArray) => [...oldArray, objectActivities])

    let objectPurchaseOrders = new Object()
    Object.values(purchaseOrderSort).forEach( (item) => { objectPurchaseOrders[item] = item})
    setPurchaseOrderHeaders((oldArray) => [...oldArray, objectPurchaseOrders])

    let objectJobIssues = new Object()
    Object.values(jobIssueSort).forEach( (item) => { objectJobIssues[item] = item})
    setJobIssueHeaders((oldArray) => [...oldArray, objectJobIssues])

  }, [])
  
  return (
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">
          {edit == typeOfData ? 'Edit Job' : title}
        </div>
        {save &&
          <div className="table-header-controls">
            { edit == typeOfData ? 
              <div
              className="table-header-controls-item-svg"
              >
                <SVG svg={'send'}></SVG>
              </div>
              :
              null
            }
            <div 
            id="save" 
            className="table-header-controls-item" 
            onClick={(e) => edit == typeOfData ? 
              stateData.payment == 'deposit' || stateData.payment == 'complete'
              ?
              setMessage('Cannot update quotes with payments processed')
              :
              submitUpdate(e, stateData, 'jobs', 'files', setMessage, 'update_job', setLoading, token, 'jobs/update-job', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'jobs')
              : 
              submitCreate(e, stateData, 'jobs', 'files', setMessage, 'create_job', setLoading, token, 'jobs/create-job', resetType, resetState, allData, setAllData, setDynamicSVG)  
            }
            >
              { loading == 'create_job' || loading == 'update_job' ? 
              <div className="loading">
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
              </div>
              : 
                edit == typeOfData ? 'Update' : 'Save'
              }
            </div>
            <div 
            id="reset" 
            className="table-header-controls-item" 
            onClick={() => (setLoading(''), resetState(resetType), setMessage(''), setEdit(''))}
            >
              Reset
            </div>
          </div>
        }
        { message && 
          <div className="table-header-error">
            <SVG svg={dynamicSVG}></SVG> 
            <span>{message.substr(0, 200)}</span>
          </div>
        }
      </div>
      <form className="table-forms" onSubmit={null}>
      




      <div className="form-box" style={{width: '49%'}}>
        <div className="form-box-heading">Job Info
          <div 
            className="form-box-heading-item" 
            onClick={() => (
              setModal('moveJob')
            )}
          >
            <SVG svg={'move-file'}></SVG>
          </div>
        </div>
        <div className="form-box-container">
          <div className="form-group">
            <input 
            id="name" 
            value={stateData.name} 
            onChange={(e) => (stateMethod(createType, 'name', e.target.value))}/>
            
            <label 
            className={`input-label ` + (
              stateData.name.length > 0 || 
              typeof stateData.name == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="name">
              Name
            </label>
          </div>
          <div className="form-group">
            <input
            onClick={() => setInputDropdown('job_account')} 
            value={manageFormFields(stateData.account, 'name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'account', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.account.length > 0 || 
              typeof stateData.account == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="account">
              Account
            </label>
            <div 
            onClick={() => setInputDropdown('job_account')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'job_account' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {originalData && originalData.accounts.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div 
                key={idx} 
                className="form-group-list-item" 
                onClick={(e) => (stateMethod(createType, 'account', item), setInputDropdown(''))}>
                  {item.name}
                </div>
                ))}
              </div>
            }
          </div>
          <div className="form-group">
            <input 
            id="date" 
            value={stateData.date} 
            onChange={(e) => validateDate(e, 'date', createType, stateMethod)}/>
            <label 
            className={`input-label ` + (
              stateData.date.length > 0 || 
              typeof stateData.date == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="date">
              Date
            </label>
            <div onClick={() => input_dropdown == 'calendar' ? setInputDropdown('') : setInputDropdown('calendar')}>
              <SVG svg={'calendar'}></SVG>
            </div>
            { input_dropdown == 'calendar' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                <Calendar
                  onClickDay={(date) => 
                    stateMethod(createType, 'date', formatDate(date),
                    setInputDropdown('')
                  )}
                  
                  minDate={new Date(Date.now())}
                />
              </div>
            }
          </div>
          <div className="form-group">
            <input 
            id="salesperson" 
            value={stateData.salesperson} 
            onChange={(e) => (stateMethod(createType, 'salesperson', e.target.value))}/>
            
            <label 
            className={`input-label ` + (
              stateData.salesperson.length > 0 || 
              typeof stateData.salesperson == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="salesperson">
              Salesperson
            </label>
          </div>
          <div className="form-group">
            <input 
            id="invoice" 
            value={stateData.invoice} 
            onChange={(e) => (
              validateNumber('invoice'),
              stateMethod(createType, 'invoice', e.target.value)
            )}
            />
            
            <label 
            className={`input-label ` + (
              stateData.invoice !== '' || 
              typeof stateData.invoice == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="invoice">
              Invoice Number
            </label>
          </div>
          <div className="form-group-textarea">
            <label 
            className={stateData.notes.length > 0 ? ' labelHover' : ''}>
              Notes
            </label>
            <textarea 
              id="notes" 
              rows="5" 
              wrap="hard" 
              maxLength="400"
              name="notes" 
              value={stateData.notes} 
              onChange={(e) => stateMethod(createType, 'notes', e.target.value)} 
            />
          </div>
        </div>
      </div>




      <div className="form-box" style={{width: '49%'}}>
        <div className="form-box-heading">Job Address
          <div 
            className="form-box-heading-item" 
            onClick={() => (
              setModal('new_contact'),
              setDynamicType('CREATE_JOB'),
              setDynamicKey('jobAddress'),
              resetState(resetTypeContact)
            )}
          >
            <SVG svg={'location'}></SVG>
          </div>
          <div 
            className="form-box-heading-item" 
            onClick={() => (
              stateMethod(createType, 'jobAddress', '')
            )}
          >
            <SVG svg={'thrash-can'}></SVG>
          </div>
        </div>
        <div className="form-box-container">
          <div className="form-group-textarea">
            <label 
            className={'labelHover'}>
              Job Address
            </label>
            <textarea 
              id="jobAddress" 
              rows="9" 
              wrap="hard" 
              maxLength="400"
              name="jobAddress" 
              value={ checkObjectValues(stateData.jobAddress)
                ? 
`${returnIfTrue(stateData.jobAddress.contact_name)} 
${returnIfTrue(stateData.jobAddress.address)}
${returnIfTrue(stateData.jobAddress.city)} ${returnIfTrue(stateData.jobAddress.state)} ${returnIfTrue(stateData.jobAddress.zip_code)}
${returnIfTrue(stateData.jobAddress.country)}
${returnIfTrue(stateData.jobAddress.phone)}
${returnIfTrue(stateData.jobAddress.cell)}
${returnIfTrue(stateData.jobAddress.fax)}
${returnIfTrue(stateData.jobAddress.email)}
${returnIfTrue(stateData.jobAddress.contact_notes)}
`               :
                `(Same as account address)`
              } 
              readOnly
            />
          </div>
        </div>



        <div className="form-box-heading">Account Address
          <div 
            className="form-box-heading-item" 
            onClick={() => (
              setModal('new_contact'),
              setDynamicType('CREATE_JOB'),
              setDynamicKey('accountAddress'),
              resetState(resetTypeContact)
            )}
          >
            <SVG svg={'location'}></SVG>
          </div>
          <div 
            className="form-box-heading-item" 
            onClick={() => (
              stateMethod(createType, 'accountAddress', '')
            )}
          >
            <SVG svg={'thrash-can'}></SVG>
          </div>
        </div>
        <div className="form-box-container">
          <div className="form-group-textarea">
            <label 
            className={stateData.accountAddress !== 0 ? ' labelHover' : ''}>
              Account Address
            </label>
            <textarea 
              id="accountAddress" 
              rows="9" 
              wrap="hard" 
              maxLength="400"
              name="accountAddress" 
              value={  
`${returnIfTrue(stateData.accountAddress.contact_name)} 
${returnIfTrue(stateData.accountAddress.address)}
${returnIfTrue(stateData.accountAddress.city)} ${returnIfTrue(stateData.accountAddress.state)} ${returnIfTrue(stateData.accountAddress.zip_code)}
${returnIfTrue(stateData.accountAddress.country)}
${returnIfTrue(stateData.accountAddress.phone)}
${returnIfTrue(stateData.accountAddress.cell)}
${returnIfTrue(stateData.accountAddress.fax)}
${returnIfTrue(stateData.accountAddress.email)}
${returnIfTrue(stateData.accountAddress.contact_notes)}
`               
              } 
              readOnly
            />
          </div>
        </div>
      </div>
      
      <Table
          token={token}
          title={'Quotes'}
          typeOfData={'quotes'}
          componentData={componentData}
          allData={stateData.quotes}
          setAllData={setAllData}
          modal={modal}
          setModal={setModal}
          sortOrder={quoteSort}
          controls={controls}
          setControls={setControls}
          controlsType={'quoteControls'}
          message={message}
          setMessage={setMessage}
          resetCheckboxes={resetCheckboxes}
          editData={editData}
          changeView={changeView}
          setEdit={setEdit}
          viewType={'quotes'}
          modalType={'quote'}
          loading={loading}
          setLoading={setLoading}
          dynamicSVG={dynamicSVG}
          setDynamicSVG={setDynamicSVG}
          setDynamicType={setDynamicType}
          setDynamicKey={setDynamicKey}
          selectID={selectID}
          setSelectID={setSelectID}
          extractingStateData={extractingStateData}
          dynamicType={'CREATE_JOB_ARRAY_ITEM'}
          dynamicKey={'quotes'}
        >
      </Table> 

      <Table
          token={token}
          title={'Activities'}
          typeOfData={'activities'}
          componentData={activityHeaders}
          allData={stateData.activities}
          setAllData={setAllData}
          modal={modal}
          setModal={setModal}
          sortOrder={activitySort}
          controls={controls}
          setControls={setControls}
          controlsType={'activityControls'}
          message={message}
          setMessage={setMessage}
          resetCheckboxes={resetCheckboxes}
          editData={editData}
          changeView={changeView}
          setEdit={setEdit}
          viewType={'activities'}
          modalType={'activityList'}
          loading={loading}
          setLoading={setLoading}
          dynamicSVG={dynamicSVG}
          setDynamicSVG={setDynamicSVG}
          setDynamicType={setDynamicType}
          setDynamicKey={setDynamicKey}
          selectID={selectID}
          setSelectID={setSelectID}
          extractingStateData={extractingStateData}
          dynamicType={'CREATE_JOB_ARRAY_ITEM'}
          dynamicKey={'activities'}
          completeControl={true}
          cancelControl={true}
          stateMethod={stateMethod}
        >
      </Table>

      <Table
        token={token}
        title={'Purchase Orders'}
        typeOfData={'purchaseOrders'}
        componentData={purchaseOrderHeaders}
        allData={stateData.purchaseOrders}
        setAllData={setAllData}
        modal={modal}
        setModal={setModal}
        sortOrder={purchaseOrderSort}
        controls={controls}
        setControls={setControls}
        controlsType={'purchaseOrderControls'}
        message={message}
        setMessage={setMessage}
        resetCheckboxes={resetCheckboxes}
        editData={editData}
        changeView={changeView}
        setEdit={setEdit}
        viewType={'purchaseOrders'}
        modalType={'purchaseList'}
        loading={loading}
        setLoading={setLoading}
        dynamicSVG={dynamicSVG}
        setDynamicSVG={setDynamicSVG}
        setDynamicType={setDynamicType}
        setDynamicKey={setDynamicKey}
        selectID={selectID}
        setSelectID={setSelectID}
        extractingStateData={extractingStateData}
        dynamicType={'CREATE_JOB_ARRAY_ITEM'}
        dynamicKey={'purchaseOrders'}
        completeControl={false}
        cancelControl={false}
        stateMethod={stateMethod}
      >
      </Table>

      <Table
        token={token}
        title={'Job Issues'}
        typeOfData={'jobIssues'}
        componentData={jobIssueHeaders}
        allData={stateData.jobIssues}
        setAllData={setAllData}
        modal={modal}
        setModal={setModal}
        sortOrder={jobIssueSort}
        controls={controls}
        setControls={setControls}
        controlsType={'jobIssueControls'}
        message={message}
        setMessage={setMessage}
        resetCheckboxes={resetCheckboxes}
        editData={editData}
        changeView={changeView}
        setEdit={setEdit}
        viewType={'jobIssues'}
        modalType={'jobIssue'}
        loading={loading}
        setLoading={setLoading}
        dynamicSVG={dynamicSVG}
        setDynamicSVG={setDynamicSVG}
        setDynamicType={setDynamicType}
        setDynamicKey={setDynamicKey}
        selectID={selectID}
        setSelectID={setSelectID}
        extractingStateData={extractingStateData}
        dynamicType={'CREATE_JOB_ARRAY_ITEM'}
        dynamicKey={'jobIssues'}
        completeControl={false}
        cancelControl={false}
        stateMethod={stateMethod}
        stateData={stateData}
      >
      </Table>

      <div className="form-box" style={{width: '100%', padding: '0 2rem'}}>
          <div className="form-box-heading">
            <label htmlFor="imageFiles" className="form-box-heading-item">
              <SVG svg={'upload'}></SVG> Upload Files
              <input 
              id="imageFiles" 
              type="file" 
              accept="*" 
              multiple
              onChange={(e) => multipleFiles(e, stateData, 'files', setMessage, filesType, 'files', addImages)}
              />
            </label>
          </div>
          <div className="form-box-container">
            <div className="form-group-gallery">
              { stateData.files.length == 0 &&
                 <a 
                 className="form-group-gallery-link"
                 target="_blank" 
                 rel="noreferrer"
                 style={{width: '25%'}}
                 >
                   <img 
                   className="form-group-gallery-image"
                   src='https://via.placeholder.com/300'
                   />
                 </a>
              }
              {stateData.files.length > 0 && stateData.files.map((item, idx) => (
                <a 
                  key={idx} 
                  onClick={() => window.open(item.location, '_blank')}
                  className="form-group-gallery-link"
                  target="_blank" 
                  rel="noreferrer"
                  style={{width: '25%'}}
                >
                  <img 
                    className="form-group-gallery-image"
                    src="https://static.thenounproject.com/png/47347-200.png"
                  />
                  <span onClick={(e) => (e.stopPropagation(), loading !== 'delete_file' ? 
                    submitDeleteFile(e, item, 'files', createType, stateMethod, stateData, 'jobs', setMessage, 'delete_file', setLoading, token, 'jobs/delete-file', allData, setAllData, setDynamicSVG, editData, null, stateData._id) 
                    : null)
                  }>
                  { loading == 'delete_file' ? 
                    <div className="loading-spinner"></div>
                    :
                    <SVG svg={'close'}></SVG>
                  }
                  </span>
                  {item.name ? item.name : item.location.substring(50, 70)}
                </a>
              ))}
            </div>
          </div>
        </div> 
      
      </form>
    </div>
  )
}

export default JobForm
