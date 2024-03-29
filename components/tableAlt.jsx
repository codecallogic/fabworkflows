import { filterTable, sortColumns } from '../helpers/tableData'
import SVG from '../files/svgs'
import { useEffect, useState, useRef } from 'react'

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
  setDynamicType,
  setDynamicKey,
  setAltEdit, 

  ///// EDIT
  viewType,
  modalType,
  editDataType,
  editModalType,

  //// DATA
  componentData,
  allData,
  editData,
  stateMethod,

  //// REDUX
  changeView,

  //// CRUD
  submitDeleteRow,
  deleteType

}) => {

  const matchPattern = /https?:\/\/(www\.)?/gi;
  const myRefs = useRef([])
  const [loadingColor, setLoadingColor] = useState('black')
  const [up, setUp] = useState(1)
  const [down, setDown] = useState(-1)
  const [filter, setFilter] = useState('')
  
  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          
          if(event.target.id == 'checkbox') return
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('plus')) return
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onChange={(e) => (setLoading(searchType), setSearch(e.target.value), document.getElementById('tableContainer').scrollLeft = 0)} 
            onFocus={(e) => (e.target.placeholder = '', setMessage(''))} 
            onBlur={(e) => (e.target.placeholder = 'Search', setMessage(''))} 
            />
          </form>
        </div>
        }
       
          <div className="table-header-controls">
            <div 
            id="plus" 
            className="table-header-controls-item-svg" 
            onClick={() => (
              setModal(modalType), 
              setEdit(''), 
              setControls(''), 
              setMessage(''), 
              resetCheckboxes(),
              setDynamicKey(''),
              setDynamicType('')
            )
            }
            >
              <SVG svg={'plus'}></SVG>
            </div>
            {controls == controlsType && 
            <div 
            id="edit" 
            className="table-header-controls-item" 
            onClick={(e) => (e.stopPropagation(), setModal(modalType), setEdit(editModalType), editData(editDataType.key, editDataType.caseType, stateMethod, allData, setSelectID, null, selectID), setControls(''), setAltEdit('none'), resetCheckboxes())}
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
              <div className="loading-spinner">
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
      <div id="tableContainer" className="table-rows-container" style={{ overflowX: loading == 'searching' ? 'hidden' : ''}}>
      {loading == searchType ? 
        <div className="search-loading">
          <div className="search-loading-box">
            <svg><circle cx="20" cy="20" r="20"></circle></svg><span>Loading items</span>
          </div>
        </div>
        : null
      }
      <div className="table-headers-container">
        <div className="table-headers">
          <div className="table-headers-item">&nbsp;</div>
          { 
            filterTable(componentData).length > 0 && 
            filterTable(componentData, ['_id', 'createdAt', 'updatedAt', '__v'], 1).map((item, idx, array) => 
              Object.keys(array[0]).sort((a, b) => sortOrder.indexOf(b) - sortOrder.indexOf(a)).map((key, idx) => 
                <div key={idx} className="table-headers-item">
                  <span onClick={() => 
                    (
                      filter == key ? null : setFilter(key),
                      setUp(up == 1 ? -1 : 1), setDown(down == -1 ? 1 : -1)
                    )
                  }>
                    {(key.replace( /([a-z])([A-Z])/g, "$1 $2")).replace('_', ' ')}
                    <SVG svg={'sort'}></SVG>
                  </span>
                </div>
              )
            )
          }
        </div>
      </div>
      { 
        filterTable(allData[typeOfData]).length > 0 && 
        filterTable(allData[typeOfData], ['createdAt', 'updatedAt', '__v']).sort((a, b) => sortColumns(a, b, filter) ? up : down).map((item, idx) => 
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
                onClick={(e) => e.target.checked == true ?  (setMessage(''), handleSelect(e, item._id)) : (setControls(''), setSelectID(''), setMessage(''))}/>
                <span></span>
                <div>
                  <SVG svg={'checkmark'}></SVG>
                </div>
              </label>
              <div 
                className="table-rows-edit"
                onClick={ (e) => (
                  e.stopPropagation(), 
                  setModal(modalType), 
                  setEdit(editModalType), 
                  editData(editDataType.key, editDataType.caseType, stateMethod, allData, setSelectID, null, item._id), 
                  setControls(''), 
                  setAltEdit('none'),
                  resetCheckboxes()
                )}
              >
                <SVG svg={'edit'}></SVG>
              </div>
            </div>
            {Object.keys(item).sort((a, b) => sortOrder.indexOf(b) - sortOrder.indexOf(a)).map((key, idx, array) => 
              key !== '_id' && 
              <div key={idx} className="table-rows-item">
                { 
                  Array.isArray(item[key]) && item[key].length > 0 && matchPattern.test(item[key][0].location)
                  ? 
                  <a href={`${item[key][0].location}`} target="_blank">
                    <img src={`${item[key][0].location}`}></img>
                  </a>
                  : null
                }
                {
                  Array.isArray(item[key]) && item[key].length > 0 
                  ? 
                  item[key][0].name
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
                  (key == 'color' 
                    ? 
                    (<div><span className="table-rows-item-color" style={{backgroundColor: item[key]}}></span>{item[key]}</div>) 
                    : 
                    <span style={{color: item['color'] ? item['color'] : '', fontWeight: '500'}}>{item[key].substring(0, 70)}</span>
                  )
                  : null
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
