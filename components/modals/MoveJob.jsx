import {useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import SVGs from '../../files/svgs'
import {API} from '../../config'
import axios from 'axios'

const MoveJob = ({setmodal, update, updateJob, createJob, accounts}) => {
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

  const MoveJobToAccount = () => {
    setError('This functionality is not yet supported.')
  }

  return (
    <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header" >
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Move Job to Account'}</span>
          <div onClick={() => (setmodal(''), setError(''), setMessage(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <div className="addFieldItems-modal-form-container">
        <div className="addFieldItems-modal-info">
          <div className="clientDashboard-view-form-left-box-container-2-item">
            <div className="clientDashboard-view-form-left-box-container-2-item-heading modal-info-title">Job: </div>
            <div className="clientDashboard-view-form-left-box-container-2-item-content modal-info-title-text">
              {updateJob.name}
            </div>
          </div>
        </div>
        <form className="addFieldItems-modal-form">
          {/* <div className="form-group-single-dropdown">
            <label htmlFor="category">Category</label>
            <div className="form-group-single-dropdown-textarea">
              <textarea id="category" rows="2" name="category" placeholder="(Select Category)" onClick={() => setInputDropdown('category')} value={quoteLine.category} readOnly></textarea>
              <SVGs svg={'dropdown-arrow'}></SVGs>
            </div>
            {input_dropdown == 'category' && 
            <div className="form-group-single-dropdown-list" ref={myRefs}>
              {allCategories && allCategories.map((item, idx) => 
                <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item" onClick={() => (createQuoteLine('category', item.name), setInputDropdown(''))}>
                {item.name}
                </div>
              )   
              }
            </div>
            }
          </div> */}
        </form>
        </div>
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        {message && <span className="form-message-modal">{message}</span>}
        {update == '' && <div className="form-button w100" onClick={(e) => MoveJobToAccount()}>{!loading && <span>Save</span>} {loading == 'create' && <div className="loading"><span></span><span></span><span></span></div>}</div>}
        {update == 'true' && <div onClick={(e) => updateContact(e)} className="form-button w100">{!loading && <span>Update</span>} {loading == 'update' && <div className="loading"><span></span><span></span><span></span></div>}</div>}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    updateJob: state.job
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createJob: (name, data) => dispatch({type: 'CREATE_JOB', name: name, value: data}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoveJob)
