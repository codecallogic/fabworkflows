import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { manageFormFields } from '../../helpers/forms'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const ListModal = ({
  message,
  setMessage,
  setModal,
  loading,
  edit,
  dynamicSVG,
  title,

  //// DATA
  allData,

  //// REDUX
  dynamicType,
  extractingStateData,
  
}) => {
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
            {title}
        </span>
        <div onClick={() => (setModal(''), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
        </div>



        <form className="addFieldItems-modal-form">
          <div className="form-group mbType1">
            <input
            onClick={() => setInputDropdown('job_purchase_order')} 
            value={currentItem.supplier ? manageFormFields(currentItem.supplier[0], 'name') : ''} 
            readOnly
            />
            <label 
            className={`input-label ` + (
              currentItem !== ''
              ? ' labelHover' 
              : ''
            )}
            htmlFor="quotes">
              Purchase Order
            </label>
            <div 
            onClick={() => setInputDropdown('job_purchase_order')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'job_purchase_order' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData && allData.purchaseOrders.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (
                    setCurrentItem(item),
                    setInputDropdown('')
                  )}
                >
                   {` 
                    ${manageFormFields(item.supplier[0], 'name')}
                    ${ item.shipping ? ` / ${item.shipping}` : ''}
                    ${ item.POnumber ? ` / ${item.POnumber}` : ''}
                  `}
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
            {loading == 'create_po_item' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Save'
            }
        </button>
      </div>
      
    </div>
    </div>
    
  )
}

export default ListModal
