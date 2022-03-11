import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { 
  validateNumber, 
  validatePrice, 
  filterProductSearch, 
  filterPriceListSearch, 
  filterSlabSearch,
  filterRemnantSearch 
} from '../../helpers/validations'
import { manageFormFields } from '../../helpers/forms'

const QuoteLineModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  setEdit,
  dynamicSVG,
  setDynamicSVG,
  modalEdit,
  setModalEdit,

  //// DATA
  allData,
  setAllData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  typeForm,

  //// CRUD
  submitCreate,
  submitUpdate
}) => {
  
  const createType            = 'CREATE_QUOTE_LINE'
  const resetType             = 'RESET_QUOTE_LINE'
  const addQuoteLineType      = 'ADD_QUOTE_LINE'
  const updateQuoteLineType   = 'UPDATE_QUOTE_LINE'
  const deleteQuoteLineType   = 'DELETE_QUOTE_LINE'
  const changeFormType        = 'CHANGE_FORMTYPE'
  const [loadingColor, setLoadingColor] = useState('white')

  //// QUOTE LINE
  const [searchItems, setSearchItems] = useState(false)
  const [search, setSearch] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
   

  //// DROPDOWNS
  const myRefs = useRef(null)
  const [input_dropdown, setInputDropdown] = useState('')

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
          className="addFieldItems-modal-form-title">
            {modalEdit == 'quote_line' ? 
            'Edit Quote Line' 
            : 
            'New Quote Line'
            }
        </span>


        {/* {edit == '' &&  */}
        <div className="form-group-search modal-search">
          <form autoComplete="off">
            <input 
            type="text" 
            name="search" 
            placeholder="Search items"
            value={search} 
            onChange={(e) => (
              setSearchItems(true), 
              setSearch(e.target.value)
            )}
            onFocus={(e) => (
              setSearchItems(true), 
              e.target.placeholder = ''
            )} 
            onBlur={(e) => (e.target.placeholder = 'Search')}
            />
          </form>
        </div>
        {/* } */}

        {modalEdit == 'quote_line' && typeForm !== '' &&
        <div onClick={() => (
            setModal(''), 
            setMessage(''),
            resetState(resetType), 
            stateMethod(deleteQuoteLineType, null, stateData.idx),
            stateMethod(changeFormType, null, '')
          )}>
          <SVG svg={'thrash-can'}></SVG>
        </div>
        }

        {typeForm == '' && 
        <div onClick={() => (
            setModal(''), 
            resetState(resetType), 
            setMessage('')
          )}>
          <SVG svg={'close'}></SVG>
        </div>
        }

        {typeForm !== '' && 
        <div onClick={() => (
            stateMethod(changeFormType, null, ''), 
            resetState(resetType),
            setModalEdit('')
          )}>
          <SVG svg={'arrow-left-large'}></SVG>
        </div>
        }


      </div>
      <form 
      className="addFieldItems-modal-form" 
      >
          { typeForm == '' && 
            <>
            {/* <div className="form-group-button" onClick={() => (
              null
            )}>
              Materials
            </div> */}
            <div className="form-group-button" onClick={() => (
              stateMethod(changeFormType, null, 'product'),
              stateMethod(createType, 'typeForm', 'product')
            )}>
              Products
            </div>
            <div className="form-group-button" onClick={() => (
              null
            )}>
              Cutouts
            </div>
            <div className="form-group-button" onClick={() => (
              null
            )}>
              Edges
            </div>
            <div className="form-group-button" onClick={() => (
              null
            )}>
              Services
            </div>
            <div className="form-group-button" onClick={() => (
              stateMethod(changeFormType, null, 'miscellaneous'),
              stateMethod(createType, 'typeForm', 'miscellaneous')
            )}>
              Miscellaneous Item
            </div>
            {/* <div className="form-group-button" onClick={() => (
              stateMethod(changeFormType, null, 'priceList'),
              stateMethod(createType, 'typeForm', 'priceList')
            )}>
              Price List
            </div> */}
            <div className="form-group-button" onClick={() => (
              null
            )}>
              Text
            </div>
            </>
          }

          {searchItems && 
          <div className="addFieldItems-modal-form-container-searchList">
            <div className="addFieldItems-modal-form-container-searchList-categories-container">
              <div className="addFieldItems-modal-form-container-searchList-categories">
                <span 
                className={`addFieldItems-modal-form-container-searchList-categories-item ` + (filterSearch == 'products' ? 'categoryClicked' : '')} 
                onClick={() => 
                  filterSearch == 'products' 
                  ? setFilterSearch('') 
                  : setFilterSearch('products')
                }>
                  Products
                </span>
                <span 
                className={`addFieldItems-modal-form-container-searchList-categories-item ` + (filterSearch == 'slabs' ? ' categoryClicked' : '')} 
                onClick={() => 
                  filterSearch == 'slabs' 
                  ? setFilterSearch('') 
                  : setFilterSearch('slabs')
                }>
                  Slabs
                </span>
                <span 
                className={`addFieldItems-modal-form-container-searchList-categories-item ` + (filterSearch == 'remnants' ? ' categoryClicked' : '')} 
                onClick={() => 
                  filterSearch == 'remnants' 
                  ? setFilterSearch('') 
                  : setFilterSearch('remnants')
                }>
                  Remnants
                </span>
                <span 
                className={`addFieldItems-modal-form-container-searchList-categories-item ` + (filterSearch == 'priceLists' ? ' categoryClicked' : '')} 
                onClick={() => 
                  filterSearch == 'priceLists' 
                  ? setFilterSearch('') 
                  : setFilterSearch('priceLists')
                }>
                  Price List
                </span>
              </div>
              <span 
                onClick={() => setSearchItems(false)}
              >
                <SVG svg={'close'}></SVG>
              </span>
            </div>
            <div className="addFieldItems-modal-form-container-searchList-container">
              { (filterSearch == 'products' || filterSearch == '') &&
              <>
              <div className="addFieldItems-modal-form-container-searchList-header">
                Products
              </div>
              <div className="addFieldItems-modal-form-container-searchList-list">
                { allData && allData.products.map((item, idx) => 
                  search.length > 0 ? 
                  filterProductSearch(item, search) ? 
                    <div 
                    key={idx}
                    className="addFieldItems-modal-form-container-searchList-list-item" 
                    onClick={() => (
                      setSearchItems(false),
                      stateMethod(createType, 'typeForm', 'product'), 
                      stateMethod(createType, 'brand', item.brand[0]), 
                      stateMethod(createType, 'model', item.model[0]), 
                      stateMethod(createType, 'category', item.category[0]), stateMethod(createType, 'description', item.description), 
                      stateMethod(createType, 'price', item.price),
                      stateMethod(changeFormType, null, 'product'),
                      setModalEdit('')
                    )}>
                    {` 
                      ${manageFormFields(item.brand[0], 'name')}
                      ${ manageFormFields(item.category[0], 'name') ? ` / ${manageFormFields(item.category[0], 'name')}` : ''}
                      ${ manageFormFields(item.model[0], 'name') ? ` / ${manageFormFields(item.model[0], 'name')}` : ''}
                    `}

                    </div>
                  : 
                    null
                  :
                  <div 
                  key={idx} 
                  className="addFieldItems-modal-form-container-searchList-list-item" 
                  onClick={() => (
                      setSearchItems(false),
                      stateMethod(createType, 'typeForm', 'product'), 
                      stateMethod(createType, 'brand', item.brand[0]), 
                      stateMethod(createType, 'model', item.model[0]), 
                      stateMethod(createType, 'category', item.category[0]), stateMethod(createType, 'description', item.description), 
                      stateMethod(createType, 'price', item.price), 
                      // stateMethod(createType, 'price_unformatted',
                      // validatePrice(item.price)),
                      stateMethod(changeFormType, null, 'product'),
                      setModalEdit('')
                    )
                  }>
                    {` 
                      ${manageFormFields(item.brand[0], 'name')}
                      ${ manageFormFields(item.category[0], 'name') ? ` / ${manageFormFields(item.category[0], 'name')}` : ''}
                      ${ manageFormFields(item.model[0], 'name') ? ` / ${manageFormFields(item.model[0], 'name')}` : ''}
                    `}
                  </div>

                ) 
                }
              </div>
              </>
              }
              { (filterSearch == 'priceLists' || filterSearch == '') &&
                <>
                <div className="addFieldItems-modal-form-container-searchList-header">
                  Price List
                </div>
                <div className="addFieldItems-modal-form-container-searchList-list">
                  { allData.prices && allData.prices.map((item, idx) => 
                    search.length > 0 ? 
                    filterPriceListSearch(item, search) ? 
                    <div 
                      key={idx} className="addFieldItems-modal-form-container-searchList-list-item" 
                      onClick={() => (
                          setSearchItems(false),
                          stateMethod(createType, 'typeForm', 'priceList'), 
                          stateMethod(createType, 'supplier', item.supplier[0]),
                          // stateMethod(createType, 'brand', item.brand[0]), 
                          stateMethod(createType, 'model', item.model[0]), 
                          stateMethod(createType, 'color', item.color[0]), stateMethod(createType, 'price', item.price),
                          stateMethod(changeFormType, null, 'priceList'),
                          setModalEdit('')
                        )}>
                        {` 
                          ${manageFormFields(item.supplier[0], 'name')}
                          ${ manageFormFields(item.model[0], 'name') ? ` / ${manageFormFields(item.model[0], 'name')}` : ''}
                          ${ manageFormFields(item.color[0], 'name') ? ` / ${manageFormFields(item.color[0], 'name')}` : ''}
                        `}
                    </div>
                    :
                      null
                    :
                    <div 
                      key={idx} className="addFieldItems-modal-form-container-searchList-list-item" 
                      onClick={() => (
                          setSearchItems(false), 
                          stateMethod(createType, 'typeForm', 'priceList'), 
                          stateMethod(createType, 'supplier', item.supplier[0]), 
                          // stateMethod(createType, 'brand', item.brand[0]), 
                          stateMethod(createType, 'model', item.model[0]), 
                          stateMethod(createType, 'color', item.color[0]), stateMethod(createType, 'price', item.price),
                          stateMethod(changeFormType, null, 'priceList'),
                          setModalEdit('')
                        )
                      }>
                      {` 
                        ${manageFormFields(item.supplier[0], 'name')}
                        ${ manageFormFields(item.model[0], 'name') ? ` / ${manageFormFields(item.model[0], 'name')}` : ''}
                        ${ manageFormFields(item.color[0], 'name') ? ` / ${manageFormFields(item.color[0], 'name')}` : ''}
                      `}
                    </div>
                  ) 
                  }
                </div>
                </>
              }
              { (filterSearch == 'slabs' || filterSearch == '') &&
              <>
              <div className="addFieldItems-modal-form-container-searchList-header">
                Slabs
              </div>
              <div className="addFieldItems-modal-form-container-searchList-list">
                { allData && allData.slabs.map((item, idx) => 
                  search.length > 0 ? 
                  filterSlabSearch(item, search) ? 
                    <div 
                    key={idx}
                    className="addFieldItems-modal-form-container-searchList-list-item" 
                    onClick={() => (
                      setSearchItems(false),
                      stateMethod(createType, 'typeForm', 'slab'), 
                      stateMethod(createType, 'material', item.material[0]), 
                      stateMethod(createType, 'color', item.color[0]), 
                      stateMethod(createType, 'supplier', item.supplier[0]), 
                      stateMethod(createType, 'price', item.price_sqft),
                      stateMethod(changeFormType, null, 'slab'),
                      setModalEdit('')
                    )}>
                    {` 
                      ${manageFormFields(item.material[0], 'name')}
                      ${manageFormFields(item.color[0], 'name') ? ` / ${manageFormFields(item.color[0], 'name')}` : ''}
                      ${manageFormFields(item.supplier[0], 'name') ? ` / ${manageFormFields(item.supplier[0], 'name')}` : ''}
                    `}

                    </div>
                  : 
                    null
                  :
                  <div 
                  key={idx} 
                  className="addFieldItems-modal-form-container-searchList-list-item" 
                  onClick={() => (
                      setSearchItems(false),
                      stateMethod(createType, 'typeForm', 'slab'), 
                      stateMethod(createType, 'material', item.material[0]), 
                      stateMethod(createType, 'color', item.color[0]), 
                      stateMethod(createType, 'supplier', item.supplier[0]), 
                      stateMethod(createType, 'price', item.price_sqft),
                      stateMethod(changeFormType, null, 'slab'),
                      setModalEdit('')
                    )
                  }>
                    {` 
                      ${manageFormFields(item.material[0], 'name')}
                      ${manageFormFields(item.color[0], 'name') ? ` / ${manageFormFields(item.color[0], 'name')}` : ''}
                      ${manageFormFields(item.supplier[0], 'name') ? ` / ${manageFormFields(item.supplier[0], 'name')}` : ''}
                    `}
                  </div>

                ) 
                }
              </div>
              </>
              }
              { (filterSearch == 'remnants' || filterSearch == '') &&
              <>
              <div className="addFieldItems-modal-form-container-searchList-header">
                Remnants
              </div>
              <div className="addFieldItems-modal-form-container-searchList-list">
                { allData && allData.remnants.map((item, idx) => 
                  search.length > 0 ? 
                  filterRemnantSearch(item, search) ? 
                    <div 
                    key={idx}
                    className="addFieldItems-modal-form-container-searchList-list-item" 
                    onClick={() => (
                      setSearchItems(false),
                      stateMethod(createType, 'typeForm', 'remnant'), 
                      stateMethod(createType, 'material', item.material[0]), 
                      stateMethod(createType, 'color', item.color[0]),
                      stateMethod(createType, 'shape', item.shape), 
                      stateMethod(changeFormType, null, 'remnant'),
                      setModalEdit('')
                    )}>
                    {` 
                      ${manageFormFields(item.material[0], 'name')} /
                      ${manageFormFields(item.color[0], 'name') ? ` / ${manageFormFields(item.color[0], 'name')}` : ''}
                      ${item.shape ? ` / ${item.shape}` : ''}
                    `}

                    </div>
                  : 
                    null
                  :
                  <div 
                  key={idx} 
                  className="addFieldItems-modal-form-container-searchList-list-item" 
                  onClick={() => (
                      setSearchItems(false),
                      stateMethod(createType, 'typeForm', 'remnant'), 
                      stateMethod(createType, 'material', item.material[0]), 
                      stateMethod(createType, 'color', item.color[0]),
                      stateMethod(createType, 'shape', item.shape), 
                      stateMethod(changeFormType, null, 'remnant'),
                      setModalEdit('')
                    )
                  }>
                    {` 
                      ${manageFormFields(item.material[0], 'name')} 
                      ${manageFormFields(item.color[0], 'name') ? ` / ${manageFormFields(item.color[0], 'name')}` : ''}
                      ${item.shape ? ` / ${item.shape}` : ''}
                    `}
                  </div>

                ) 
                }
              </div>
              </>
              }
            </div>
          </div>
          }



          { typeForm == 'product' && 
            <>
            <div className="form-group">
              <input 
              onClick={() => setInputDropdown('product_brand')} 
              value={manageFormFields(stateData.brand, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'brand', e.target.value))}/>
              <label 
                className={`input-label ` + (
                  stateData.brand &&
                  stateData.brand.length > 0 || 
                  typeof stateData.brand == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="brand">
                Brand
              </label>
              <div 
              onClick={() =>setInputDropdown('product_brand') }>
              <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'product_brand' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.brands.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
                  stateData.model &&
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
                  {allData && allData.models.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
                  stateData.category &&
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
                  {allData && allData.categories.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
            <div className="form-group">
              <input 
              id="quantity" 
              value={stateData.quantity} 
              onChange={(e) => (validateNumber('quantity'), stateMethod(createType, 'quantity', e.target.value))}/>
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
            </>
          }



          {typeForm == 'priceList' &&
            <>
            <div className="form-group">
              <input
              onClick={() => setInputDropdown('price_supplier')} 
              value={manageFormFields(stateData.supplier, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'supplier', e.target.value))}
              readOnly
              />
              <label 
              className={`input-label ` + (
                stateData.supplier.length > 0 || 
                typeof stateData.supplier == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="supplier">
                Supplier
              </label>
              <div 
              onClick={() => setInputDropdown('price_supplier')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'price_supplier' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.suppliers.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                  <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'supplier', item), setInputDropdown(''))}>
                    {item.name}
                  </div>
                  ))}
                </div>
              }
            </div>
            <div className="form-group">
              <input 
              onClick={() => setInputDropdown('price_model')} 
              value={manageFormFields(stateData.model, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'model', e.target.value))}
              readOnly
              />
              <label 
                className={`input-label ` + (
                  stateData.model &&
                  stateData.model.length > 0 || 
                  typeof stateData.model == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="model">
                Model
              </label>
              <div 
              onClick={() =>setInputDropdown('price_model') }>
              <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'price_model' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.models.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
              onClick={() => setInputDropdown('price_color')} 
              value={manageFormFields(stateData.color, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'color', e.target.value))}
              readOnly
              />
              <label 
                className={`input-label ` + (
                  stateData.color &&
                  stateData.color.length > 0 || 
                  typeof stateData.color == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="color">
                Color
              </label>
              <div 
              onClick={() =>setInputDropdown('price_color') }>
              <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'price_color' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.colors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
            </>
          }
          
          

          { typeForm == 'miscellaneous' &&
            <>
            <div className="form-group">
              <input 
              onClick={() => setInputDropdown('miscellaneous_category')} 
              value={manageFormFields(stateData.category, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'category', e.target.value))}/>
              <label 
                className={`input-label ` + (
                  stateData.category &&
                  stateData.category.length > 0 || 
                  typeof stateData.category == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="category">
                Category
              </label>
              <div 
              onClick={() =>setInputDropdown('miscellaneous_category') }>
              <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'miscellaneous_category' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.categories.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
            <div className="form-group">
              <input 
              id="quantity" 
              value={stateData.quantity} 
              onChange={(e) => (validateNumber('quantity'), stateMethod(createType, 'quantity', e.target.value))}/>
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
            <div className="form-group-checkbox">
              <input 
                type="checkbox" 
                name="taxable" 
                id="taxable" 
                hidden={true} 
                checked={stateData.taxable ? true : false} 
                readOnly
              />
              <label 
                htmlFor="taxable" 
                onClick={() => (
                  stateData.taxable
                  ? 
                  stateMethod(createType, 'taxable', false) 
                  : 
                  stateMethod(createType, 'taxable', true)
                )}
              >
              </label>
              <span>Taxable</span>
            </div>
            <div className="form-group-checkbox">
              <input 
                type="checkbox" 
                name="discount" 
                id="discount" 
                hidden={true} 
                checked={stateData.discount ? true : false} 
                readOnly
              />
              <label 
                htmlFor="discount" 
                onClick={() => (
                  stateData.discount
                  ? 
                  stateMethod(createType, 'discount', false) 
                  : 
                  stateMethod(createType, 'discount', true)
                )}
              >
              </label>
              <span>Allow discount</span>
            </div>
            </>
          }

          {typeForm == 'slab' &&
            <>
            <div className="form-group">
              <input
              onClick={() => setInputDropdown('slab_material')} 
              value={manageFormFields(stateData.material, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'material', e.target.value))}
              readOnly
              />
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
              onClick={() => setInputDropdown('slab_material')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'slab_material' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.materials.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
              onClick={() => setInputDropdown('slab_color')} 
              value={manageFormFields(stateData.color, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'color', e.target.value))}
              readOnly
              />
              <label 
                className={`input-label ` + (
                  stateData.color &&
                  stateData.color.length > 0 || 
                  typeof stateData.color == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="color">
                Color
              </label>
              <div 
              onClick={() =>setInputDropdown('slab_color') }>
              <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'slab_color' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.colors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
              onClick={() => setInputDropdown('slab_supplier')} 
              value={manageFormFields(stateData.supplier, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'supplier', e.target.value))}
              readOnly
              />
              <label 
                className={`input-label ` + (
                  stateData.supplier &&
                  stateData.supplier.length > 0 || 
                  typeof stateData.supplier == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="supplier">
                Supplier
              </label>
              <div 
              onClick={() =>setInputDropdown('slab_supplier') }>
              <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'slab_supplier' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.suppliers.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                  <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'supplier', item), setInputDropdown(''))}>
                    {item.name}
                  </div>
                  ))}
                </div>
              }
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
            <div className="form-group">
              <input 
              id="quantity" 
              value={stateData.quantity} 
              onChange={(e) => (validateNumber('quantity'), stateMethod(createType, 'quantity', e.target.value))}/>
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
            </>
          }
          
          {typeForm == 'remnant' &&
            <>
            <div className="form-group">
              <input
              onClick={() => setInputDropdown('slab_material')} 
              value={manageFormFields(stateData.material, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'material', e.target.value))}
              readOnly
              />
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
              onClick={() => setInputDropdown('slab_material')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'slab_material' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.materials.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
              onClick={() => setInputDropdown('slab_color')} 
              value={manageFormFields(stateData.color, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'color', e.target.value))}
              readOnly
              />
              <label 
                className={`input-label ` + (
                  stateData.color &&
                  stateData.color.length > 0 || 
                  typeof stateData.color == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="color">
                Color
              </label>
              <div 
              onClick={() =>setInputDropdown('slab_color') }>
              <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'slab_color' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  {allData && allData.colors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
              onClick={() => setInputDropdown('remnant_shape')} 
              value={stateData.shape} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'shape', e.target.value))}
              readOnly
              />
              <label 
                className={`input-label ` + (
                  stateData.shape &&
                  stateData.shape.length > 0 || 
                  typeof stateData.shape == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="shape">
                Shape
              </label>
              <div 
              onClick={() =>setInputDropdown('remnant_shape') }>
              <SVG svg={'dropdown-arrow'}></SVG>
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
            <div className="form-group">
              <input 
              id="quantity" 
              value={stateData.quantity} 
              onChange={(e) => (validateNumber('quantity'), stateMethod(createType, 'quantity', e.target.value))}/>
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
            </>
          }
          
          
      </form>




      {message && 
      <span className="form-group-message">
        <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
        {message}
      </span>
      }





      <div className="addFieldItems-modal-box-footer">
        {typeForm !== '' && modalEdit == '' && 
          <button 
          className="form-group-button" 
          onClick={(e) => (
            stateMethod(addQuoteLineType, null, stateData),
            setModal(''),
            resetState(resetType),
            stateMethod(changeFormType, null, '')
          )}
          >
              {loading == 'create_quote_line' ? 
              <div className="loading">
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
              </div>
              : 
              'Add Quote Line'
              }
          </button>
        }
        {modalEdit == 'quote_line' && 
          <button 
          className="form-group-button" 
          onClick={(e) => (
            stateMethod(updateQuoteLineType, stateData.idx, stateData),
            setModal(''),
            setModalEdit(''),
            resetState(resetType),
            stateMethod(changeFormType, null, '')
          )}
          >
              {loading == 'update_quote_line' ? 
              <div className="loading">
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
              </div>
              : 
              'Update'
              }
          </button>
        }
      </div>
    </div>
    </div>
  )
}

export default QuoteLineModal
