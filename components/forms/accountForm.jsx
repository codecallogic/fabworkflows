import { useState, useEffect, useRef } from 'react';
import SVG from '../../files/svgs';
import Table from '../tableAltForm';

//// HELPERS
import { 
  returnIfTrue,
  multipleFiles,
  validateNumber
} from '../../helpers/validations'
import { populateAddress } from '../../helpers/modals'
import {
  contactSort,
  priceSort,
  quoteSort,
  jobSort
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
  setTypeForm,

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
  const filesType         = 'ADD_ACCOUNT_ARRAY_WITH_ITEMS';
  const [loadingColor, setLoadingColor] = useState('black');
  const [save, setSave] = useState(false);
  const [quoteHeaders, setQuoteHeaders] = useState([]);
  const [contactHeaders, setContactHeaders] = useState([]);
  const [priceListHeaders, setPriceListHeaders] = useState([]);
  const [jobHeaders, setJobHeaders] = useState([]);

  // TODO: Update contacts list when creating new contact after submitting create account, suggest to Diego implementing RTC tech
  
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

    let objectJobList = new Object();
    Object.values(jobSort).forEach((item) => {
      objectJobList[item] = item;
    });
    setJobHeaders((oldArray) => [...oldArray, objectJobList]);

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
                ? 
                stateData.payment == 'deposit' || stateData.payment == 'complete'
                ? 
                setMessage('Cannot update quotes with payments processed')
                : 
                submitUpdate( e, stateData, 'accounts', 'files', setMessage, 'update_account', setLoading, token, 'accounts/update-account', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'accounts')
                : 
                submitCreate( e, stateData, 'accounts', 'files', setMessage, 'create_account', setLoading, token, 'accounts/create-account', resetType, resetState, allData, setAllData, setDynamicSVG)
              }
            >
              {loading == 'create_account' || loading == 'update_account' ? (
                <div className="loading">
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                  <span style={{ backgroundColor: loadingColor }}></span>
                </div>
              ) : (edit == typeOfData | edit == 'new_account') ? (
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
                id="taxExempt"
                value={stateData.taxExempt}
                onChange={(e) => (
                  validateNumber('taxExempt'),
                  stateMethod(createType, 'taxExempt', e.target.value)
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.taxExempt.length > 0 ||
                  typeof stateData.taxExempt == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="taxExempt"
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
                  setEdit('new_account'),
                  setDynamicType('CREATE_ACCOUNT'),
                  setDynamicKey('accountAddress'),
                  populateAddress(null, stateData.accountAddress, stateMethod, 'CREATE_CONTACT')
                  )
                : (
                  setModal('new_contact'),
                  setEdit('new_account'),
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
          modalType={'contact_list_items'}
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
          setTypeForm={setTypeForm}
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
          setTypeForm={setTypeForm}
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
          setTypeForm={setTypeForm}
        ></Table>

        <Table
          token={token}
          title={'Jobs'}
          typeOfData={'jobs'}
          componentData={jobHeaders}
          allData={stateData.jobs}
          setAllData={setAllData}
          modal={modal}
          setModal={setModal}
          sortOrder={jobSort}
          controls={controls}
          setControls={setControls}
          controlsType={'jobControls'}
          message={message}
          setMessage={setMessage}
          resetCheckboxes={resetCheckboxes}
          editData={editData}
          changeView={changeView}
          setEdit={setEdit}
          viewType={'jobs'}
          modalType={'job_list_items'}
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
          dynamicKey={'jobs'}
          setTypeForm={setTypeForm}
        ></Table>

        <div className="form-box" style={{ width: '100%', padding: '0 2rem' }}>
          <div className="form-box-heading">
            <label htmlFor="imageFiles" className="form-box-heading-item">
              <SVG svg={'upload'}></SVG> Upload Files
              <input
                id="imageFiles"
                type="file"
                accept="*"
                multiple
                onChange={(e) =>
                  multipleFiles(e, stateData, 'files', setMessage, filesType, 'files', addImages)
                }
              />
            </label>
          </div>
          <div className="form-box-container">
            <div className="form-group-gallery">
              {stateData.files.length == 0 && (
                <a
                  className="form-group-gallery-link"
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: '25%' }}
                >
                  <img
                    className="form-group-gallery-image"
                    src="https://via.placeholder.com/300"
                  />
                </a>
              )}
              {stateData.files.length > 0 &&
                stateData.files.map((item, idx) => (
                  <a
                    key={idx}
                    onClick={() => window.open(item.location, '_blank')}
                    className="form-group-gallery-link"
                    target="_blank"
                    rel="noreferrer"
                    style={{ width: '25%' }}
                  >
                    <img
                      className="form-group-gallery-image"
                      src="https://static.thenounproject.com/png/47347-200.png"
                    />
                    <span
                      onClick={(e) => (
                        e.stopPropagation(),
                        loading !== 'delete_file'
                          ? 
                          submitDeleteFile(e, item, 'files', createType, stateMethod, stateData, 'accounts', setMessage, 'delete_file', setLoading, token, 'accounts/delete-file', allData, setAllData, setDynamicSVG, editData, null, stateData._id)
                          : null
                      )}
                    >
                      {loading == 'delete_file' ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <SVG svg={'close'}></SVG>
                      )}
                    </span>
                    {item.name ? item.name : item.location.substring(50, 70)}
                  </a>
                ))}
            </div>
          </div>
        </div>
        
      </form>
    </div>
  )
}

export default AccountForm
