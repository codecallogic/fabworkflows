import { useState, useEffect, useRef } from 'react';
import SVG from '../../files/svgs';
import { manageFormFields } from '../../helpers/forms';
import { selectCreateType, selectCreateArrayType, selectResetType } from '../../helpers/dispatchTypes';
import { filterProductSearch, validateNumber, validatePrice } from '../../helpers/validations';

const PurchaseListItems = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  dynamicSVG,
  setDynamicSVG,
  typeOfData,
  modalFormType,

  //// DATA
  allData,
  setAllData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  autoFill,
  autoFillType,
  dataType,
  setModalFormType,

  //// CRUD
  submitCreate,
  submitUpdate,
}) => {

  const createType = selectCreateType(typeOfData);
  const createArrayType = selectCreateArrayType(typeOfData);
  const resetType = selectResetType(typeOfData);
  const myRefs = useRef(null);
  const [loadingColor, setLoadingColor] = useState('white');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [input_dropdown, setInputDropdown] = useState('')
  const [typeForm, setTypeForm] = useState('')

  //// HANDLE MODAL DRAG
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const onPointerDown = () => {};
  const onPointerUp = () => {};
  const onPointerMove = () => {};
  const [isDragging, setIsDragging] = useState(false);
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
  });

  const handlePointerDown = (e) => {
    setPrevX(0);
    setPrevY(0);
    setIsDragging(true);
    onPointerDown(e);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    onPointerUp(e);
  };

  const handlePointerMove = (e) => {
    if (isDragging) handleDragMove(e);

    onPointerMove(e);
  };

  const handleDragMove = (e) => {
    var movementX = prevX ? e.screenX - prevX : 0;
    var movementY = prevY ? e.screenY - prevY : 0;

    setPrevX(e.screenX);
    setPrevY(e.screenY);

    handleModalMove(movementX, movementY);
  };

  const handleModalMove = (X, Y) => {
    setTranslate({
      x: translate.x + X,
      y: translate.y + Y,
    });
  };

  // HANDLE DROPDOWNS
  const handleClickOutside = (event) => {
    if (myRefs.current) {
      if (!myRefs.current.contains(event.target)) {
        setInputDropdown('');
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div
      className="addFieldItems-modal"
      data-value="parent"
      onClick={(e) =>
        e.target.getAttribute('data-value') == 'parent'
          ? setIsDragging(false)
          : null
      }
    >
      <div
        className="addFieldItems-modal-box"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        style={{
          transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
        }}
      >
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">
            {edit == dataType ? 'Edit' : 'Add'}
          </span>
          <div className="addFieldItems-modal-box-header-right">
          {typeForm &&
            <div onClick={() => (
              setModalFormType('products'),
              setTypeForm('')
            )}>
              <SVG svg={'arrow-left-large'}></SVG>
            </div>
          }

          <div onClick={() => (
            setModal(''), 
            setMessage(''),
            setTypeForm('')
          )}>
            <SVG svg={'close'}></SVG>
          </div>
          </div>
        </div>
        {!typeForm && modalFormType && modalFormType == 'products' &&
          <form className="addFieldItems-modal-form">
            <div className="form-group">
              <input
                value={search}
                onChange={(e) => (
                  setSearch(e.target.value)
                )}
              />
              <label
                className={
                  `input-label ` +
                  ( 
                    search.length > 0 || typeof search == 'object'
                    ? ' labelHover'
                    : ''
                  )
                }
                htmlFor={`search`}
              >
                Search Products (ex. brand, model, category)
              </label>
            </div>
            <div className="addFieldItems-modal-form-container-searchList-container">
              <div className="addFieldItems-modal-form-container-searchList-table-header">
                <div
                  className="addFieldItems-modal-form-container-searchList-table-header-item"
                  onClick={() =>
                    sort === 'down' ? setSort('up') : setSort('down')
                  }
                >
                  <span>Products</span>
                  <SVG svg={'dropdown-arrow'}></SVG>
                </div>
              </div>
              <div className="addFieldItems-modal-form-container-searchList-list">
                {allData && allData[modalFormType].sort((a, b) => sort === 'down' ? a.category[0].name > b.category[0].name ? -1 : 1 : a.category[0].name > b.category[0].name ? 1 : -1).map((item, idx) =>
                  search.length > 0 
                  ? 
                  (
                    filterProductSearch(item, search) ? (
                      <div
                        key={idx}
                        className="addFieldItems-modal-form-container-searchList-list-item"
                        onClick={() => (
                          stateMethod(createType, 'idx', item._id),
                          stateMethod(createType, 'description', item),
                          stateMethod(createType, 'color', item.color[0]),
                          stateMethod(createType, 'unitCost', item.price),
                          setModalFormType(''),
                          setTypeForm('products')
                        )}
                      >
                        {`${manageFormFields(item.category[0], 'name')} / ${manageFormFields(item.model[0], 'name')} / ${manageFormFields(item.brand[0], 'name')}`}
                      </div>
                    ) : null
                  ) 
                  : 
                  (
                    <div
                      key={idx}
                      className="addFieldItems-modal-form-container-searchList-list-item"
                      onClick={() => (
                        stateMethod(createType, 'idx', item._id),
                        stateMethod(createType, 'description', item),
                        stateMethod(createType, 'color', item.color[0]),
                        stateMethod(createType, 'unitCost', item.price),
                        setModalFormType(''),
                        setTypeForm('products')
                      )}
                    >
                       {`${manageFormFields(item.category[0], 'name')} / ${manageFormFields(item.model[0], 'name')} / ${manageFormFields(item.brand[0], 'name')}`}
                    </div>
                  )
                )}
              </div>
            </div>
          </form>
        }

        {!typeForm && modalFormType && modalFormType == 'miscellaneous' &&
          <form className="addFieldItems-modal-form">
            <div className="form-group-textarea">
              <label
                className={
                  stateData.description.length > 0 ? ' labelHover' : ''
                }
              >
                Description
              </label>
              <textarea
                id="description"
                rows="5"
                wrap="hard"
                maxLength="400"
                name="description"
                value={stateData.description}
                onChange={(e) =>
                  stateMethod(createType, 'description', e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <input 
              id="quantity" 
              value={stateData.quantity} 
              onChange={(e) => (
                validateNumber('quantity'), 
                stateMethod(createType, 'quantity', e.target.value)
              )}/>
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
              value={stateData.unitCost} 
              onChange={(e) => (
                stateMethod(createType, 'unitCost', validatePrice(e)),
                stateMethod(createType, 'total', `$${+stateData.quantity * +validatePrice(e).replace('$', '')}`)
              )}/>
              <label 
              className={`input-label ` + (
                stateData.unitCost.length > 0 || 
                typeof stateData.unitCost == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="unitCost">
                Unit Cost
              </label>
            </div>
          </form>
        }

        {typeForm == 'products' &&
          <form className="addFieldItems-modal-form">
            <div className="form-group">
              <input 
              id="product" 
              value={manageFormFields(stateData.description.category[0], 'name')} 
              readOnly
              />
              
              <label 
              className={`input-label ` + (
                stateData.description.length > 0 || 
                typeof stateData.description == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="product">
                Product
              </label>
            </div>
            <div className="form-group">
              <input
              onClick={() => setInputDropdown('POLine_color')} 
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
              onClick={() => setInputDropdown('POLine_color')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'POLine_color' &&
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
              id="quantity" 
              value={stateData.quantity} 
              onChange={(e) => (
                validateNumber('quantity'), 
                stateMethod(createType, 'quantity', e.target.value),
                stateMethod(createType, 'total', `$${stateData.unitCost.replace('$', '') * +e.target.value}`)
              )}/>
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
          </form>
        }

        <div className="addFieldItems-modal-box-footer">
          {message && (
            <span className="form-group-message">
              <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
              {message}
            </span>
          )}
          { typeForm &&
            <button className="form-group-button" onClick={(e) => (
              stateMethod('ADD_PO_LINE', 'POLines', stateData),
              setModal(''),
              stateMethod(resetType),
              setTypeForm('')
            )}>
              {loading == 'add_po_line' ? (
                <div className="loading">
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                </div>
              ) : (
                'Save'
              )}
            </button>
          }
          { modalFormType == 'miscellaneous' &&
            <button className="form-group-button" onClick={(e) => (
              stateMethod('ADD_PO_LINE', 'POLines', stateData),
              setModal(''),
              stateMethod(resetType),
              setTypeForm('')
            )}>
              {loading == 'add_po_line' ? (
                <div className="loading">
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                </div>
              ) : (
                'Save'
              )}
            </button>
          }
          {edit == dataType && (
            <button
              className="form-group-button"
              onClick={(e) => (e.preventDefault(), null)}
            >
              {loading == 'select_account' ? (
                <div className="loading">
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                </div>
              ) : (
                'Update'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseListItems;
