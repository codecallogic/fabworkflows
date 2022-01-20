import {useState, useEffect} from 'react'

const MaterialModal = ({
  modal,
  setModal,
  message,
  setMessage,
  resetState,
  
}) => {

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
          className="addFieldItems-modal-form-title">{edit ? 'Edit Material' : 'New Material'}
        </span>
        <div onClick={() => (setModal(''), resetMaterial(), setMessage(''))}><SVGs svg={'close'}></SVGs></div>
      </div>
      <form 
      className="addFieldItems-modal-form" 
      onSubmit={(e) => submitAddMaterial(e)}
      >
        <div className="form-group-single-textarea">
          <div className="form-group-single-textarea-field">
            <label htmlFor="name_material">Name</label>
            <textarea id="name_material" rows="1" name="name_material" placeholder="(Material Name)" value={material.name} onChange={(e) => addMaterial('name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Material Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
          </div>
        </div>
        <div className="form-group-single-textarea">
          <label htmlFor="material_description">Description</label>
          <div className="form-group-single-textarea-field">
            <textarea rows="5" wrap="wrap" name="description" placeholder="(Material Description)" value={material.description} onChange={(e) => addMaterial('description', e.target.value)}></textarea>
          </div>
        </div>
        {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Material</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {edit == 'material' && <button onClick={(e) => updateMaterial(e)} className="form-button w100">{!loading && <span>Update Material</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
      </form>
    </div>
    </div>
  )
}

export default MaterialModal
