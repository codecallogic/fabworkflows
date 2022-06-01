import { useState, useEffect, useRef } from 'react';
import SVG from '../../files/svgs';
import Table from '../tableAltForm';

//// HELPERS
import { returnIfTrue } from '../../helpers/validations'
import { populateAddress } from '../../helpers/modals'
import {
  contactSort,
  priceSort,
  quoteSort
} from '../../helpers/sorts';

const AccountForm = ({
  token,
  account,
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
  event,

  //// METHODs
  validateNumber,

  //// DATA
  typeOfData,
  componentData,
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
  addImages,

  ///// CRUD
  submitCreate,
  submitUpdate,
  submitDeleteFile,
}) => {
  const createType        = 'CREATE_ACCOUNT';
  const resetType         = 'RESET_ACCOUNT';
  const resetTypeContact  = 'RESET_CONTACT';
  const [save, setSave] = useState(false);
  const [quoteHeaders, setQuoteHeaders] = useState([]);
  const [contactHeaders, setContactHeaders] = useState([]);
  const [priceListHeaders, setPriceListHeaders] = useState([]);

  useEffect(() => {
    const isEmpty = Object.values(stateData).every(
      (x) => x === '' || x.length < 1 || x === ''
    );
    
    if (!isEmpty) return setMessage(''), setSave(true);
    if (isEmpty) return setSave(false);

  }, [stateData]);

  useEffect(() => {
    !stateData.salesperson ? stateMethod(createType, 'salesperson', `${account.firstName} ${account.lastName}`): null;
  }, [])

  useEffect(() => {

    let objectQuotes = new Object();
    Object.values(quoteSort).forEach((item) => {
      objectQuotes[item] = item;
    });
    setQuoteHeaders((oldArray) => [...oldArray, objectQuotes]);

    let objectContacts = new Object();
    Object.values(contactSort).forEach((item) => {
      objectContacts[item] = item;
    });
    setContactHeaders((oldArray) => [...oldArray, objectContacts]);


    let objectPriceList = new Object();
    Object.values(priceSort).forEach((item) => {
      objectPriceList[item] = item;
    });
    setPriceListHeaders((oldArray) => [...oldArray, objectPriceList]);

  }, []);
  
  return (
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">
          {edit == typeOfData ? 'Edit Account' : title}
        </div>
        {save && (
          <div className="table-header-controls">
            {/* { edit == typeOfData ? 
              <div
              className="table-header-controls-item-svg"
              >
                <SVG svg={'send'}></SVG>
              </div>
              :
              null
            } */}
            <div
              id="save"
              className="table-header-controls-item"
              onClick={(e) =>
                edit == typeOfData
                ? stateData.payment == 'deposit' || stateData.payment == 'complete'
                ? setMessage('Cannot update quotes with payments processed')
                : submitUpdate( e, stateData, 'jobs', 'files', setMessage, 'update_job', setLoading, token, 'jobs/update-job', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'jobs')
                : submitCreate( e, stateData, 'jobs', 'files', setMessage, 'create_job', setLoading, token, 'jobs/create-job', resetType, resetState, allData, setAllData, setDynamicSVG)
              }
            >
              {loading == 'create_job' || loading == 'update_job' ? (
                <div className="loading">
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                </div>
              ) : edit == typeOfData ? (
                'Update'
              ) : (
                'Save'
              )}
            </div>
            <div
              id="reset"
              className="table-header-controls-item"
              onClick={() => (
                setLoading(''),
                resetState(resetType),
                setMessage(''),
                setEdit('')
              )}
            >
              Reset
            </div>
          </div>
        )}
        {message && (
          <div className="table-header-error">
            <SVG svg={dynamicSVG}></SVG>
            <span>{message.substr(0, 200)}</span>
          </div>
        )}
      </div>
      <form className="table-forms" onSubmit={null}>
        <div className="form-box" style={{ width: '49%' }}>
          <div className="form-box-heading">
            Account Info
          </div>
          <div className="form-box-container">
            <div className="form-group">
              <input
                id="name"
                value={stateData.name}
                onChange={(e) =>
                  stateMethod(createType, 'name', e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.name.length > 0 ||
                  typeof stateData.name == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="name"
              >
                Account Name
              </label>
            </div>
            <div className="form-group">
              <input
                id="salesperson"
                value={stateData.salesperson}
                onChange={(e) =>
                  stateMethod(createType, 'salesperson', e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.salesperson.length > 0 ||
                  typeof stateData.salesperson == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="salesperson"
              >
                Salesperson
              </label>
            </div>
            <div className="form-group">
              <input
                id="tax_exempt"
                value={stateData.tax_exempt}
                onChange={(e) => (
                  validateNumber('tax_exempt'),
                  stateMethod(createType, 'tax_exempt', e.target.value)
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.tax_exempt.length > 0 ||
                  typeof stateData.tax_exempt == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="tax_exempt"
              >
                Tax Exempt
              </label>
            </div>
            <div className="form-group-textarea">
              <label
                className={stateData.notes.length > 0 ? ' labelHover' : ''}
              >
                Notes
              </label>
              <textarea
                id="notes"
                rows="5"
                wrap="hard"
                maxLength="400"
                name="notes"
                value={stateData.notes}
                onChange={(e) =>
                  stateMethod(createType, 'notes', e.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="form-box" style={{ width: '49%' }}>
          <div className="form-box-heading">
            Address
            <div
              className="form-box-heading-item"
              onClick={() => (
                stateData.accountAddress 
                ? (
                  setModal('new_contact'),
                  setDynamicType('CREATE_ACCOUNT'),
                  setDynamicKey('accountAddress'),
                  populateAddress(null, stateData.accountAddress, stateMethod, 'CREATE_CONTACT')
                  )
                : (
                  setModal('new_contact'),
                  setDynamicType('CREATE_ACCOUNT'),
                  setDynamicKey('accountAddress'),
                  resetState(resetTypeContact)
                  )
              )}
            >
              <SVG svg={'location'}></SVG>
            </div>
            <div
              className="form-box-heading-item"
              onClick={() => stateMethod(createType, 'accountAddress', '')}
            >
              <SVG svg={'thrash-can'}></SVG>
            </div>
          </div>
          <div className="form-box-container">
          <div className="form-group-textarea">
              <label className={'labelHover'}>Account Address</label>
              <textarea
                id="accountAddress"
                rows="9"
                wrap="hard"
                maxLength="400"
                name="accountAddress"
                value={`${returnIfTrue(stateData.accountAddress.contact_name)} 
${returnIfTrue(stateData.accountAddress.address)}
${returnIfTrue(stateData.accountAddress.city)} ${returnIfTrue(stateData.accountAddress.state)} ${returnIfTrue(stateData.accountAddress.zip_code)}
${returnIfTrue(stateData.accountAddress.country)}
${returnIfTrue(stateData.accountAddress.phone)}
${returnIfTrue(stateData.accountAddress.cell)}
${returnIfTrue(stateData.accountAddress.fax)}
${returnIfTrue(stateData.accountAddress.email)}
${returnIfTrue(stateData.accountAddress.contact_notes)}
`}
                readOnly
              />
            </div>
          </div>
        </div>

        <Table
          token={token}
          title={'Contacts'}
          typeOfData={'contacts'}
          componentData={contactHeaders}
          allData={stateData.contacts}
          setAllData={setAllData}
          modal={modal}
          setModal={setModal}
          sortOrder={contactSort}
          controls={controls}
          setControls={setControls}
          controlsType={'contactControls'}
          message={message}
          setMessage={setMessage}
          resetCheckboxes={resetCheckboxes}
          editData={editData}
          changeView={changeView}
          setEdit={setEdit}
          viewType={'contacts'}
          modalType={'new_contact'}
          loading={loading}
          setLoading={setLoading}
          dynamicSVG={dynamicSVG}
          setDynamicSVG={setDynamicSVG}
          setDynamicType={setDynamicType}
          setDynamicKey={setDynamicKey}
          selectID={selectID}
          setSelectID={setSelectID}
          extractingStateData={extractingStateData}
          dynamicType={'CREATE_ACCOUNT_ARRAY_ITEM'}
          dynamicKey={'contacts'}
        ></Table>

        <Table
          token={token}
          title={'Price Lists'}
          typeOfData={'prices'}
          componentData={priceListHeaders}
          allData={stateData.priceLists}
          setAllData={setAllData}
          modal={modal}
          setModal={setModal}
          sortOrder={priceSort}
          controls={controls}
          setControls={setControls}
          controlsType={'priceControls'}
          message={message}
          setMessage={setMessage}
          resetCheckboxes={resetCheckboxes}
          editData={editData}
          changeView={changeView}
          setEdit={setEdit}
          viewType={'prices'}
          modalType={'price_list_items'}
          loading={loading}
          setLoading={setLoading}
          dynamicSVG={dynamicSVG}
          setDynamicSVG={setDynamicSVG}
          setDynamicType={setDynamicType}
          setDynamicKey={setDynamicKey}
          selectID={selectID}
          setSelectID={setSelectID}
          extractingStateData={extractingStateData}
          dynamicType={'CREATE_ACCOUNT_ARRAY_ITEM'}
          dynamicKey={'priceLists'}
        ></Table>

        <Table
          token={token}
          title={'Quotes'}
          typeOfData={'quotes'}
          componentData={quoteHeaders}
          allData={stateData.quotes}
          setAllData={setAllData}
          modal={modal}
          setModal={setModal}
          sortOrder={quoteSort}
          controls={controls}
          setControls={setControls}
          controlsType={'quoteControls'}
          message={message}
          setMessage={setMessage}
          resetCheckboxes={resetCheckboxes}
          editData={editData}
          changeView={changeView}
          setEdit={setEdit}
          viewType={'quotes'}
          modalType={'quote'}
          loading={loading}
          setLoading={setLoading}
          dynamicSVG={dynamicSVG}
          setDynamicSVG={setDynamicSVG}
          setDynamicType={setDynamicType}
          setDynamicKey={setDynamicKey}
          selectID={selectID}
          setSelectID={setSelectID}
          extractingStateData={extractingStateData}
          dynamicType={'CREATE_ACCOUNT_ARRAY_ITEM'}
          dynamicKey={'quotes'}
        ></Table>
        
      </form>
    </div>
  )
}

export default AccountForm
