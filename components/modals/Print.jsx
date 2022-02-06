import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import QuotePDF from '../../components/pdf/quote'
import Agreement from '../../components/pdf/agreement'
import { BlobProvider } from '@react-pdf/renderer'
import { validatePDFContent } from '../../helpers/validations'

const QuoteLineModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  setEdit,
  dynamicSVG,
  setDynamicSVG,

  //// DATA
  allData,
  setAllData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  typeForm,

  //// CRUD
  submitCreate,
  submitUpdate
}) => {
  
  const changeFormType        = 'CHANGE_FORMTYPE'
  const [loadingColor, setLoadingColor] = useState('white')

  //// QUOTE LINE
  const [searchItems, setSearchItems] = useState(false)
  const [search, setSearch] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
   

  //// DROPDOWNS
  const myRefs = useRef(null)
  const [input_dropdown, setInputDropdown] = useState('')

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
            {edit == 'quote_line' ? 
            'Edit Print' 
            : 
            'New PDF'
            }
        </span>

        <div onClick={() => (
            setModal(''), 
            setMessage('')
          )}>
          <SVG svg={'close'}></SVG>
        </div>


      </div>
      <form 
      className="addFieldItems-modal-form" 
      >
          { typeForm == '' && 
            <>
            <BlobProvider 
                document={<QuotePDF stateData={stateData}/>}
              >
                {({ blob, url, loading, error }) =>
                  <div className="form-group-button" onClick={() => (
                    validatePDFContent('viewQuote', 'pdfQuote', stateData, url, setDynamicSVG, setMessage)
                  )}>
                    View Quote
                  </div>
                }
            </BlobProvider>
            <BlobProvider 
                document={<QuotePDF stateData={stateData}/>}
              >
                {({ blob, url, loading, error }) =>
                  <div className="form-group-button" onClick={() => (
                    validatePDFContent('downloadQuote', 'pdfQuote', stateData, url, setDynamicSVG, setMessage)
                  )}>
                    Download Quote
                  </div>
                }
            </BlobProvider>
            <BlobProvider 
                document={<Agreement stateData={stateData}/>}
              >
                {({ blob, url, loading, error }) =>
                  <div className="form-group-button" onClick={() => (
                    validatePDFContent('viewAgreement', 'pdfAgreement', stateData, url, setDynamicSVG, setMessage)
                  )}>
                    View Agreement
                  </div>
                }
            </BlobProvider>
            <BlobProvider 
                document={<Agreement stateData={stateData}/>}
              >
                {({ blob, url, loading, error }) =>
                  <div className="form-group-button" onClick={() => (
                    validatePDFContent('downloadAgreement', 'pdfAgreement', stateData, url, setDynamicSVG, setMessage)
                  )}>
                    Download Agreement
                  </div>
                }
            </BlobProvider>
            </>
          }
          
      </form>


      {message && 
      <span className="form-group-message">
        <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
        {message}
      </span>
      }


    </div>
    </div>
  )
}

export default QuoteLineModal
