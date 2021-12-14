import {useState, useEffect} from 'react'
import SVGs from '../../files/svgs'
import axios from 'axios'
import {API} from '../../config'
import {nanoid} from 'nanoid'
import {connect} from 'react-redux'

const PriceList = ({setmodal, priceList, createPrice, addPriceImage, deletePriceImage, resetPrice, update}) => {
  // console.log(priceList)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('')

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
    const regex = /[^0-9|/.\n\r]/g

    input.value = input.value.split(regex).join('')
  }

  const submitAddPriceList = async (e) => {
    e.preventDefault()
    if(!priceList.brand) return setError('Brand is required')
    if(!priceList.model) return setError('Model is required')
    if(!priceList.color) return setError('Color is required')
    if(!priceList.price) return setError('Price is required')

    let data = new FormData()
    if(priceList.images[0]){
      let fileID = nanoid()
      data.append('file', priceList.images[0], `price-list${fileID}.${priceList.images[0].name.split('.')[1]}`)
    }

    for(let key in priceList){
      if(key !== 'price') data.append(key, priceList[key])
      if(key == 'price') data.append('price', priceList.price.replace('$', ''))
     
    }

    setLoading(true)
    setMessage('')
    setError('')
    try {
      const responsePriceList = await axios.post(`${API}/transaction/create-price-list`, data)
      setLoading(false)
      setError('')
      resetPrice()
      setMessage(responsePriceList.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setMessage('')
      if(error) error.response ? setError(error.response.data) : setError('There was an error creating the price list')
    }
  }

  const validateIsPrice = (evt) => {
    let newValue = Number(evt.target.value.replace(/\D/g, '')) / 100
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    
    return formatter.format(newValue)
  }

  const updatePriceList = async (e) => {
    e.preventDefault()
    if(!priceList.brand) return setError('Brand is required')
    if(!priceList.model) return setError('Model is required')
    if(!priceList.color) return setError('Color is required')
    if(!priceList.price) return setError('Price is required')

    let data = new FormData()
    
    for(let key in priceList){
      if(key !== 'deleteImages') data.append(key, priceList[key])
      if(key == 'price') data.append('price', priceList.price.replace('$', ''))
    }

    if(priceList.images[0].location){
      data.append('images', JSON.stringify(priceList.images))
    }else{
      data.append('deleteImages', JSON.stringify(priceList.deleteImages))


      let fileID = nanoid()
      data.append('file', priceList.images[0], `price-list${fileID}.${priceList.images[0].name.split('.')[1]}`)
    }

    setLoading(true)
    setMessage('')
    setError('')
    try {
      const responsePriceList = await axios.post(`${API}/transaction/update-price-list`, data)
      setLoading(false)
      setError('')
      resetPrice()
      setMessage(responsePriceList.data)
      window.location.reload()
      
    } catch (error) {
      console.log(error)
      setLoading(false)
      setMessage('')
      if(error) error.response ? setError(error.response.data) : setError('There was an error updating the price list')
    }
  }
  
  return (
    <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{update ? 'Edit Price List' : 'New Price List'}</span>
          <div onClick={() => (setmodal(''), setError(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <div className="addFieldItems-modal-form-container">
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddPriceList(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="brand_price_list">Brand</label>
              <textarea id="brand_price_list" rows="1" name="brand_price_list" placeholder="(Brand)" value={priceList.brand} onChange={(e) => (setError(''), setMessage(''), createPrice('brand', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Brand)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="model_price_list">Model</label>
              <textarea id="model_price_list" rows="1" name="model_price_list" placeholder="(Model)" value={priceList.model} onChange={(e) => (setError(''), setMessage(''), createPrice('model', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Model)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="color_price_list">Color</label>
              <textarea id="color_price_list" rows="1" name="color_price_list" placeholder="(Color)" value={priceList.color} onChange={(e) => (setError(''), setMessage(''), createPrice('color', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Color)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="price">Price</label>
              <textarea id="price" rows="1" name="price" placeholder="(0.00)" value={priceList.price} onChange={(e) => (setError(''), setMessage(''), createPrice('price', validateIsPrice(e)))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(0.00)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-upload">
            <label htmlFor="files_upload"><SVGs svg={'upload'}/> {priceList.images.length > 0 ? priceList.images[0].name ? priceList.images[0].name : priceList.images[0].location.substring(0, 40) : ' Upload'}</label>
            <input type="file" id="files_upload" accept="image/*" onChange={(e) => priceList.images.length > 0 ? priceList.images[0].location ? (deletePriceImage([...priceList.images]), addPriceImage([...e.target.files])) : addPriceImage([...e.target.files]) : addPriceImage([...e.target.files]) }/>
          </div>
        </form>
        </div>
        {message && <div className="form-message">{message}</div>}
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        {!update && <button onClick={(e) => submitAddPriceList(e)} className="form-button w100">{!loading && <span>Add Price List</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {update == 'price_list' && <button onClick={(e) => updatePriceList(e)} className="form-button w100">{!loading && <span>Update Price List</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    priceList: state.priceList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createPrice: (name, data) => dispatch({type: 'CREATE_PRICE_LIST', name: name, value: data}),
    addPriceImage: (data) => dispatch({type: 'PRICE_LIST_IMAGE', value: data}),
    deletePriceImage: (data) => dispatch({type: 'DELETE_LIST_IMAGE', value: data}),
    resetPrice: () => dispatch({type: 'RESET_PRICE_LIST'}),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PriceList)
