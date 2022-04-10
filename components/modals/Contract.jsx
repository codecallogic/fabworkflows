import { useState, useEffect } from 'react'
import SVG from '../../files/svgs'
import SignaturePad from 'signature_pad'

// let signaturePad = new SignaturePad(canvas)

const ContractModal = ({
  token,
  setModal
}) => {
  
  const resetType = ''
  const [loadingColor, setLoadingColor] = useState('white')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('')
  const [canvasID, setCanvasID] = useState('')
  const [signaturePad, setSignaturePad] = useState('')
  const [image, setImage] = useState('')

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
    
    if(e.target){ 
      if(e.target.id){ 
        if(e.target.id == 'sig') return 
      }
    }
    
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
  
  useEffect(() => {
    setCanvasID(document.getElementById('sig'))
  }, [])

  useEffect(() => {

    if(canvasID) setSignaturePad(new SignaturePad(canvasID))
    if(canvasID){ 
      canvasID.width = canvasID.scrollWidth
      canvasID.height = canvasID.scrollHeight

      setCanvasID(canvasID)
     }
    
  }, [canvasID])
  
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
            Sign
        </span>
        <div onClick={() => setModal('')}>
          <SVG svg={'close'}></SVG>
        </div>
      </div>
      <form 
      className="addFieldItems-modal-form" 
      >
        <div className="sig-container">
          <canvas id="sig"></canvas>
        </div>
      

        {message && 
        <span className="form-group-message">
          <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
          {message}
        </span>
        }

        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), signaturePad.clear())}
        >
          Clear
        </button>
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), setImage(signaturePad.toDataURL()))}
        >
           {loading == 'create_email' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Send Quote'
            }
        </button>

        {image &&
          <img src={image}></img>
        }
        
      </form>
    </div>
    </div>
  )
}

export default ContractModal
