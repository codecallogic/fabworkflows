import { useState, useEffect, useRef } from 'react'
import { manageFormFields } from '../../helpers/forms'
import { 
  validateDate,
  formatDate,
  validateNumber
} from '../../helpers/validations'
import SVG from '../../files/svgs'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { API } from '../../config'
const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false })
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false, loading: () => <p>Loading ...</p>})

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
    ['link', 'image', 'video'],
    ['clean']
  ]
}

const ContractForm = ({
  token,
  title,
  dynamicSVG,
  setDynamicSVG,
  setModal,
  message, 
  setMessage,
  loading,
  setLoading,
  edit,
  setEdit,
  setModalEdit,

  //// DATA
  typeOfData,
  allData,
  setAllData,
  originalData,
  editData,
  
  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,

  ///// CRUD
  submitCreate,
  submitUpdate
}) => {
  
  const createType            = 'CREATE_CONTRACT'
  const resetType             = 'RESET_CONTRACT'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('black')
  const [input_dropdown, setInputDropdown] = useState('')
  const [save, setSave] = useState(false)

  useEffect(() => {

    const isEmpty = Object.values(stateData).every( x => x === '' || x === 'active')
    
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
    
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };

  }, [])

  const convertToPDF = async () => {
    const html = await import('html2pdf.js')
   
    let element = document.getElementById('pdf')
    let opt = {
      margin: 1,
      filename: 'contract.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    }
    html.default().set(opt).from(element).save()
  }

  const sendMessage = async (loadingType) => {
    if(!stateData.email) return (setDynamicSVG('notification'), setMessage('Email is required'))
    if(!stateData.subject) return (setDynamicSVG('notification'), setMessage('Subject is required'))
    if(!stateData.message) return (setDynamicSVG('notification'), setMessage('Message is required'))
    setLoading(loadingType)
    
    try {
      
      const response = await axios.post(`${API}/contracts/send-message`, stateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          contentType: 'multipart/form-data'
        }
      })

      setLoading('')
      setDynamicSVG('checkmark')
      setMessage(response.data)
      
    } catch (error) {
      console.log(error)
      if(error)  error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with creating item'))
      
    }
  }
  
  return (
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">
          {edit == typeOfData ? 'Edit Contract' : title}
        </div>
        {save && 
        <div className="table-header-controls">
          {!stateData.signed && 
            <div 
              id="save" 
              className="table-header-controls-item" 
              onClick={(e) => edit == typeOfData ? 
                submitUpdate(e, stateData, 'contracts', 'files', setMessage, 'create_contract', setLoading, token, 'contracts/update-contract', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'contracts', null)
                : 
                submitCreate(e, stateData, 'contracts', 'files', setMessage, 'create_contract', setLoading, token, 'contracts/create-contract', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'contracts')  
              }
              >
              {loading == 'create_contract' ? 
              <div className="loading">
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
              </div>
              : 
                edit == typeOfData ? 'Update' : 'Save'
              }
            </div>
          }
          
          {!stateData.signed && 
            <div 
            id="reset" 
            className="table-header-controls-item" 
            onClick={() => (setLoading(''), resetState(resetType), setMessage(''), setEdit(''))}
            >
              Reset
            </div>
          }

          {stateData.signed && 
            <div 
            id="reset" 
            className="table-header-controls-item" 
            onClick={() => convertToPDF()}
            >
              Print Contract
            </div>
          }

          {edit == typeOfData && 
          <div
            className="table-header-controls-item-svg"
            onClick={() => sendMessage('send_message')}
          >
            { loading == 'send_message' ? 
              <span><div className="loading-spinner"></div></span>
              :
              <span><SVG svg={'send'}></SVG></span>
            }
          </div>
          }

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
          <div className="form-box-heading">Details</div>
          <div className="form-box-container">
            <div className="form-group">
              <input
                onClick={() => setInputDropdown('contract_job')} 
                value={manageFormFields(stateData.job, 'name')} 
                onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'job', e.target.value))}
                readOnly
              />
              <label 
              className={`input-label ` + (
                stateData.job.length > 0 || 
                typeof stateData.job == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="job">
                Job
              </label>
              <div 
              onClick={() => setInputDropdown('contract_job')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'contract_job' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.jobs.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                  <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'job', item), setInputDropdown(''))}>
                    {item.name}
                  </div>
                  ))}
                </div>
              }
            </div>

            <div className="form-group">
              <input 
              id="name" 
              value={stateData.name} 
              onChange={(e) => (stateMethod(createType, 'name', e.target.value))}
              />
              <label 
                className={`input-label ` + (
                stateData.name
                ? ' labelHover' 
                : ''
              )}
              htmlFor="name">
                Name
              </label>
            </div>

            <div className="form-group">
              <input
              onClick={() => setInputDropdown('contract_status')} 
              value={stateData.status} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'status', e.target.value))}
              readOnly
              />
              <label 
              className={`input-label ` + (
                stateData.status.length > 0 || 
                typeof stateData.status == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="status">
                Status
              </label>
              <div 
              onClick={() => setInputDropdown('contract_status')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'contract_status' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'status', 'active'), setInputDropdown(''))}>
                    Active
                  </div>
                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'status', 'inactive'), setInputDropdown(''))}>
                    Inactive
                  </div>
                </div>
              }
            </div>

            <div className="form-group-textarea">
              <label 
              className={stateData.description.length > 0 ? ' labelHover' : ''}>
                Description
              </label>
              <textarea 
                id="description" 
                rows="5" 
                wrap="hard" 
                maxLength="400"
                name="description" 
                value={stateData.description} 
                onChange={(e) => stateMethod(createType, 'description', e.target.value)} 
              />
            </div>

            
          </div>
          
        </div> 

        <div className="form-box" style={{width: '49%'}}>
          <div className="form-box-heading">Customer</div>
          <div className="form-box-container">

            <div className="form-group">
              <input 
              id="email" 
              value={stateData.email} 
              onChange={(e) => (stateMethod(createType, 'email', e.target.value))}
              />
              <label 
                className={`input-label ` + (
                stateData.email
                ? ' labelHover' 
                : ''
              )}
              htmlFor="email">
                Email
              </label>
            </div>

            <div className="form-group">
              <input 
              id="subject" 
              value={stateData.subject} 
              onChange={(e) => (stateMethod(createType, 'subject', e.target.value))}
              />
              <label 
                className={`input-label ` + (
                stateData.subject
                ? ' labelHover' 
                : ''
              )}
              htmlFor="subject">
                Subject
              </label>
            </div>

            <div className="form-group-textarea">
              <label 
              className={stateData.message.length > 0 ? ' labelHover' : ''}>
                Message
              </label>
              <textarea 
                id="message" 
                rows="5" 
                wrap="hard" 
                maxLength="2000"
                name="message" 
                value={stateData.message} 
                onChange={(e) => stateMethod(createType, 'message', e.target.value)} 
              />
            </div>
            
          </div>
        </div>
        
        <div className="form-box" style={{width: '100%'}}>
          <div className="form-box-heading">Contract</div>
          <div className="form-box-container">
            <div className="form-group-quill">
              <ReactQuill 
                placeholder="Write something..."
                className="form-group-quill-editor"
                theme="snow"
                name="contract"
                onChange={(e) => stateMethod(createType, 'contract', e)}
                value={stateData.contract}
                modules={modules}
                required
              />
            </div>
                
            
            {stateData.contract && stateData.signed == false &&
            <div id="pdf" className="pdf">
              <div className="pdf-container">
                <div dangerouslySetInnerHTML={{ __html: stateData.contract ? stateData.contract : ''}}>
                </div>
              </div>
            </div> 
            }

            {stateData.contract && stateData.signed == true &&
            <div id="element">
              <div id="pdf" className="pdf">
                <div className="pdf-container">
                  <div dangerouslySetInnerHTML={{ __html: stateData.contract ? stateData.contract : ''}}>
                  </div>
                </div>
                <img src={stateData.image} alt={stateData.signatureFullName} />
                {stateData.dateSigned ? <h3>Date signed: {stateData.dateSigned}</h3> : null}
                {stateData.signatureFullName ? <h3>Signed By: {stateData.signatureFullName}</h3> : null}
              </div> 
            </div>
            } 
          </div>
        </div>
               
      </form>
      
    </div> 

  )
}

export default ContractForm
