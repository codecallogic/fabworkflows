import { useState, useEffect } from 'react'
import SVG from '../../files/svgs'
import SignaturePad from 'signature_pad'
import axios from 'axios'
import { API } from '../../config'
import moment from 'moment-timezone'
moment.tz(Date.now(), 'America/New_York')

const ContractModal = ({
  token,
  setModal,
  message,
  setMessage,
  data,
  setContract
}) => {
  
  const resetType = ''
  const [loadingColor, setLoadingColor] = useState('white')
  const [loading, setLoading] = useState('')
  const [canvasID, setCanvasID] = useState('')
  const [signaturePad, setSignaturePad] = useState('')
  const [fullName, setFullName] = useState('')
  const [signature, setSignature] = useState(false)

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

  const signContract = async (image) => {
    
    if(!fullName) return setMessage('Full name is required')
    if(!signature) return setMessage('Signature is required')
    setLoading('create_signature')

    data.signatureFullName = fullName
    data.image = image
    data.signed = true
    data.dateSigned =moment(Date.now()).format('MM/DD/YYYY HH:mm:ss')
    
    try {
      const response = await axios.post(`${API}/contracts/sign-contract`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          contentType: 'multipart/form-data'
        }
      })
      setLoading('')
      setModal('')
      setContract(response.data)
      
    } catch (error) {
      console.log(error)
      setLoading('')
      if(error) error.response ? setMessage(error.response.data) : setMessage('Error occurred signing the document')
    }
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
            Signature
        </span>
        <div onClick={() => (setMessage(''), setModal(''))}>
          <SVG svg={'close'}></SVG>
        </div>
      </div>
      <form 
      className="addFieldItems-modal-form" 
      >
        <div className="form-group">
          <input 
          id="fullName" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)}
          />
          <label 
          className={`input-label ` + (
            fullName.length > 0 || 
            typeof fullName == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="fullName">
            Your first and last name
          </label>
        </div>
        
        <div className="sig-container">
          <canvas id="sig" onClick={() => setSignature(true)}></canvas>
        </div>
      

        {message && 
        <span className="form-group-message">
          <SVG svg={'error'} color={'#fd7e3c'}></SVG>
          {message}
        </span>
        }

        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), setSignature(false), signaturePad.clear())}
        >
          Clear
        </button>
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), signContract(signaturePad.toDataURL()))}
        >
           {loading == 'create_signature' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Sign document'
            }
        </button>
        
      </form>
    </div>
    </div>
  )
}

export default ContractModal
