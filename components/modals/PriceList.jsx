import {useState, useEffect} from 'react'
import SVGs from '../../files/svgs'
import axios from 'axios'
import {API} from '../../config'

const PriceList = ({setmodal}) => {
  
  const [edit, setEdit] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [tax, setTax] = useState('')
  const [loading, setLoading] = useState('')

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|/.\n\r]/g

    input.value = input.value.split(regex).join('')
  }

  const submitAddPriceList = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responsePriceList = await axios.post(`${API}/transaction/create-price-list`, {name: name, tax: tax})
      setLoading(false)
      setTax('')
      setName('')
      setMessage(responsePriceList.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('There was an error creating the price list')
    }
  }
  
  return (
    <div className="addFieldItems-modal">
      <div className="addFieldItems-modal-box">
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Price List' : 'New Price List'}</span>
          <div onClick={() => (setmodal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddPriceList(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name_price_list">Price List Name</label>
              <textarea id="name_price_list" rows="1" name="name_price_list" placeholder="(Price List Name)" value={name} onChange={(e) => (setError(''), setMessage(''), setName(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Price List Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="tax">Tax %</label>
              <textarea id="tax" rows="1" name="tax" placeholder="(Tax)" value={tax} onChange={(e) => (setError(''), setMessage(''), validateIsNumber('tax'), setTax(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Tax)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Price List</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {message && <div className="form-message">{message}</div>}
          {error && <div className="form-error">{error}</div>}

          {/* {edit == 'category' && <button onClick={(e) => updateCategory(e)} className="form-button w100">{!loading && <span>Update Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>} */}
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        </form>
      </div>
    </div>
  )
}

export default PriceList
