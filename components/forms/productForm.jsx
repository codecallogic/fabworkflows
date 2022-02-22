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
  validatePrice,
  validateDate,
  generateQR,
  multipleFiles,
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

  const createType = 'CREATE_PRODUCT'
  const resetType = 'RESET_PRODUCT'
  const imagesType = 'ADD_PRODUCT_IMAGES'
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
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">{edit == typeOfData ? 'Edit Product' : title}</div>
        {save &&
          <div className="table-header-controls">
            <div 
            id="save" 
            className="table-header-controls-item" 
            onClick={(e) => edit == typeOfData ? 
              submitUpdate(e, stateData, 'products', setMessage, 'create_product', setLoading, token, 'products/update-product', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'products')
              : 
              submitCreate(e, stateData, 'products', setMessage, 'create_product', setLoading, token, 'products/create-product', resetType, resetState, allData, setAllData, setDynamicSVG) 
            }
            >
              {loading == 'create_product' ? 
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
              onClick={() => setInputDropdown('product_brand')} 
              value={manageFormFields(stateData.brand, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'brand', e.target.value))}/>
              <label 
              className={`input-label ` + (
                stateData.brand.length > 0 || 
                typeof stateData.brand == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="brand">
                Brand
              </label>
              <div 
              onClick={() => setInputDropdown('product_brand')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'product_brand' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={() => (setInputDropdown(''), setModal('add_brand'))}>
                    <SVG svg={'plus'}></SVG> 
                    Add new
                  </div>
                  {originalData && originalData.brands.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                  <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'brand', item), setInputDropdown(''))}>
                    {item.name}
                  </div>
                  ))}
                </div>
              }
            </div>
            <div className="form-group">
                <input 
                onClick={() => setInputDropdown('product_model')} 
                value={manageFormFields(stateData.model, 'name')} 
                onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'model', e.target.value))}/>
                <label 
                 className={`input-label ` + (
                  stateData.model.length > 0 || 
                  typeof stateData.model == 'object' 
                  ? ' labelHover' 
                  : ''
                )}
                htmlFor="model">
                  Model
                </label>
                <div 
                onClick={() =>setInputDropdown('product_model') }>
                <SVG svg={'dropdown-arrow'}></SVG>
                </div>
                { input_dropdown == 'product_model' &&
                  <div 
                  className="form-group-list" 
                  ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={() => (setInputDropdown(''), setModal('add_model'))}>
                    <SVG svg={'plus'}></SVG> 
                    Add new
                  </div>
                    {originalData && originalData.models.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                    <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'model', item), setInputDropdown(''))}>
                      {item.name}
                    </div>
                    ))}
                  </div>
                }
            </div>
            <div className="form-group">
                <input 
                onClick={() => setInputDropdown('product_category')} 
                value={manageFormFields(stateData.category, 'name')} 
                onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'category', e.target.value))}/>
                <label 
                 className={`input-label ` + (
                  stateData.category.length > 0 || 
                  typeof stateData.category == 'object' 
                  ? ' labelHover' 
                  : ''
                )}
                htmlFor="category">
                  Category
                </label>
                <div 
                onClick={() =>setInputDropdown('product_category') }>
                <SVG svg={'dropdown-arrow'}></SVG>
                </div>
                { input_dropdown == 'product_category' &&
                  <div 
                  className="form-group-list" 
                  ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={() => (setInputDropdown(''), setModal('add_category'))}>
                    <SVG svg={'plus'}></SVG> 
                    Add new
                  </div>
                    {originalData && originalData.categories.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                    <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'category', item), setInputDropdown(''))}>
                      {item.name}
                    </div>
                    ))}
                  </div>
                }
            </div>
          </div>
        </div>




       <div className="form-box" style={{width: '49%'}}>
          <div className="form-box-heading"></div>
          <div className="form-box-container">
          <div className="form-group">
            <input 
            onClick={() => setInputDropdown('product_location')} 
            value={manageFormFields(stateData.location, 'name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'location', e.target.value))}/>
            <label 
              className={`input-label ` + (
              stateData.location.length > 0 || 
              typeof stateData.location == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="location">
              Location
            </label>
            <div onClick={() => setInputDropdown('product_location')}>
            <SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'product_location' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
              <div 
              className="form-group-list-item" 
              onClick={() => (setInputDropdown(''), setModal('add_location'))}>
                <SVG svg={'plus'}></SVG> 
                Add new
              </div>
                {originalData && originalData.locations.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div 
                key={idx} 
                className="form-group-list-item" 
                onClick={(e) => (stateMethod(createType, 'location', item), setInputDropdown(''))}>
                  {item.name}
                </div>
                ))}
              </div>
            }
          </div>
          <div className="form-group">
            <input 
              id="quantity" 
              value={stateData.quantity} 
              onChange={(e) => (validateNumber('quantity'), stateMethod(createType, 'quantity', e.target.value))}
            />
            <label 
            className={`input-label ` + (
              stateData.quantity.length > 0 || 
              typeof stateData.quantity == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="quantity">
              Quantity
            </label>
          </div>
          
          <div className="form-group">
            <input 
            id="price" 
            value={stateData.price} 
            onChange={(e) => (stateMethod(createType, 'price', validatePrice(e)))}/>
            <label 
            className={`input-label ` + (
              stateData.price.length > 0 || 
              typeof stateData.price == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="price">
              Price
            </label>
          </div>
          </div>
        </div>






        <div className="form-box" style={{width: '33%'}}>
          <div className="form-box-heading"></div>
          <div className="form-box-container">
            <div className="form-group-textarea">
              <label 
              className={stateData.description.length > 0 ? ' labelHover' : ''}>
                Description
              </label>
              <textarea 
                id="description" 
                rows="5" 
                wrap="hard" 
                maxLength="400"
                name="description" 
                value={stateData.description} 
                onChange={(e) => stateMethod(createType, 'description', e.target.value)} 
              />
            </div>
            <button className="form-group-button" onClick={(e) => generateQR(e, 'productQRCode', stateData, createType, stateMethod, setMessage, setDynamicSVG)}>Generate</button>
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
              onChange={(e) => multipleFiles(e, stateData, 'images', setMessage, imagesType, 'images', addImages)}
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
                    submitDeleteFile(e, item, 'images', createType, stateMethod, stateData, 'products', setMessage, 'delete_image', setLoading, token, 'products/delete-image', allData, setAllData, setDynamicSVG, editData) 
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
  )
}

export default Form
