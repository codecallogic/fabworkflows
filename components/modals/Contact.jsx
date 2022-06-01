import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { validateNumber, phoneNumber, addressSelect } from '../../helpers/validations'
import { manageFormFields } from '../../helpers/forms'
import { populateAddress } from '../../helpers/modals'
import PlacesAutocomplete from 'react-places-autocomplete'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const PriceListModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  dynamicSVG,
  setDynamicSVG,

  //// DATA
  allData,
  setAllData,
  editData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  dynamicType,
  extractingStateData,

  //// CRUD
  submitCreate,
  submitUpdate,
}) => {

  const createType = 'CREATE_CONTACT'
  const resetType = 'RESET_CONTACT'
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
            {edit == 'contact' ? 
            'Edit Contact' 
            : 
            'New Contact'
            }
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
        </div>



        <form className="addFieldItems-modal-form">
          
        {dynamicType 
          ? 
          <div className="form-group">
            <input
            onClick={() => setInputDropdown('quote_contact')} 
            value={manageFormFields(stateData.contact_name, 'contact_name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'contact_name', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.contact_name.length > 0 || 
              typeof stateData.contact_name == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="contact_name">
              Contact
            </label>
            <div 
            onClick={() => setInputDropdown('quote_contact')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'quote_contact' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData && allData.contacts.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div 
                key={idx} 
                className="form-group-list-item" 
                onClick={(e) => (populateAddress('address_id', item, stateMethod, createType), setInputDropdown(''))}>
                  {item.contact_name}
                </div>
                ))}
              </div>
            }
          </div>
          :
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
        }
        
        <PlacesAutocomplete 
          value={stateData.address} 
          onChange={(e) => stateMethod(createType, 'address', e)} 

          /////  KEYS RESPECTIVELY: ADDRESS, CITY, STATE, ZIP, COUNTRY
          onSelect={(e) => (
            setInputDropdown(''), 
            addressSelect(e, 'address', createType, stateMethod, 'addressGeoId', 'city', 'state', 'zip_code', 'country'))
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
          id="city" 
          value={stateData.city} 
          onChange={(e) => (stateMethod(createType, 'city', e.target.value))}/>
          
          <label 
          className={`input-label ` + (
            stateData.city.length > 0 || 
            typeof stateData.city == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="city">
            City
          </label>
        </div>
        <div className="form-group">
          <input 
          id="state" 
          value={stateData.state} 
          onChange={(e) => (stateMethod(createType, 'state', e.target.value))}/>
          
          <label 
          className={`input-label ` + (
            stateData.state.length > 0 || 
            typeof stateData.state == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="state">
            State
          </label>
        </div>
        <div className="form-group">
          <input 
          id="country" 
          value={stateData.country} 
          onChange={(e) => (stateMethod(createType, 'country', e.target.value))}/>
          
          <label 
          className={`input-label ` + (
            stateData.country.length > 0 || 
            typeof stateData.country == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="country">
            Country
          </label>
        </div>
        <div className="form-group">
          <input 
          id="zip_code" 
          value={stateData.zip_code} 
          onChange={(e) => (validateNumber('zip_code'), stateMethod(createType, 'zip_code', e.target.value))}
          />
          
          <label 
          className={`input-label ` + (
            stateData.zip_code.length > 0 || 
            typeof stateData.zip_code == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="zip_code">
            Zip Code
          </label>
        </div>
        <div className="form-group">
          <input 
          id="phone" 
          value={stateData.phone} 
          onChange={(e) => (
            validateNumber('phone'), 
            stateMethod(createType, 'phone', e.target.value), 
            phoneNumber('phone', createType, stateMethod)
          )}
          />
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
        <div className="form-group">
          <input 
          id="cell" 
          value={stateData.cell} 
          onChange={(e) => (
            validateNumber('cell'), 
            stateMethod(createType, 'cell', e.target.value),
            phoneNumber('cell', createType, stateMethod)
            )}
          />
          
          <label 
          className={`input-label ` + (
            stateData.cell.length > 0 || 
            typeof stateData.cell == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="cell">
            Cell
          </label>
        </div>
        <div className="form-group">
          <input 
          id="fax" 
          value={stateData.fax} 
          onChange={(e) => (validateNumber('fax'), stateMethod(createType, 'fax', e.target.value))}/>
          
          <label 
          className={`input-label ` + (
            stateData.fax.length > 0 || 
            typeof stateData.fax == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="fax">
            Fax
          </label>
        </div>
        <div className="form-group">
          <input 
          id="email" 
          value={stateData.email} 
          onChange={(e) => (stateMethod(createType, 'email', e.target.value))}/>
          
          <label 
          className={`input-label ` + (
            stateData.email.length > 0 || 
            typeof stateData.email == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="email">
            Email
          </label>
        </div>
        <div className="form-group-textarea">
          <label 
          className={stateData.contact_notes.length > 0 ? ' labelHover' : ''}>
            Contact Notes
          </label>
          <textarea 
            id="contact_notes" 
            rows="5" 
            wrap="hard" 
            maxLength="400"
            name="contact_notes" 
            value={stateData.contact_notes} 
            onChange={(e) => stateMethod(createType, 'contact_notes', e.target.value)} 
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
        {edit == '' | edit == 'jobs' && 
        <button 
        className="form-group-button" 
        onClick={(e) => dynamicType 
          ?
          (
            extractingStateData(stateData),
            setModal(''),
            resetState(resetType)
          )
          :
          submitCreate(e, stateData, 'contacts', null, setMessage, 'create_contact', setLoading, token, 'contact/create-contact', resetType, resetState, allData, setAllData, setDynamicSVG)
        }
        >
            {loading == 'create_contact' ? 
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
        {edit == 'contact' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'contacts', null, setMessage, 'update_contact', setLoading, token, 'contact/update-contact', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'contacts', setModal))}
        >
           {loading == 'update_contact' ? 
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

export default PriceListModal
