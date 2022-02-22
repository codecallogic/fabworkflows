import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import {manageFormFields} from '../../helpers/forms'

const Form = ({
  token,
  title,
  dynamicSVG,
  setDynamicSVG,
  setModal,
  message, 
  setMessage,
  loading,
  setLoading,
  edit,
  setEdit,

  //// VALIDATIONS
  validateNumber,
  validateSize,
  validatePrice,
  validateDate,
  generateQR,
  multipleImages,
  dateNow,

  //// DATA
  typeOfData,
  allData,
  setAllData,
  originalData,
  editData,
  
  //// REDUX
  stateData,
  stateMethod,
  resetState,
  addImages,
  changeView,

  ///// CRUD
  submitCreate,
  submitUpdate,
  submitDeleteFile
}) => {

  const createType = 'CREATE_REMNANT'
  const resetType = 'RESET_REMNANT'
  const imagesType = 'ADD_REMNANT_IMAGES'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('black')
  const [input_dropdown, setInputDropdown] = useState('')
  const [save, setSave] = useState(false)

  useEffect(() => {
    
    const isEmpty = Object.values(stateData).every( x => x === '' || x.length < 1)
    
    if(!isEmpty) return (setMessage(''), setSave(true))
    if(isEmpty) return setSave(false)

  }, [stateData])

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
  
  return (
    <div className="table-stack">
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">{edit == typeOfData ? 'Edit Remnant' : title}</div>
        {save &&
          <div className="table-header-controls">
            <div 
            id="save" 
            className="table-header-controls-item" 
            onClick={(e) => edit == typeOfData ? 
              submitUpdate(e, stateData, 'remnants', setMessage, 'create_remnant', setLoading, token, 'remnants/update-remnant', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'remnants')
              : 
              submitCreate(e, stateData, 'remnants', setMessage, 'create_remnant', setLoading, token, 'remnants/create-remnant', resetType, resetState, allData, setAllData, setDynamicSVG) 
            }
            >
              {loading == 'create_remnant' ? 
              <div className="loading">
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
              </div>
              : 
                edit == typeOfData ? 'Update' : 'Save'
              }
            </div>
            <div 
            id="reset" 
            className="table-header-controls-item" 
            onClick={() => (setLoading(''), resetState(resetType), setMessage(''), setEdit(''))}
            >
              Reset
            </div>
          </div>
        }
        { message && 
          <div className="table-header-error">
            <SVG svg={dynamicSVG}></SVG> 
            <span>{message.substr(0, 200)}</span>
          </div>
        }
      </div>
      <form className="table-forms" onSubmit={null}>





        <div className="form-box" style={{width: '49%'}}>
          <div className="form-box-heading"></div>
          <div className="form-box-container">
            <div className="form-group">
              <input 
              id="name" 
              value={stateData.name} 
              onChange={(e) => stateMethod(createType, 'name', e.target.value)}/>
              <label 
              className={`input-label ` + (
                stateData.name.length > 0 || 
                typeof stateData.name == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="name">
                Name
              </label>
            </div>
            <div className="form-group">
              <input
              onClick={() => setInputDropdown('remnant_material')} 
              value={manageFormFields(stateData.material, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'material', e.target.value))}/>
              <label 
              className={`input-label ` + (
                stateData.material.length > 0 || 
                typeof stateData.material == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="material">
                Material
              </label>
              <div 
              onClick={() => setInputDropdown('remnant_material')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'remnant_material' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={() => (setInputDropdown(''), setModal('add_material'))}>
                    <SVG svg={'plus'}></SVG> 
                    Add new
                  </div>
                  {originalData && originalData.materials.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                  <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'material', item), setInputDropdown(''))}>
                    {item.name}
                  </div>
                  ))}
                </div>
              }
            </div>
            <div className="form-group">
                <input 
                onClick={() => setInputDropdown('remnant_color')} 
                value={manageFormFields(stateData.color, 'name')} 
                onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'color', e.target.value))}/>
                <label 
                 className={`input-label ` + (
                  stateData.color.length > 0 || 
                  typeof stateData.color == 'object' 
                  ? ' labelHover' 
                  : ''
                )}
                htmlFor="color">
                  Color
                </label>
                <div 
                onClick={() =>setInputDropdown('remnant_color') }>
                <SVG svg={'dropdown-arrow'}></SVG>
                </div>
                { input_dropdown == 'remnant_color' &&
                  <div 
                  className="form-group-list" 
                  ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={() => (setInputDropdown(''), setModal('add_color'))}>
                    <SVG svg={'plus'}></SVG> 
                    Add new
                  </div>
                    {originalData && originalData.colors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                    <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'color', item), setInputDropdown(''))}>
                      {item.name}
                    </div>
                    ))}
                  </div>
                }
            </div>
            <div className="form-group">
              <input 
                id="lot" 
                value={stateData.lot} 
                onChange={(e) => (validateNumber('lot'), stateMethod(createType, 'lot', e.target.value))}
              />
             <label 
              className={`input-label ` + (
                stateData.lot.length > 0 || 
                typeof stateData.lot == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="lot">
                Lot / Block
              </label>
            </div>
            <div className="form-group">
              <input 
              id="bundle" 
              value={stateData.bundle} 
              onChange={(e) => stateMethod(createType, 'bundle', e.target.value)}/>
              <label 
              className={`input-label ` + (
                stateData.bundle.length > 0 || 
                typeof stateData.bundle == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="bundle">
                Bundle
              </label>
            </div>
            <div className="form-group">
            <input 
              id="supplier_ref" 
              value={stateData.supplier_ref} 
              onChange={(e) => stateMethod(createType, 'supplier_ref', e.target.value)}/>
              <label 
              className={`input-label ` + (
                stateData.supplier_ref.length > 0 || 
                typeof stateData.supplier_ref == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="supplier_ref">
                Supplier Ref
              </label>
            </div>
            </div> 
        </div>




        <div className="form-box" style={{width: '49%'}}>
          <div className="form-box-heading"></div>
          <div className="form-box-container">
          <div className="form-group">
              <input 
                id="bin" 
                value={stateData.bin} 
                onChange={(e) => (validateNumber('bin'), stateMethod(createType, 'bin', e.target.value))}
              />
             <label 
              className={`input-label ` + (
                stateData.bin.length > 0 || 
                typeof stateData.bin == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="bin">
                Bin #
              </label>
          </div>
          <div className="form-group">
              <input
              onClick={() => setInputDropdown('remnant_shape')} 
              value={stateData.shape} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'shape', e.target.value))}/>
              <label 
              className={`input-label ` + (
                stateData.shape.length > 0 || 
                typeof stateData.shape == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="shape">
                Shape
              </label>
              <div 
              onClick={() => setInputDropdown('remnant_shape')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'remnant_shape' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'shape', e.target.innerText))}>
                    Remnant L Right
                  </div>
                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'shape', e.target.innerText))}>
                    Remnant L Left
                  </div>
                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'shape', e.target.innerText))}>
                    Remnant Rectangular
                  </div>
                </div>
              }
            </div>
            <div className="form-group">
              <input 
                id="l1" 
                value={stateData.l1} 
                onChange={(e) => (validateSize(e, 'l1', createType, stateMethod), stateMethod(createType, 'l1', e.target.value))}
              />
             <label 
              className={`input-label ` + (
                stateData.l1.length > 0 || 
                typeof stateData.l1 == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="l1">
                L1
              </label>
            </div>
            <div className="form-group">
              <input 
                id="w1" 
                value={stateData.w1} 
                onChange={(e) => (validateSize(e, 'w1', createType, stateMethod), stateMethod(createType, 'w1', e.target.value))}
              />
             <label 
              className={`input-label ` + (
                stateData.w1.length > 0 || 
                typeof stateData.w1 == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="w1">
                W1
              </label>
            </div>
            <div className="form-group">
              <input 
                id="l2" 
                value={stateData.l2} 
                onChange={(e) => (validateSize(e, 'l2', createType, stateMethod), stateMethod(createType, 'l2', e.target.value))}
              />
             <label 
              className={`input-label ` + (
                stateData.l2.length > 0 || 
                typeof stateData.l2 == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="l2">
                L2
              </label>
            </div>
            <div className="form-group">
              <input 
                id="w2" 
                value={stateData.w2} 
                onChange={(e) => (validateSize(e, 'w2', createType, stateMethod), stateMethod(createType, 'w2', e.target.value))}
              />
             <label 
              className={`input-label ` + (
                stateData.w2.length > 0 || 
                typeof stateData.w2 == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="w2">
                W2
              </label>
            </div>
          </div> 
        </div>






        <div className="form-box" style={{width: '33%'}}>
          <div className="form-box-heading"></div>
          <div className="form-box-container">
          <div className="form-group-textarea">
            <label 
            className={stateData.notes.length > 0 ? ' labelHover' : ''}>
              Notes
            </label>
            <textarea 
              id="notes" 
              rows="5" 
              wrap="hard" 
              maxLength="400"
              name="notes" 
              value={stateData.notes} 
              onChange={(e) => stateMethod(createType, 'notes', e.target.value)} 
            />
          </div>
         <button className="form-group-button" onClick={(e) => generateQR(e, 'remnantQRCode', stateData, createType, stateMethod, setMessage, setDynamicSVG)}>Generate</button>
          {!stateData.qr_code && 
            <img 
            className="form-group-image" 
            src='https://free-qr.com/images/placeholder.svg' 
            alt="QR Code"
            />
          }
          {stateData.qr_code && 
            <a
            className="form-group-image"
            download="qr-code.png" 
            href={stateData.qr_code} 
            alt="QR Code" 
            title="QR-code"
            >
              <img 
              src={stateData.qr_code} 
              alt="QR Code" 
              className="form-group-image"
              />
            </a>
          }
          </div>
        </div>




         <div className="form-box" style={{width: '66%'}}>
          <div className="form-box-heading">
            <label htmlFor="imageFiles" className="form-box-heading-item">
              <SVG svg={'upload'}></SVG> Upload Images
              <input 
              id="imageFiles" 
              type="file" 
              accept="image/*" 
              multiple
              onChange={(e) => multipleImages(e, stateData, setMessage, imagesType, null, addImages)}
              />
            </label>
          </div>
          <div className="form-box-container">
            <div className="form-group-gallery">
              { stateData.images.length == 0 &&
                 <a 
                 className="form-group-gallery-link"
                 target="_blank" 
                 rel="noreferrer"
                 style={{width: '48%'}}
                 >
                   <img 
                   className="form-group-gallery-image"
                   src='https://via.placeholder.com/300'
                   />
                 </a>
              }
              {stateData.images.length > 0 && stateData.images.map((item, idx) => (
                <a 
                key={idx} 
                onClick={() => window.open(item.location, '_blank')}
                className="form-group-gallery-link"
                target="_blank" 
                rel="noreferrer"
                style={{width: '48%'}}
                >
                  <img 
                  className="form-group-gallery-image"
                  src={item.location}
                  />
                  <span onClick={(e) => (e.stopPropagation(), loading !== 'delete_image' ? 
                    submitDeleteFile(e, item, 'images', createType, stateMethod, stateData, 'remnants', setMessage, 'delete_image', setLoading, token, 'remnants/delete-image', allData, setAllData, setDynamicSVG, editData) 
                    : null)
                  }>
                    { loading == 'delete_image' ? 
                      <div className="loading-spinner"></div>
                      :
                      <SVG svg={'close'}></SVG>
                    }
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </form>
    </div>
    <div className="clientDashboard-view-slab_form-shapes">
      <div className="clientDashboard-view-slab_form-shapes-container">
        <div className="clientDashboard-view-slab_form-shapes-item">
          <div className="clientDashboard-view-slab_form-shapes-item-box">
            <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Right L</div>
            <div className="clientDashboard-view-slab_form-shapes-item-box-container">
              <div className="clientDashboard-view-slab_form-shapes-item-box-remnant">
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse">
                  <SVG svg={'arrow-left'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse-svg_1'}></SVG>
                  <SVG svg={'arrow-right'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse-svg_2'}></SVG>

                  <SVG svg={'arrow-bottom'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse-svg_3'}></SVG>
                  <SVG svg={'arrow-top'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse-svg_4'}></SVG>

                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-right-reverse-top remnant-right-reverse-l2">
                    <SVG svg={'arrow-left'} classprop={'remnant-right-reverse-l2-svg_1'}></SVG>
                    <SVG svg={'arrow-right'} classprop={'remnant-right-reverse-l2-svg_2'}></SVG>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-right-reverse-bottom remnant-right-reverse-w2">
                    <SVG svg={'arrow-top'} classprop={'remnant-right-reverse-w2-svg_1'}></SVG>
                    <SVG svg={'arrow-bottom'} classprop={'remnant-right-reverse-w2-svg_2'}></SVG>
                  </div>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-right">
                  <SVG svg={'arrow-left'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-svg_1'}></SVG>
                  <SVG svg={'arrow-right'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-svg_2'}></SVG>

                  <SVG svg={'arrow-bottom'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-svg_3'}></SVG>
                  <SVG svg={'arrow-top'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-svg_4'}></SVG>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-right-top remnant-right-l2">
                    <SVG svg={'arrow-top'} classprop={'remnant-right-l2-svg_1'}></SVG>
                    <SVG svg={'arrow-bottom'} classprop={'remnant-right-l2-svg_2'}></SVG>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-right-bottom remnant-right-w2">
                    <SVG svg={'arrow-left'} classprop={'remnant-right-w2-svg_1'}></SVG>
                    <SVG svg={'arrow-right'} classprop={'remnant-right-w2-svg_2'}></SVG>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_form-shapes-item-box">
            <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Left L</div>
            <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse">
                  <SVG svg={'arrow-left'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse-svg_1'}></SVG>
                  <SVG svg={'arrow-right'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse-svg_2'}></SVG>
                  <SVG svg={'arrow-bottom'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse-svg_3'}></SVG>
                  <SVG svg={'arrow-top'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse-svg_4'}></SVG>

                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-left-reverse-top remnant-left-reverse-l2">
                    <SVG svg={'arrow-left'} classprop={'remnant-left-reverse-l2-svg_1'}></SVG>
                    <SVG svg={'arrow-right'} classprop={'remnant-left-reverse-l2-svg_2'}></SVG>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-left-reverse-bottom remnant-left-reverse-w2">
                    <SVG svg={'arrow-top'} classprop={'remnant-left-reverse-w2-svg_1'}></SVG>
                    <SVG svg={'arrow-bottom'} classprop={'remnant-left-reverse-w2-svg_2'}></SVG>
                  </div>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-left">
                  <SVG svg={'arrow-left'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-svg_1'}></SVG>
                  <SVG svg={'arrow-right'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-svg_2'}></SVG>
                  <SVG svg={'arrow-bottom'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-svg_3'}></SVG>
                  <SVG svg={'arrow-top'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-svg_4'}></SVG>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-left-top remnant-left-l2">
                    <SVG svg={'arrow-top'} classprop={'remnant-left-l2-svg_1'}></SVG>
                    <SVG svg={'arrow-bottom'} classprop={'remnant-left-l2-svg_2'}></SVG>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-left-bottom remnant-left-w2">
                    <SVG svg={'arrow-left'} classprop={'remnant-left-w2-svg_1'}></SVG>
                    <SVG svg={'arrow-right'} classprop={'remnant-left-w2-svg_2'}></SVG>
                  </div>
                </div>
          </div>
          <div className="clientDashboard-view-slab_form-shapes-item-box">
            <div className="clientDashboard-view-slab_form-shapes-item-box-container">
              <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-box">
                <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Rectangular </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-box">
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-rectangle-top">
                    <SVG svg={'arrow-left'} classprop={'remnant-rectangle-top-svg_1'}></SVG>
                    <SVG svg={'arrow-right'} classprop={'remnant-rectangle-top-svg_2'}></SVG>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-rectangle-bottom">
                    <SVG svg={'arrow-top'} classprop={'remnant-rectangle-bottom-svg_1'}></SVG>
                    <SVG svg={'arrow-bottom'} classprop={'remnant-rectangle-bottom-svg_2'}></SVG>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Form
