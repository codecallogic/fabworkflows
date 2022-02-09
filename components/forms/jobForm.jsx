import { useState, useEffect, useRef } from 'react'
import SVG from '../../files/svgs'
import Calendar from 'react-calendar'
import Table from '../tableAltForm'


//// HELPERS
import { manageFormFields } from '../../helpers/forms'
import { quoteSort } from '../../helpers/sorts'
import { 
  validateDate, 
  formatDate, 
  generateInvoiceNumber, 
  returnIfTrue, 
  checkObjectValues, 
  validateNumber
} from '../../helpers/validations'

const QuoteForm = ({
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

  ///// CRUD
  submitCreate,
  submitUpdate
}) => {

  const createType                  = 'CREATE_JOB'
  const resetType                   = 'RESET_JOB'
  const resetTypeContact            = 'RESET_CONTACT'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('black')
  const [input_dropdown, setInputDropdown] = useState('')
  const [save, setSave] = useState(false)

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
    stateMethod(createType, 'invoice', generateInvoiceNumber())
    
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])
  
  return (
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">
          {edit == typeOfData ? 'Edit Quote' : title}
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
              submitUpdate(e, stateData, 'jobs', setMessage, 'update_quote', setLoading, token, 'jobs/update-job', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'jobs')
              : 
              submitCreate(e, stateData, 'jobs', setMessage, 'create_job', setLoading, token, 'jobs/create-job', resetType, resetState, allData, setAllData, setDynamicSVG)  
            }
            >
              { loading == 'create_job' ? 
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
          deleteType="REMOVE_JOB_QUOTE"
          setDynamicType={setDynamicType}
          setDynamicKey={setDynamicKey}
          selectID={selectID}
          setSelectID={setSelectID}
          extractingStateData={extractingStateData}
        >
      </Table>  
      
      </form>
    </div>
  )
}

export default QuoteForm
