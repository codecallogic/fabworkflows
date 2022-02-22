import {filterTable} from '../helpers/tableData'
import SVG from '../files/svgs'
import {useEffect, useState, useRef} from 'react'
import { populateDependency, handleTableDropdowns } from '../helpers/modals'

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
  searchEnable,
  search,
  setSearch,
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
  searchPlaceholder,

  ///// EDIT
  viewType,
  modalType,
  editDataType,


  //// OTHER CONTROLS
  createItem,
  createDependency,

  //// DATA
  componentData,
  allData,
  editData,

  //// REDUX
  changeView,
  stateMethod,

  //// CRUD
  submitDeleteRow,
  deleteType

}) => {
  
  //// TABLES WITH DROPDOWNS
  const tableDropdowns = ['jobs', 'activities', 'activitySets']
  
  const matchPattern = /https?:\/\/(www\.)?/gi;
  const myRefs = useRef([])
  const [loadingColor, setLoadingColor] = useState('black')
  const [up, setUp] = useState(1)
  const [down, setDown] = useState(-1)
  const [filter, setFilter] = useState('')
  const [dropdown, setDropdown] = useState('')

  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(event.target.id == 'checkbox') return
          if(item.contains(event.target)) return
          if(event.target.getAttribute('id') == 'dependency') return
          if(event.target == document.getElementById('delete')) return
          if(event.target == document.getElementById('edit')) return
          
          resetCheckboxes()
          setControls('')
          setSelectID('')
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
   
    setControls(controlsType)
    setSelectID(id)
  }
  
  
  return (
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">{title}</div>
        {searchEnable &&
        <div className={`form-group-search ` + (controls ? 'form-group-search-hideOnMobile' : '')}>
          <form autoComplete="off">
            <input 
            type="text" 
            name="search" 
            placeholder={searchPlaceholder} 
            value={search} 
            onChange={(e) => (
              setLoading(searchType), 
              setSearch(e.target.value), 
              document.getElementById('tableContainer').scrollLeft = 0
            )} 
            />
          </form>
        </div>
        }
        <div className="table-header-controls">
          { createItem == typeOfData
            ?
            <div 
            id="plus" 
            className="table-header-controls-item-svg" 
            onClick={() => (
              setModal(modalType), 
              setEdit(''), 
              setControls(''), 
              setMessage(''), 
              resetCheckboxes(),
              setDropdown('')
            )}
            >
              <SVG svg={'plus'}></SVG>
            </div>
            :
            null
          }
          { createDependency == typeOfData && controls == controlsType
            ?
            <div 
              id="dependency" 
              className="table-header-controls-item-svg" 
              onClick={(e) => (
                e.stopPropagation(),
                setEdit(''), 
                populateDependency(allData[typeOfData], 'CREATE_DEPENDENCY', stateMethod, selectID, setEdit),
                setModal('dependency'), 
                setControls(''), 
                setMessage(''), 
                resetCheckboxes()
            )}
            >
              <SVG svg={'dependency'} id={'dependency'}></SVG>
            </div>
            :
            null
          }
          {controls == controlsType && 
          <div 
            id="edit" 
            className="table-header-controls-item" 
            onClick={() => (
              setModal(modalType), 
              changeView(viewType), 
              setEdit(typeOfData), 
              editData(editDataType.key, editDataType.caseType), 
              setControls(''), 
              resetCheckboxes()
            )}
          >
            Edit
          </div>
          }
          {controls == controlsType && 
          <div 
          id="delete" 
          className="table-header-controls-item" 
          onClick={(e) => submitDeleteRow(e, typeOfData, setMessage, 'delete_row', setLoading, token, deleteType, selectID, allData, setAllData, setDynamicSVG, resetCheckboxes, setControls)}
          >
            {loading == 'delete_row' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
              'Delete'
            }
          </div>
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
        filterTable(allData[typeOfData]).length > 0 && 
        filterTable(allData[typeOfData], ['createdAt', 'updatedAt', '__v']).map((item, idx) => 
        // .sort((a, b) => a[filter] > b[filter] ? up : down)
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
                onClick={(e) => e.target.checked == true ?  (
                    setMessage(''), 
                    handleSelect(e, item._id)
                  ) : 
                  (
                    setControls(''), 
                    setSelectID(''), 
                    setMessage('')
                  )}/>
                <span></span>
                <div>
                  <SVG svg={'checkmark'}></SVG>
                </div>
              </label>
            </div>
            {Object.keys(item).sort((a, b) => sortOrder.indexOf(b) - sortOrder.indexOf(a)).map((key, idxKey, array) => 
              key !== '_id' && 
              <div key={idxKey} className="table-rows-item">
                { 
                  Array.isArray(item[key]) && item[key].length > 0 && matchPattern.test(item[key][0].location)
                  ? 
                  <a href={`${item[key][0].location}`} target="_blank">
                    { key == 'files' 
                      ?
                      <img src="https://static.thenounproject.com/png/47347-200.png"></img>
                      :
                      <img src={`${item[key][0].location}`}></img>
                    }
                  </a> 
                  : null
                }
                {
                  Array.isArray(item[key]) && item[key].length > 0 
                  ? 
                  tableDropdowns.includes(typeOfData) && key !== 'files' ?
                  <>
                    <div className="table-rows-item-dropdown">
                      <span onClick={() => 
                        dropdown == '' 
                        ? 
                        setDropdown(`${key}-${idx}`)
                        : 
                        setDropdown('')
                      }>
                      list
                      <SVG svg={'dropdown-arrow'}></SVG>
                      </span>
                      { dropdown == `${key}-${idx}` && 
                        <div className="table-rows-item-dropdown-items">
                          {item[key].map(( data, idxDropdown ) => 
                            <div 
                              key={idxDropdown}
                              className="table-rows-item-dropdown-items-item"
                              onClick={() => handleTableDropdowns(allData, key, data, stateMethod, setEdit, setModal, changeView)}
                            >
                              {data.name ? 
                              data.name.substring(0, 10) : 
                              data.quote_name ?
                              data.quote_name.substring(0, 10) : 
                              data.contact_name.substring(0, 10)
                              }
                            </div>
                          )}
                        </div>
                      }
                      
                    </div>
                    </>
                  :
                  item[key][0].name
                  : null
                }
                {
                  !Array.isArray(item[key]) && item[key].length > 0 && (item[key].match(/^data:image\/(png|jpg|jpeg);base64,/gmi) !== null)
                  ? 
                  <a 
                    download="qr-code.png" 
                    href={`${item[key]}`} target="_blank"
                  >
                    <img src={item[key]}></img>
                  </a>
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
