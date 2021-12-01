import {useState, useEffect} from 'react'
import SVGs from '../../files/svgs'
import axios from 'axios'
import {API} from '../../config'

const PriceList = ({setmodal}) => {
  
  const [edit, setEdit] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState('')

  const onPointerDown = () => {}
  const onPointerUp = () => {}
  const onPointerMove = () => {}
  const [isDragging, setIsDragging] = useState(false)

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const handlePointerDown = (e) => {
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
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY
    });
  };

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|/.\n\r]/g

    input.value = input.value.split(regex).join('')
  }

  const submitAddPriceList = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const responsePriceList = await axios.post(`${API}/transaction/create-price-list`, {brand: brand, model: model, color: color, price: price.replace('$', '')})
      setLoading(false)
      setError('')
      setModel('')
      setColor('')
      setPrice('')
      setBrand('')
      setMessage(responsePriceList.data)
    } catch (error) {
      console.log(error)
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
  
  return (
    <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Price List' : 'New Price List'}</span>
          <div onClick={() => (setmodal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <div className="addFieldItems-modal-form-container">
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddPriceList(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="brand_price_list">Brand</label>
              <textarea id="brand_price_list" rows="1" name="brand_price_list" placeholder="(Brand)" value={brand} onChange={(e) => (setError(''), setMessage(''), setBrand(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Brand)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="model_price_list">Model</label>
              <textarea id="model_price_list" rows="1" name="model_price_list" placeholder="(Model)" value={model} onChange={(e) => (setError(''), setMessage(''), setModel(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Model)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="color_price_list">Color</label>
              <textarea id="color_price_list" rows="1" name="color_price_list" placeholder="(Color)" value={color} onChange={(e) => (setError(''), setMessage(''), setColor(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Color)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="price">Price</label>
              <textarea id="price" rows="1" name="price" placeholder="(0.00)" value={price} onChange={(e) => (setError(''), setMessage(''), setPrice(validateIsPrice(e)))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(0.00)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
        </form>
        </div>
        {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Price List</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {message && <div className="form-message">{message}</div>}
        {/* {edit == 'category' && <button onClick={(e) => updateCategory(e)} className="form-button w100">{!loading && <span>Update Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>} */}
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
      </div>
    </div>
  )
}

export default PriceList
