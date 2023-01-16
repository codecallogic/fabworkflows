import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { manageFormFields } from '../../helpers/forms'
import { jobIssueStatus, jobIssueCategory } from '../../helpers/lists'
import axios from 'axios'
import { API } from '../../config'
import moment from 'moment-timezone'
import { nanoid } from 'nanoid'
moment.tz(Date.now(), 'America/New_York')

const JobIssueModal = ({
  token,
  account,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  dynamicSVG,
  setDynamicSVG,
  setEvent,
  altEdit,
  nav,

  //// DATA
  allData,
  setAllData,
  editData,
  autoFill,
  selectID,
  typeOfData,
  setAltEdit,
  setUpdate,

  //// METHODS
  extractingStateData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  addImages,

  //// CRUD
  submitCreate,
  submitUpdate,
  submitDeleteFile
}) => {

  const createType      = 'CREATE_JOB_ISSUE'
  const resetType       = 'RESET_JOB_ISSUE'
  const arrayType       = 'CREATE_JOB_ISSUE_ARRAY_ITEM'
  const updateArrayType = 'UPDATE_JOB_ISSUE_ARRAY_ITEM_HISTORY'
  const addToJob        = 'UPDATE_JOB_ARRAY_ITEM'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('white')
  const [input_dropdown, setInputDropdown] = useState('')
  const [id, setID] = useState(selectID)

  //// HANDLE MODAL DRAG
  const [prevX, setPrevX] = useState(0)
  const [prevY, setPrevY] = useState(0)
  const onPointerDown = () => {}
  const onPointerUp = () => {}
  const onPointerMove = () => {}
  const [isDragging, setIsDragging] = useState(false)
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const handlePointerDown = (e) => {
    setPrevX(0)
    setPrevY(0)
    setIsDragging(true)
    onPointerDown(e)
  }

  const handlePointerUp = (e) => {
    setIsDragging(false)
    onPointerUp(e)
  }

  const handlePointerMove = (e) => {
    if (isDragging) handleDragMove(e);

    onPointerMove(e);
  };

  const handleDragMove = (e) => {
    var movementX = (prevX ? e.screenX - prevX : 0)
    var movementY = (prevY ? e.screenY - prevY : 0)
    
    setPrevX(e.screenX)
    setPrevY(e.screenY)

    handleModalMove(movementX, movementY)
  };

  const handleModalMove = (X, Y) => {
    setTranslate({
      x: translate.x + X,
      y: translate.y + Y
    });
  }


  // HANDLE DROPDOWNS
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

  useEffect(() => {
    if(!altEdit && stateData.subject && stateData.status && stateData.category && stateData.history.length === 0) logHistory(arrayType)
    if(!altEdit && stateData.subject && stateData.status && stateData.category && stateData.history.length === 1) logHistory(updateArrayType)
    if(altEdit == 'jobIssue' && stateData.subject && stateData.status && stateData.category) logHistory(updateArrayType)
  }, [stateData.subject, stateData.status, stateData.category])

  const readyState = () => {
    if(!stateData.subject) return setMessage('Subject is required')
    if(!stateData.status) return setMessage('Status is required')
    if(!stateData.category) return setMessage('Category is required')
  }

  const logHistory = (reducerType) => {

    let historyItems = autoFill.jobIssues.filter( (item) => item._id === id)
    
    let index

    if(historyItems[0] && historyItems[0].history.length === stateData.history.length){
      index = null
    } else {
      index = stateData.history[stateData.history.length - 1] ? stateData.history[stateData.history.length - 1].index ?  stateData.history[stateData.history.length - 1].index : null : null
    }

    let history           = new Object()
    history.id            = account._id
    history.firstName     = account.firstName
    history.lastName      = account.lastName
    history.subject       = stateData.subject
    history.status        = stateData.status
    history.category      = stateData.category
    history.notes         = stateData.notes
    history.index         = index ? index : nanoid()
    history.createdAt     = Date.now()

    stateMethod(reducerType, 'history', history)
  }

  return (
    <div 
      id='jobIssue'
      className="addFieldItems-modal" 
      data-value="parent" 
      onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}
    >
      <div 
      className="addFieldItems-modal-box" 
      onPointerDown={handlePointerDown} 
      onPointerUp={handlePointerUp} 
      onPointerMove={handlePointerMove} 
      style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
        <span 
          className="addFieldItems-modal-form-title">
            {altEdit == 'jobIssue' ? 
            'Edit Job Issue' 
            : 
            'New Job Issue'
            }
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
        </div>



        <form className="addFieldItems-modal-form">

          {/* <div className="form-group">
            <input 
            id="job" 
            value={manageFormFields(stateData.job, 'name')} 
            onChange={(e) => (stateMethod(createType, 'job', e.target.value))}
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
              Job Name
            </label>
          </div> */}

          <div className="form-group">
            <input 
            id="subject" 
            value={stateData.subject} 
            onChange={(e) => (stateMethod(createType, 'subject', e.target.value))}
            />
            <label 
            className={`input-label ` + (
              stateData.subject.length > 0 || 
              typeof stateData.subject == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="subject">
              Subject
            </label>
          </div>

          <div className="form-group">
            <input
            onClick={() => setInputDropdown('jobIssue-status')} 
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
            onClick={() => setInputDropdown('jobIssue-status')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'jobIssue-status' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {jobIssueStatus.length > 0 && jobIssueStatus.map((item, idx) => 
                  <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'status', item.status), setInputDropdown(''))}>
                      {item.status}
                  </div>
                )}
              </div>
            }
          </div>

          <div className="form-group">
            <input
            onClick={() => setInputDropdown('jobIssue-category')} 
            value={stateData.category} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'category', e.target.value))}
            />
            <label 
            className={`input-label ` + (
              stateData.category.length > 0 || 
              typeof stateData.category == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="category">
              Category
            </label>
            <div 
            onClick={() => setInputDropdown('jobIssue-category')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'jobIssue-category' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {jobIssueCategory.length > 0 && jobIssueCategory.map((item, idx) => 
                  <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'category', item.category), setInputDropdown(''))}>
                      {item.category}
                  </div>
                )}
              </div>
            }
          </div>

          {altEdit == 'jobIssue' && stateData.history.length > 0 &&
            <div className="form-group">
              <input 
              id="history" 
              value={manageFormFields(stateData.history[stateData.history.length - 1], 'firstName')} 
              onChange={(e) => (stateMethod(createType, 'history', e.target.value))}
              readOnly
              />
              <label 
              className={`input-label ` + (
                stateData.history.length > 0 || 
                typeof stateData.history == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="history">
                History
              </label>
            </div>
          }

          {altEdit == 'jobIssue' && stateData.history.length > 0 &&
          <div className="form-group-history">
            {stateData.history.length > 0 && stateData.history.map((item, idx) => 
              <div key={idx} className="form-group-history-item">
                <div className="form-group-history-item-details">
                  {item.firstName} ({moment(item.createdAt).format('MM/DD/YYYY HH:mm:ss')})
                    <span>Created</span>
                    <span>Subject: {item.subject}</span>
                    <span>Status: {item.status}</span>
                    <span>Category: {item.category}</span>
                    {item.notes ? <span>{item.notes}</span> : ''}
                </div>
              </div>
            )}
          </div>
          }

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

          {message && 
          <span className="form-group-message">
            <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
            {message}
          </span>
          }
      </form>


      <div className="addFieldItems-modal-box-footer">
        {!altEdit && 
        <button 
        className="form-group-button" 
        onClick={(e) => (
          readyState(),
          extractingStateData(stateData),
          resetState(resetType),
          nav.view == 'job' && stateData._id ? setUpdate('job') : null,
          edit == 'jobs' && nav.view == 'job' && !stateData._id 
          ? 
          (
            setUpdate('job')
          ) 
          : 
          null,
          setModal('')
        )}
        >
            {loading == 'create_job_issue' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Save'
            }
        </button>
        }
        {altEdit == 'jobIssueUnsaved' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (
          readyState(),
          extractingStateData(stateData),
          resetState(resetType),
          nav.view == 'job' && stateData._id ? setUpdate('job') : null,
          setModal('')
        )}
        >
           {loading == 'update_job_issue' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Update Unsaved'
          }
        </button>
        }
        {altEdit == 'jobIssue' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (
          stateMethod(addToJob, 'jobIssues', stateData),
          resetState(resetType),
          nav.view == 'job' ? setUpdate('job') : null,
          setModal('')
        )}
        >
           {loading == 'update_job_issue' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Update'
          }
        </button>
        }
      </div>
      
    </div>
    </div>
    
  )
}

export default JobIssueModal
