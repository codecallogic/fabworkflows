import {useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import SVGs from '../../files/svgs'
import {API} from '../../config'
import axios from 'axios'

const Address = ({setmodal, update, quote, createQuote, resetQuote, convertDate, updateJob, createJob}) => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState(false)

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

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
  }

  const validateIsEmail = (type) => {
    const input = document.getElementById(type)
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
    return regex.test(input.value)
  }

  const validateIsPhoneNumber = (type, property) => {
    const input = document.getElementById(type)
    const cleanNum = input.value.toString().replace(/\D/g, '');
    const match = cleanNum.match(/^(\d{3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return  createQuote(property, '(' + match[1] + ') ' + (match[2] ? match[2] + "-" : "") + match[3]);
    }
    return null;
  }

  useEffect(() => {
    let orderNumber = Math.floor(100000000 + Math.random() * 900000000)
    createQuote('quote_number', orderNumber)
  }, [])

  const createNewQuote = async () => {
    if(!quote.contact_name) return setError('Quote name is required')
    setLoading('create')
    setError('')
    
    try {
      const responseQuote = await axios.post(`${API}/transaction/create-quote-to-job`, {quote: quote, job: updateJob})
      setLoading('')
      resetQuote()
      
      for(let key in responseQuote.data){
        createJob(key, responseQuote.data[key])
        if(key == 'createdAt') createJob('createdAt', convertDate(responseQuote.data['createdAt']))
      }
      setmodal('')
      
    } catch (error) {
      console.log(error)
      setLoading('')
      if(error) error.response ? setError(error.response.data) : setError('Error creating address, please try again later')
    }
  }
  
  return (
    <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header" >
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Create New Quote'}</span>
          <div onClick={() => (setmodal(''), setError(''), setMessage(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <div className="addFieldItems-modal-form-container">
        <div className="addFieldItems-modal-info">
          <div className="clientDashboard-view-form-left-box-container-2-item">
            <div className="clientDashboard-view-form-left-box-container-2-item-heading modal-info-title">Account: </div>
            <div className="clientDashboard-view-form-left-box-container-2-item-content modal-info-title-text">
              {updateJob.accounts && updateJob.accounts.length > 0 && 
                <span>{updateJob.accounts[0].name}</span>
              }
            </div>
          </div>
          <div className="clientDashboard-view-form-left-box-container-2-item">
            <div className="clientDashboard-view-form-left-box-container-2-item-heading modal-info-title">Job: </div>
            <div className="clientDashboard-view-form-left-box-container-2-item-content modal-info-title-text">
              {updateJob.name}
            </div>
          </div>
        </div>
        <form className="addFieldItems-modal-form">
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name">Quote Name</label>
              <textarea id="name" rows="1" name="name" placeholder="(Contact Name)" value={quote.contact_name} onChange={(e) => createQuote('contact_name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Contact Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
        </form>
        </div>
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        {message && <span className="form-message-modal">{message}</span>}
        {update == '' && <div className="form-button w100" onClick={(e) => createNewQuote(e)}>{!loading && <span>Save</span>} {loading == 'create' && <div className="loading"><span></span><span></span><span></span></div>}</div>}
        {update == 'true' && <div onClick={(e) => updateContact(e)} className="form-button w100">{!loading && <span>Update</span>} {loading == 'update' && <div className="loading"><span></span><span></span><span></span></div>}</div>}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    quote: state.quote,
    updateJob: state.job
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createQuote: (name, data) => dispatch({type: 'CREATE_QUOTE', name: name, value: data}),
    resetQuote: () => dispatch({type: 'RESET_QUOTE'}),
    createJob: (name, data) => dispatch({type: 'CREATE_JOB', name: name, value: data}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Address)
