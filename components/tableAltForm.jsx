import { filterTable } from '../helpers/tableData'
import SVG from '../files/svgs'
import { useEffect, useState, useRef } from 'react'
import { BlobProvider } from '@react-pdf/renderer';
import { validatePDFContent } from '../helpers/validations'
import { returnSelectedData } from '../helpers/modals';
import JobIssuesPDF from '../components/pdf/jobIssues'

const Table = ({
  token,
  title,
  typeOfData,
  selectID,
  setSelectID,
  controls,
  setControls,
  controlsType,
  setModal,
  message,
  setMessage,
  sortOrder,
  resetCheckboxes,
  setEdit,
  loading,
  setLoading,
  dynamicSVG,
  setDynamicSVG,
  setAllData,
  searchType,

  ///// EDIT
  viewType,
  modalType,
  editDataType,
  editModalType,
  dynamicType,
  dynamicKey,
  completeControl,
  cancelControl,
  stateMethod,

  //// DATA
  componentData,
  allData,
  editData,
  stateData,

  //// REDUX
  changeView,
  setDynamicType,
  setDynamicKey,
  extractingStateData,

  //// CRUD
  submitDeleteRow,

}) => {
  
  const matchPattern = /https?:\/\/(www\.)?/gi;
  const myRefs = useRef([])
  const [loadingColor, setLoadingColor] = useState('black')
  const [up, setUp] = useState(1)
  const [down, setDown] = useState(-1)
  const [filter, setFilter] = useState('')
  const [currentItem, setCurrentItem] = useState('')

  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(event.target.id == 'checkbox') return
          if(item.contains(event.target)) return
          if(event.target.getAttribute('id') == 'delete') return resetCheckboxes()
          if(event.target == document.getElementById('plus')) return
          if(event.target == document.getElementById('delete')) return resetCheckboxes()
          if(event.target == document.getElementById('edit')) return
          if(event.target == document.getElementById('complete')) return
          if(event.target == document.getElementById('cancel')) return
          if(event.target.nodeName == 'svg') return
          if(event.target.nodeName == 'path') return
          
          resetCheckboxes()
          setSelectID('')
          setControls('')
        }
      })
    }
  }

  useEffect(() => {     
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };

  }, [selectID])

  const handleSelect = (e, id) => {
    const els = document.querySelectorAll('.table-rows-checkbox-input')
    els.forEach( (el) => { el.checked = false })

    e.target.checked = true
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    setControls(controlsType)
    setSelectID(id)
  }
  
  const handleEdit = (id) => {
    if(controls == 'jobIssueControls'){
      setModal('jobIssue')
      editData('jobIssues', 'CREATE_JOB_ISSUE', id, allData)
    }

  }
  
  return (
    <div className="table">
      <div className="table-header color-grey-light-scheme-2">
        <div className="table-header-title color-grey-light-scheme-2">{title}</div> 
          <div className="table-header-controls">
            <div 
            id="plus" 
            className="table-header-controls-item-svg" 
            onClick={() => (
                setSelectID(''),
                setDynamicType(dynamicType),
                setDynamicKey(dynamicKey),
                setControls(''), 
                setMessage(''),
                setModal(modalType),
                resetCheckboxes()
              )}
            >
              <SVG svg={'plus'}></SVG>
            </div>
            {controls == controlsType && 
              <>
              <div 
                id="delete" 
                className="table-header-controls-item-svg" 
                onClick={(e) => (
                  extractingStateData(currentItem)
                )}>
                <SVG onClick={() => {extractingStateData(currentItem)}} svg={'thrash-can'} id={'delete'}></SVG>
              </div>

              {completeControl && controls == 'activityControls' &&
                <div 
                  id="complete" 
                  className="table-header-controls-item" 
                  onClick={() => (
                    stateMethod('COMPLETE_ACTIVITY_STATUS', 'activities', currentItem),
                    setControls(''), 
                    resetCheckboxes()
                  )}
                >
                  Complete
                </div>
              }

              {cancelControl && controls == 'activityControls' &&
                <div 
                  id="cancel" 
                  className="table-header-controls-item" 
                  onClick={() => (
                    stateMethod('CANCEL_ACTIVITY_STATUS', 'activities', currentItem),
                    setControls(''), 
                    resetCheckboxes()
                  )}
                >
                  Cancel
                </div>
              }

              {controls == 'jobIssueControls' &&
                returnSelectedData(stateData, 'jobIssues', selectID) ? 
                <BlobProvider 
                  document={<JobIssuesPDF 
                  stateData={stateData}
                  jobIssues={returnSelectedData(stateData, 'jobIssues', selectID)}
                />}
                  >
                    {({ blob, url, loading, error }) =>
                      <div  
                        id="complete" 
                        className="table-header-controls-item-svg" 
                        onClick={() => (
                        validatePDFContent(
                          'viewJobIssues', 
                          'pdfJobIssues', 
                          returnSelectedData(stateData, 'jobIssues', selectID),
                          url, 
                          setDynamicSVG, 
                          setMessage,
                          selectID
                        )
                      )}>
                        <SVG svg={'print'} id={'complete'}></SVG>
                      </div>
                    }
                </BlobProvider>
                : 
                null
              } 
              
              {controls == 'jobIssueControls' &&
                <div
                  id="edit" 
                  className="table-header-controls-item" 
                  onClick={() => {
                    handleEdit(selectID),
                    setControls(''), 
                    resetCheckboxes()
                  }}
                >
                  Edit
                </div>
              }
              </>
            }
          </div>
        { message && 
          <div className="table-header-error">
            <SVG svg={dynamicSVG}></SVG> 
            <span>{message.substr(0, 200)}</span>
          </div>
        }
      </div>
      <div className="table-headers">
        <div className="table-headers-item">&nbsp;</div>
        { 
          filterTable(componentData).length > 0 && 
          filterTable(componentData, ['_id', 'createdAt', 'updatedAt', '__v'], 1).map((item, idx, array) => 
            Object.keys(array[0]).sort((a, b) => sortOrder.indexOf(b) - sortOrder.indexOf(a)).map((key, idx) => 
              <div key={idx} className="table-headers-item">
                <span onClick={() => filter == key 
                  ? 
                  (setUp(up == 1 ? -1 : 1), setDown(down == -1 ? 1 : -1))
                  : 
                  setFilter(key)}
                >
                  {(key.replace( /([a-z])([A-Z])/g, "$1 $2")).replaceAll('_', ' ')}
                  <SVG svg={'sort'}></SVG>
                </span>
              </div>
            )
          )
        }
      </div>
      <div id="tableContainer" className="table-rows-container" style={{ overflowX: loading == 'searching' ? 'hidden' : ''}}>
      {loading == searchType ? 
        <div className="search-loading">
          <div className="search-loading-box">
            <svg><circle cx="20" cy="20" r="20"></circle></svg><span>Loading items</span>
          </div>
        </div>
        : null
      }
      { 
        filterTable(allData).length > 0 && 
        filterTable(allData, ['createdAt', 'updatedAt', '__v']).map((item, idx) => 
          <div 
          key={idx} 
          className={`table-rows ` + (idx % 2 == 1 ? ' row-odd' : ' row-even')}
          >
            <div className="table-rows-checkbox" 
              ref={(el) => (myRefs.current[idx] = el)}
            >
              <label htmlFor={`checkbox`}>
                <input 
                id={`checkbox`} 
                className="table-rows-checkbox-input" 
                type="checkbox" 
                onClick={(e) => e.target.checked == true ?  
                  (
                  setMessage(''),
                  setDynamicType(dynamicType),
                  setDynamicKey(dynamicKey),
                  handleSelect(e, item._id ? item._id : item.id ? item.id : idx), 
                  setCurrentItem(item)
                  ) 
                  : (
                    setControls(''), 
                    setSelectID(''), 
                    setMessage(''))
                }/>
                <span></span>
                <div>
                  <SVG svg={'checkmark'}></SVG>
                </div>
              </label>
            </div>
            {Object.keys(item).sort((a, b) => sortOrder.indexOf(b) - sortOrder.indexOf(a)).map((key, idx, array) => 
              key !== '_id' && 
              <div key={idx} className="table-rows-item">
                { 
                  Array.isArray(item[key]) && item[key].length > 0 && matchPattern.test(item[key][0].location)
                  ? 
                  <img 
                    src={`${item[key][0].location}`}
                    onError={(e) => e.target.src = "https://static.thenounproject.com/png/47347-200.png"}
                  />
                  : null
                }
                {
                  Array.isArray(item[key]) && item[key].length > 0 
                  ? 
                    item[key][0].name
                    ?
                    item[key][0].name
                    :
                    item[key][0].firstName
                    ?
                    item[key][0].firstName
                    :
                    item[key][0].quote_name
                  : null
                }
                {
                  !Array.isArray(item[key]) && item[key].length > 0 && (item[key].match(/^data:image\/(png|jpg|jpeg);base64,/gmi) !== null)
                  ? 
                 
                  <img src={item[key]}></img> 
                  : null
                }
                {
                  !Array.isArray(item[key]) && key !== 'qr_code'
                  ? 
                  (
                   
                    key == 'dependency' && typeof item[key] == 'object' 
                    ? 
                    <span style={{ fontWeight: '600'}}>{item[key].days} days {item[key].schedule} {item[key].activity}</span> 
                    : 

                    key == 'color' 
                    
                    ?
                    
                    (
                    <div><span className="table-rows-item-color" style={{backgroundColor: item[key]}}></span>{item[key]}</div>
                    )
                    :
                    key == 'account' && typeof item[key] == 'object'
                    ?
                    item[key].name
                    :
                    item[key] 
                  )
                  :
                   
                  null
                }
              </div>
            )}
          </div>
        )
      }
      </div>
    </div>
  )
}

export default Table
