import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { manageFormFields } from '../../helpers/forms'

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
  
  const createType = 'CREATE_QUOTE'
  const resetType = 'RESET_QUOTE'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('white')
  const [input_dropdown, setInputDropdown] = useState('')
  const [currentItem, setCurrentItem] = useState('')

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
            {edit == 'quote_item' ? 
            'Edit Quote' 
            : 
            'Add Quote'
            }
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
        </div>



        <form className="addFieldItems-modal-form">
          <div className="form-group mbType1">
            <input
            onClick={() => setInputDropdown('job_quote')} 
            value={manageFormFields(currentItem, 'quote_name')} 
            readOnly
            />
            <label 
            className={`input-label ` + (
              currentItem !== ''
              ? ' labelHover' 
              : ''
            )}
            htmlFor="quotes">
              Quote
            </label>
            <div 
            onClick={() => setInputDropdown('job_quote')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'job_quote' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData && allData.quotes.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (
                    dynamicType 
                    ?
                    setCurrentItem(item)
                    :
                    stateMethod(createType, 'account', item), setInputDropdown('')
                  )}
                >
                  {item.quote_name}
                </div>
                ))}
              </div>
            }
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
        onClick={(e) => dynamicType 
          ?
          (
            extractingStateData(currentItem),
            setModal('')
          )
          :
          null
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
        onClick={(e) => (e.preventDefault(), null)}
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
