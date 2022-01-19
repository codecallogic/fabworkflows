import {filterTable} from '../helpers/tableData'
import SVG from '../files/svgs'
import {useEffect, useState, useRef} from 'react'

const Table = ({
  title,
  typeOfData,
  modalType,
  modalDataType,
  componentData,
  originalData,
  selectID,
  setSelectID,
  controls,
  setControls,
  deleteRow,
  setModalData,
  setModal,
  searchEnable,
  search,
  setSearch,
  message,
  setMessage,
  sortOrder,
  resetCheckboxes
}) => {
  const myRefs = useRef([])
  
  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          
          if(event.target.id == 'checkbox') return
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete')) return
          if(event.target == document.getElementById('edit')) return
          
          resetCheckboxes()
          setControls(false)
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
   
    setControls(true)
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
            placeholder="Search" 
            value={search} 
            onChange={(e) => (setSearch(e.target.value))} 
            onFocus={(e) => (e.target.placeholder = '', setError(''))} onBlur={(e) => (e.target.placeholder = 'Search', setError(''))} 
            onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  
            required>
            </input>
          </form>
        </div>
        }
        {controls &&
          <div className="table-header-controls">
            <div 
            id="edit" 
            className="table-header-controls-item" 
            onClick={() => (setModal(modalType), setModalData(modalDataType.key, modalDataType.method), setControls(false), resetCheckboxes())}
            >
              Edit
            </div>
            <div 
            id="delete" 
            className="table-header-controls-item" 
            onClick={deleteRow}
            >
              Delete
            </div>
          </div>
        }
        { message && 
          <div className="table-header-error">
            <SVG svg={'notification'}></SVG> 
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
                {(key.replace( /([a-z])([A-Z])/g, "$1 $2")).replace('_', ' ')}
              </div>
            )
          )
        }
      </div>
      <div className="table-rows-container">
      { 
        filterTable(originalData[typeOfData]).length > 0 && 
        filterTable(originalData[typeOfData], ['createdAt', 'updatedAt', '__v']).map((item, idx) => 
          <div key={idx} className={`table-rows ` + (idx % 2 == 1 ? ' row-odd' : ' row-even')}>
            <div className="table-rows-checkbox" 
              ref={(el) => (myRefs.current[idx] = el)}
            >
              <label htmlFor={`checkbox`}>
                <input id={`checkbox`} className="table-rows-checkbox-input" type="checkbox" onClick={(e) => e.target.checked == true ?  handleSelect(e, item._id) : (setControls(false), setSelectID(''))}/>
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
                  Array.isArray(item[key]) && item[key].length > 0 && key == 'images' 
                  ? 
                  <img src={`${item[key][0].location}`}></img> 
                  : null
                }
                {
                  Array.isArray(item[key]) && item[key].length > 0 
                  ? 
                  item[key][0].name
                  : null
                }
                {
                  !Array.isArray(item[key]) && item[key].length > 0 && key == 'qr_code'
                  ? 
                  <img src={item[key]}></img> 
                  : null
                }
                {
                  !Array.isArray(item[key]) && key !== 'qr_code'
                  ? 
                  item[key]
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
