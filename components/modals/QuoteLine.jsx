import {useState, useEffect} from 'react'
import SVG from '../../files/svgs'
import { validatePrice } from '../../helpers/validations'

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

  //// DATA
  allData,
  setAllData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,

  //// CRUD
  submitCreate,
  submitUpdate
}) => {
  
  const createType = 'CREATE_QUOTE_LINE'
  const resetType = 'RESET_QUOTE_LINE'
  const [loadingColor, setLoadingColor] = useState('white')

   //// OTHER
   const [searchItems, setSearchItems] = useState(false)
   const [search, setSearch] = useState('')
   const [typeForm, setTypeForm] = useState('')
   const [filterSearch, setFilterSearch] = useState('')

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
            {edit == 'quote_line' ? 
            'Edit Quote Line' 
            : 
            'New Quote Line'
            }
        </span>


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


        {typeForm == '' && 
        <div onClick={() => (
            setModal(''), 
            resetState(resetType), 
            setMessage(''),
            setEdit('')
          )}>
          <SVG svg={'close'}></SVG>
        </div>
        }
        {typeForm !== '' && 
        <div onClick={() => (
          setTypeForm(''), 
          resetState(resetType)
          )}>
          <SVG svg={'arrow-left-large'}></SVG>
        </div>
        }


      </div>
      <form 
      className="addFieldItems-modal-form" 
      >
        <div className="form-group-button">Product</div>
        <div className="form-group-button">Price List</div>
        <div className="form-group-button">Miscellaneous Item</div>


        <div className="addFieldItems-modal-form-container">
          {searchItems && 
          <div className="addFieldItems-modal-form-container-searchList">
            <div className="addFieldItems-modal-form-container-searchList-categories-container">
              <div className="addFieldItems-modal-form-container-searchList-categories">
                <span 
                className={`addFieldItems-modal-form-container-searchList-categories-item ` + (filterSearch == 'products' ? 'categoryClicked' : '')} 
                onClick={() => filterSearch == 'products' ? setFilterSearch('') : setFilterSearch('products')}>
                  Products
                </span>
                <span 
                className={`addFieldItems-modal-form-container-searchList-categories-item ` + (filterSearch == 'priceLists' ? ' categoryClicked' : '')} 
                onClick={() => filterSearch == 'priceLists' ? setFilterSearch('') : setFilterSearch('priceLists')}
                >
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
              {filterSearch !== 'priceLists' &&
              <>
              <div className="addFieldItems-modal-form-container-searchList-header">
                Products
              </div>
              <div className="addFieldItems-modal-form-container-searchList-list">
                { allData && allData.products.map((item, idx) => 
                  search.length > 0 ? 
                  filterProductsSearch(item) ? 
                    <div 
                    key={idx}
                    className="addFieldItems-modal-form-container-searchList-list-item" 
                    onClick={() => (
                      setSearchItems(false),
                      setTypeForm('products'), 
                      stateMethod(createType, 'typeForm', 'products'), 
                      stateMethod(createType, 'brand', item.brand), 
                      stateMethod(createType, 'model', item.model), 
                      stateMethod(createType, 'category', item.category), stateMethod(createType, 'description', item.description), 
                      stateMethod(createType, 'price', item.price), 
                      stateMethod(createType, 'price_unformatted', validatePrice(item.price)), 
                      setInputDropdown(''))
                    }>
                    {item.brand} / {item.category} / {item.model}
                    </div>
                  : 
                    null
                  :
                  <div 
                  key={idx} 
                  className="addFieldItems-modal-form-container-searchList-list-item" 
                  onClick={() => (
                    setSearchItems(false),
                    setTypeForm('products'), 
                    stateMethod(createType, 'typeForm', 'products'), 
                    stateMethod(createType, 'brand', item.brand), 
                    stateMethod(createType, 'model', item.model), 
                    stateMethod(createType, 'category', item.category), stateMethod(createType, 'description', item.description), 
                    stateMethod(createType, 'price', item.price), 
                    stateMethod(createType, 'price_unformatted',
                    validatePrice(item.price)),
                    setInputDropdown(''))
                  }>
                    {item.brand} / {item.category} / {item.model}
                  </div>

                ) 
                }
              </div>
              </>
              }
              { filterSearch !== 'products' &&
                <>
                <div className="addFieldItems-modal-form-container-searchList-header">
                  Price List
                </div>
                <div className="addFieldItems-modal-form-container-searchList-list">
                  { allData.prices && allData.prices.map((item, idx) => 
                    search.length > 0 ? 
                    filterPriceListSearch(item) ? 
                    <div key={idx} className="addFieldItems-modal-form-container-searchList-list-item" onClick={() => (setSearchItems(false),createQuoteLine('typeForm', 'priceList'), setTypeForm('priceList'), createQuoteLine('brand', item.brand), createQuoteLine('model', item.model), createQuoteLine('category', item.color), createQuoteLine('price', `$${item.price}`), createQuoteLine('price_unformatted', validateIsNumberToCentsCheck2(validateIsPriceNumber(item.price))))}>
                      {item.brand} / {item.color} / {item.model}
                    </div>
                    :
                      null
                    :
                    <div key={idx} className="addFieldItems-modal-form-container-searchList-list-item" onClick={() => (setSearchItems(false), createQuoteLine('typeForm', 'priceList'), setTypeForm('priceList'),createQuoteLine('brand', item.brand), createQuoteLine('model', item.model), createQuoteLine('category', item.color), createQuoteLine('price', `$${item.price}`), createQuoteLine('price_unformatted', validateIsNumberToCentsCheck2(validateIsPriceNumber(item.price))))}>
                      {item.brand} / {item.color} / {item.model}
                    </div>
                  ) 
                  }
                </div>
                </>
              }
            </div>
          </div>
          }
        </div>
        
        {/* {message && 
        <span className="form-group-message">
          <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
          {message}
        </span>
        } */}
        {/* {!edit && 
        <button 
        className="form-group-button" 
        onClick={(e) => submitCreate(e, stateData, 'locations', setMessage, 'create_location', setLoading, token, 'locations/create-location', resetType, resetState, allData, setAllData, setDynamicSVG)}
        >
           {loading == 'create_location' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Save'
            }
        </button>
        }
        {edit == 'location' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'locations', setMessage, 'update_location', setLoading, token, 'locations/update-location', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'locations', setModal))}
        >
           {loading == 'update_location' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Update'
            }
        </button>
        } */}
      </form>
    </div>
    </div>
  )
}

export default QuoteLineModal
