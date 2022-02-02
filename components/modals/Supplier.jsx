import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import PlacesAutocomplete from 'react-places-autocomplete'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const SupplierModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  dynamicSVG,
  setDynamicSVG,

  //// VALIDATIONS
  phoneNumber,
  validateNumber,
  addressSelect,

  //// DATA
  allData,
  setAllData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,

  //// CRUD
  submitCreate,
  submitUpdate
}) => {
  
  const createType = 'CREATE_SUPPLIER'
  const resetType = 'RESET_SUPPLIER'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('white')
  const [input_dropdown, setInputDropdown] = useState('')

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
  
  return (
    <div 
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
            {edit == 'supplier' ? 
            'Edit Supplier' 
            : 
            'New Supplier'
            }
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
        </div>



        <form className="addFieldItems-modal-form">
        <div className="form-group">
          <input 
          id="name" 
          value={stateData.name} 
          onChange={(e) => stateMethod(createType, 'name', e.target.value)}/>
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
          id="phone" 
          value={stateData.phone} 
          onChange={(e) => (validateNumber('phone'), stateMethod(createType, 'phone', e.target.value), phoneNumber('phone', createType, stateMethod))}/>
          <label 
          className={`input-label ` + (
            stateData.phone.length > 0 || 
            typeof stateData.phone == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="phone">
            Phone
          </label>
        </div>
        <PlacesAutocomplete 
        value={stateData.address} 
        onChange={(e) => stateMethod(createType, 'address', e)} 

        /////  KEYS RESPECTIVELY: ADDRESS, CITY, STATE, ZIP, COUNTRY
        onSelect={(e) => (
          setInputDropdown(''), 
          addressSelect(e, 'address', createType, stateMethod))
        } 
        searchOptions={searchOptionsAddress}
        >
        { ({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
        <div className="form-group">
          <input 
          onClick={() => setInputDropdown('supplier_address')} 
          {...getInputProps()}/>
          <label 
            className={`input-label ` + (
            stateData.address.length > 0 || 
            typeof stateData.address == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="address">
            Address
          </label>
          <div onClick={() => setInputDropdown('supplier_address') }>
            <SVG svg={'dropdown-arrow'}></SVG>
          </div>
          { input_dropdown == 'supplier_address' &&
            <div 
            className="form-group-list" 
            ref={myRefs}
            >
              {loading ? <div>...loading</div> : null}
              {suggestions.map( (item, idx) => (
                <div 
                key={idx} 
                className="form-group-list-item" 
                {...getSuggestionItemProps(item)}
                >
                  {item.description}
                  <input 
                  id="addressGeoId" 
                  value={item.placeId} 
                  style={{display: 'none'}}
                  readOnly
                  />
                </div>
              ))}
            </div>
          }
        </div>
        )}
        </PlacesAutocomplete>
        <div className="form-group">
          <input 
          id="tax_id" 
          value={stateData.tax_id} 
          onChange={(e) => (validateNumber('tax_id'), stateMethod(createType, 'tax_id', e.target.value))}/>
          <label 
          className={`input-label ` + (
            stateData.tax_id.length > 0 || 
            typeof stateData.tax_id == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="tax_id">
            Tax ID
          </label>
        </div>
        <div className="form-group">
          <input 
          id="contact_name" 
          value={stateData.contact_name} 
          onChange={(e) => (stateMethod(createType, 'contact_name', e.target.value))}/>
          <label 
          className={`input-label ` + (
            stateData.contact_name.length > 0 || 
            typeof stateData.contact_name == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="contact_name">
            Contact Name
          </label>
        </div>
        <div className="form-group">
          <input 
          id="contact_phone" 
          value={stateData.contact_phone} 
          onChange={(e) => (validateNumber('contact_phone'), stateMethod(createType, 'contact_phone', e.target.value), phoneNumber('contact_phone', createType, stateMethod))}/>
          <label 
          className={`input-label ` + (
            stateData.contact_phone.length > 0 || 
            typeof stateData.contact_phone == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="contact_phone">
            Contact Phone
          </label>
        </div>
        <div className="form-group">
          <input 
          id="contact_email" 
          value={stateData.contact_email} 
          onChange={(e) => (stateMethod(createType, 'contact_email', e.target.value))}/>
          <label 
          className={`input-label ` + (
            stateData.contact_email.length > 0 || 
            typeof stateData.contact_email == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="contact_email">
            Contact Email
          </label>
        </div>
        <div className="form-group">
          <input 
          id="bank" 
          value={stateData.bank} 
          onChange={(e) => (stateMethod(createType, 'bank', e.target.value))}/>
          <label 
          className={`input-label ` + (
            stateData.bank.length > 0 || 
            typeof stateData.bank == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="bank">
            Bank
          </label>
        </div>
        <div className="form-group">
          <input 
          id="account" 
          value={stateData.account} 
          onChange={(e) => (validateNumber('account'), stateMethod(createType, 'account', e.target.value))}/>
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
        </div>
        <div className="form-group">
          <input 
          id="agency" 
          value={stateData.agency} 
          onChange={(e) => (validateNumber('agency'), stateMethod(createType, 'agency', e.target.value))}/>
          <label 
          className={`input-label ` + (
            stateData.agency.length > 0 || 
            typeof stateData.agency == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="agency">
            Agency
          </label>
        </div>
        <div className="form-group-textarea">
          <label 
          className={stateData.note.length > 0 ? ' labelHover' : ''}>
            Note
          </label>
          <textarea 
            id="note" 
            rows="5" 
            wrap="hard" 
            maxLength="400"
            name="note" 
            value={stateData.note} 
            onChange={(e) => stateMethod(createType, 'note', e.target.value)} 
          />
        </div>
        <div className="form-group-textarea">
          <label 
          className={stateData.bank_note.length > 0 ? ' labelHover' : ''}>
            Bank Note
          </label>
          <textarea 
            id="bank_note" 
            rows="5" 
            wrap="hard" 
            maxLength="400"
            name="note" 
            value={stateData.bank_note} 
            onChange={(e) => stateMethod(createType, 'bank_note', e.target.value)} 
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
        {!edit && 
        <button 
        className="form-group-button" 
        onClick={(e) => submitCreate(e, stateData, 'suppliers', setMessage, 'create_supplier', setLoading, token, 'suppliers/create-supplier', resetType, resetState, allData, setAllData, setDynamicSVG)}
        >
            {loading == 'create_supplier' ? 
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
        {edit == 'supplier' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'suppliers', setMessage, 'update_supplier', setLoading, token, 'suppliers/update-supplier', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'suppliers', setModal))}
        >
           {loading == 'update_supplier' ? 
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

export default SupplierModal
