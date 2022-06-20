import { useState, useEffect, useRef } from 'react';
import SVG from '../../files/svgs';
import { manageFormFields } from '../../helpers/forms';
import { selectCreateType, selectCreateArrayType, selectResetType } from '../../helpers/dispatchTypes';
import { filterProductSearch, validateNumber, validatePrice, formatDate } from '../../helpers/validations';
import { nanoid } from 'nanoid'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const PurchaseListItems = ({
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
  typeOfData,
  modalFormType,
  typeForm,
  purchaseOrder,

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
  setTypeForm,

  //// CRUD
  submitCreate,
  submitUpdate,
}) => {
  console.log(stateData)
  const createType = selectCreateType(typeOfData);
  const createArrayType = selectCreateArrayType(typeOfData);
  const resetType = selectResetType(typeOfData);
  const myRefs = useRef(null);
  const [loadingColor, setLoadingColor] = useState('white');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [input_dropdown, setInputDropdown] = useState('')
  const [receiptDate, setReceiptDate] = useState('')

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
      if(event.target.id == 'calendar') return
      
      if (!myRefs.current.contains(event.target)) {
        setInputDropdown('');
      }
    }
  };

  useEffect(() => {
    console.log(input_dropdown)
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
            {edit == dataType ? 'Receive Purchase Order' : 'Receive Purchase Order'}
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

        <div className="addFieldItems-modal-unformatted">
          <div className="addFieldItems-modal-unformatted-title">PO Number: <span>{stateData.POnumber ? stateData.POnumber : 'n/a'}</span> </div>
        </div>
          
        <div className="addFieldItems-modal-unformatted">
          <div className="addFieldItems-modal-unformatted-title">Receipt Date: <span>{receiptDate ? receiptDate : formatDate(new Date(Date.now()))}</span> </div>
          <div
            id={'calendar'}
            onClick={() =>
              input_dropdown == ''
              ? 
              (
                setInputDropdown('calendar')
              )
              : 
              (
                setInputDropdown('')
              )
            }
          >
            <SVG 
              onClick={() => 
                input_dropdown == ''
                ? 
                (
                  setInputDropdown('calendar')
                )
                : 
                (
                  setInputDropdown('')
                )
              } 
              svg={'calendar'} 
              id={'calendar'}
            >
            </SVG>
          </div>
          {input_dropdown == 'calendar' && (
            <div className="form-group-list" ref={myRefs}>
              <Calendar
                onClickDay={(date) => (
                  setReceiptDate(formatDate(date),
                  setInputDropdown(''))
                )}
                minDate={new Date(Date.now())}
              />
            </div>
          )}
        </div>
        
        
        
        <div className="table width-auto">
          <div className="table-header color-grey-light-scheme-2">
            <div className="table-headers-modal">
              <div className="table-headers-modal-item">
                Received Qty
              </div>
              <div className="table-headers-modal-item">
                Description
              </div>
            </div>  
          </div>
          
          { stateData.POLines && stateData.POLines.map((item, idx) => 
            <div key={idx} className="table-purchaseOrderLine">
              <div className="table-purchaseOrderLine-item">
                <div className="table-purchaseOrderLine-item-qty">
                  <input 
                    type="text"
                    value={item.receivedQty}
                    onChange={(e) => (
                      item.receivedQty = e.target.value,
                      stateMethod('RECEIVE_PO_LINE', 'POLines', item)
                    )}
                  />
                  <span>of {item.quantity}</span>
                </div>
              </div>
              <div className="table-purchaseOrderLine-item">
                <div className="table-purchaseOrderLine-item-description">
                  <span>
                  {
                     item.description
                     ?
                     item.description.category ? item.description.category[0].name : item.description
                     : 
                     null
                  }
                  </span>
                </div>
              </div>
            </div>
          )}
          
        </div>

       

        <div className="addFieldItems-modal-box-footer">
          {message && (
            <span className="form-group-message">
              <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
              {message}
            </span>
          )}
          {modalFormType == 'productsForm' && !typeForm &&
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

          {modalFormType == 'miscellaneousForm' && !typeForm &&
            <button className="form-group-button" onClick={(e) => (
              setModal(''),
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

          {edit == 'purchaseOrders' && typeForm == 'purchaseOrderLines' &&
          (
            <button
              className="form-group-button"
              onClick={(e) => (
                e.preventDefault(),
                stateMethod('UPDATE_PO_LINE', 'POLines', stateData),
                setModal(''),
                stateMethod(resetType),
                setTypeForm('')
              )}
            >
              {loading == 'update_po_line' ? (
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
