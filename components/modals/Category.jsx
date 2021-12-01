import {useState, useEffect} from 'react'
import SVGs from '../../files/svgs'
import axios from 'axios'
import {API} from '../../config'

const Category = ({setmodal}) => {
  
  const [edit, setEdit] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('')
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

  const submitAddCategory = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseCategory = await axios.post(`${API}/transaction/create-category`, {name: category})
      setLoading(false)
      setCategory('')
      setError('')
      setMessage(responseCategory.data)
    } catch (error) {
      setLoading(false)
      setMessage('')
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error occured creating the category.')
    }
  }
  
  return (
    <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Price List' : 'New Category'}</span>
          <div onClick={() => (setmodal(''), setError(''), setMessage(''),setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <div className="addFieldItems-modal-form-container">
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddCategory(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="category_name">Category Name</label>
              <textarea id="category_name" rows="1" name="category_name" placeholder="(Category Name)" value={category} onChange={(e) => (setError(''), setMessage(''), setCategory(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Category Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          {/* {error && <div className="form-error">{error}</div>} */}

          {/* {edit == 'category' && <button onClick={(e) => updateCategory(e)} className="form-button w100">{!loading && <span>Update Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>} */}
        </form>
        </div>
        {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {message && <div className="form-message">{message}</div>}
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
      </div>
    </div>
  )
}

export default Category
