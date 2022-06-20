import Table from '../tableAltForm';
import { useState, useEffect, useRef } from 'react'
import { manageFormFields } from '../../helpers/forms'
import { 
  validateDate,
  formatDate,
  validateNumber
} from '../../helpers/validations'
import {
  purchaseOrderLineSort,
} from '../../helpers/sorts';
import SVG from '../../files/svgs'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';


const PurchaseOrderForm = ({
  token,
  title,
  dynamicSVG,
  setDynamicSVG,
  modal,
  setModal,
  message, 
  setMessage,
  loading,
  setLoading,
  edit,
  setEdit,
  setModalEdit,
  controls,
  setControls,
  resetCheckboxes,
  selectID,
  setSelectID,
  setModalFormType,
  setTypeForm,

  //// DATA
  typeOfData,
  allData,
  setAllData,
  originalData,
  editData,
  extractingStateData,
  
  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  setDynamicType,
  setDynamicKey,

  ///// CRUD
  submitCreate,
  submitUpdate
}) => {
  
  const createType            = 'CREATE_PO'
  const resetType             = 'RESET_PO'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('black')
  const [input_dropdown, setInputDropdown] = useState('')
  const [save, setSave] = useState(false)
  const [purchaseOrderLineHeaders, setPurchaseOrderLineHeaders] = useState([]);

  useEffect(() => {
    
    const isEmpty = Object.values(stateData).every( x => x === '' || x.length < 1 || x === '0.00')
    
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

    let objectPurchaseOrdersLines = new Object();
    Object.values(purchaseOrderLineSort).forEach((item) => {
      objectPurchaseOrdersLines[item] = item;
    });
    setPurchaseOrderLineHeaders((oldArray) => [...oldArray, objectPurchaseOrdersLines]);
    
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };

  }, [])
  
  return (
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">
          {edit == typeOfData ? 'Edit Purchase Order' : title}
        </div>
        {save &&
        <div className="table-header-controls">
          <div 
            id="save" 
            className="table-header-controls-item" 
            onClick={(e) => edit == typeOfData ? 
              submitUpdate(e, stateData, 'purchaseOrders', 'files', setMessage, 'create_po', setLoading, token, 'purchase-order/update-purchase-order', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'purchaseOrders', null)
              : 
              submitCreate(e, stateData, 'quotes', 'files', setMessage, 'create_quote', setLoading, token, 'quotes/create-quote', resetType, resetState, allData, setAllData, setDynamicSVG)  
            }
            >
            {loading == 'create_po' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
              edit == typeOfData ? 'Update' : 'Save'
            }
          </div>
          {/* <div 
          id="reset" 
          className="table-header-controls-item" 
          onClick={() => (setLoading(''), resetState(resetType), setMessage(''), setEdit(''))}
          >
            Reset
          </div> */}
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

        <div className="form-box" style={{width: '100%'}}>
          <div className="form-box-heading">Purchase Order Info</div>
          <div className="form-box-container">
            <div className="form-group">
              <input
                onClick={() => setInputDropdown('purchase_order_supplier')} 
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
              onClick={() => setInputDropdown('purchase_order_supplier')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'purchase_order_supplier' &&
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
              onClick={() => setInputDropdown('purchase_order_shipping')} 
              value={stateData.shipping} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'shipping', e.target.value))}
              readOnly
              />
              <label 
              className={`input-label ` + (
                stateData.shipping.length > 0 || 
                typeof stateData.shipping == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="shipping">
                Ship-To Location
              </label>
              <div 
              onClick={() => setInputDropdown('purchase_order_shipping')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'purchase_order_shipping' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'shipping', 'Innovative Stones'), setInputDropdown(''))}>
                    Innovative Stones
                  </div>
                </div>
              }
            </div>

            <div className="form-group">
              <input 
              id="POnumber" 
              value={stateData.POnumber} 
              onChange={(e) => (validateNumber('POnumber'), stateMethod(createType, 'POnumber'))}
              />
              <label 
                className={`input-label ` + (
                stateData.POnumber
                ? ' labelHover' 
                : ''
              )}
              htmlFor="POnumber">
                PO Number
              </label>
            </div>
            
            <div className="form-group">
              <input
              style={{ color: stateData.status == 'not ordered' ? 'red' : 'green'}}
              id="status" 
              value={stateData.status} 
              onChange={(e) => stateMethod(createType, 'status', e.target.value)}
              readOnly
              />
              <label 
              className={`input-label ` + (
                stateData.status.length > 0 || 
                typeof stateData.status == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="status">
                Status
              </label>
            </div>

            <div className="form-group">
              <input 
              id="orderDate" 
              value={stateData.orderDate} 
              onChange={(e) => validateDate(e, 'orderDate', createType, stateMethod)}/>
              <label 
              className={`input-label ` + (
                stateData.orderDate.length > 0 || 
                typeof stateData.orderDate == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="orderDate">
                Order Date
              </label>
              <div onClick={() => input_dropdown == 'calendarOrder' ? setInputDropdown('') : setInputDropdown('calendarOrder')}>
                <SVG svg={'calendar'}></SVG>
              </div>
              { input_dropdown == 'calendarOrder' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  <Calendar
                    onClickDay={(date) => 
                      stateMethod(createType, 'orderDate', formatDate(date),
                      setInputDropdown('')
                    )}
                    
                    minDate={new Date(Date.now())}
                  />
                </div>
              }
            </div>

            <div className="form-group">
              <input 
              id="expectedDelivery" 
              value={stateData.expectedDelivery} 
              onChange={(e) => validateDate(e, 'expectedDelivery', createType, stateMethod)}/>
              <label 
              className={`input-label ` + (
                stateData.expectedDelivery.length > 0 || 
                typeof stateData.expectedDelivery == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="expectedDelivery">
                Expected Delivery
              </label>
              <div onClick={() => input_dropdown == 'calendarExpected' ? setInputDropdown('') : setInputDropdown('calendarExpected')}>
                <SVG svg={'calendar'}></SVG>
              </div>
              { input_dropdown == 'calendarExpected' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  <Calendar
                    onClickDay={(date) => 
                      stateMethod(createType, 'expectedDelivery', formatDate(date),
                      setInputDropdown('')
                    )}
                    
                    minDate={new Date(Date.now())}
                  />
                </div>
              }
            </div>

            <div className="form-group">
              <input 
              id="taxRate" 
              value={stateData.taxRate} 
              onChange={(e) => (validateNumber('taxRate'), stateMethod(createType, 'taxRate', e.target.value))}/>
              
              <label 
              className={`input-label ` + (
                stateData.taxRate.length > 0 || 
                typeof stateData.taxRate == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="taxRate">
                Tax Rate %
              </label>
            </div>

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
            
            
          </div>

          
        </div>        

        <Table
          token={token}
          title={'PO Lines'}
          typeOfData={'purchaseOrderLines'}
          componentData={purchaseOrderLineHeaders}
          allData={stateData.POLines}
          setAllData={setAllData}
          modal={modal}
          setModal={setModal}
          sortOrder={purchaseOrderLineSort}
          controls={controls}
          setControls={setControls}
          controlsType={'purchaseOrderLinesControls'}
          message={message}
          setMessage={setMessage}
          resetCheckboxes={resetCheckboxes}
          editData={editData}
          changeView={changeView}
          setEdit={setEdit}
          viewType={'purchaseOrders'}
          modalType={'purchaseOrderLines'}
          loading={loading}
          setLoading={setLoading}
          dynamicSVG={dynamicSVG}
          setDynamicSVG={setDynamicSVG}
          setDynamicType={setDynamicType}
          setDynamicKey={setDynamicKey}
          selectID={selectID}
          setSelectID={setSelectID}
          extractingStateData={extractingStateData}
          dynamicType={'ADD_PO_LINE'}
          dynamicKey={'POLines'}
          setModalFormType={setModalFormType}
          setTypeForm={setTypeForm}
        ></Table>
        
      </form>
      
    </div> 

  )
}

export default PurchaseOrderForm
