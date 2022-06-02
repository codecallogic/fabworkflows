import React, { useState, useEffect, useRef } from 'react';
import SVG from '../../files/svgs';
import PlacesAutocomplete from 'react-places-autocomplete';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

//// HELPERS
import { manageFormFields } from '../../helpers/forms';
import { populateAddress } from '../../helpers/modals';
import {
  validateNumber,
  phoneNumber,
  validateDate,
  addressSelect,
  formatDate,
  numberType,
  validateTax,
  generateRandomNumber,
} from '../../helpers/validations';
import {
  manageEstimates,
  updateQuoteLine,
  calculateEstimate,
} from '../../helpers/estimates';

const searchOptionsAddress = {
  componentRestrictions: { country: 'us' },
  types: ['address'],
};

const QuoteForm = ({
  token,
  account,
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
  setModalEdit,
  resetCheckboxes,
  setControls,

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
  changeView,
  deleteType,
  typeOfDataParent,

  ///// CRUD
  submitCreate,
  submitUpdate,
  submitDeleteRow,
}) => {
  const createType = 'CREATE_QUOTE';
  const resetType = 'RESET_QUOTE';
  const changeFormType = 'CHANGE_FORMTYPE';
  const createQuoteLineType = 'CREATE_QUOTE_LINE';
  const myRefs = useRef(null);
  const [loadingColor, setLoadingColor] = useState('black');
  const [input_dropdown, setInputDropdown] = useState('');
  const [save, setSave] = useState(false);
  const [depositType, setDepositType] = useState('percentage');

  useEffect(() => {
    const isEmpty = Object.values(stateData).every(
      (x) => x === '' || x.length < 1 || x === '0.00'
    );

    if (!isEmpty) return setMessage(''), setSave(true);
    if (isEmpty) return setSave(false);
  }, [stateData]);

  const handleClickOutside = (event) => {
    if (myRefs.current) {
      if (!myRefs.current.contains(event.target)) {
        setInputDropdown('');
      }
    }
  };

  useEffect(() => {
    !stateData.salesperson
      ? stateMethod(
          createType,
          'salesperson',
          `${account.firstName} ${account.lastName}`
        )
      : null;
    !stateData.quote_date
      ? stateMethod(createType, 'quote_date', formatDate(new Date()))
      : null;
    !stateData.quote_number
      ? stateMethod(createType, 'quote_number', generateRandomNumber())
      : null;

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  //// QUOTE CALCULATIONS

  useEffect(() => {
    // console.log(stateData)
    if (stateData.payment == 'deposit' || stateData.payment == 'complete')
      return;

    calculateEstimate(stateData, stateMethod, createType, depositType);
  }, [
    stateData.quote_lines,
    stateData.quote_discount,
    stateData.quote_tax,
    stateData.quote_deposit,
  ]);

  const generateAccountAddress = (data) => {
    let obj = new Object();

    obj.contact_name = data.contact_name;
    obj.address = data.address;
    obj.city = data.city;
    obj.state = data.state;
    obj.zip_code = data.zip_code;
    obj.country = data.country;
    obj.phone = data.phone;
    obj.fax = data.fax;
    obj.email = data.email;
    obj.contact_notes = data.contact_notes;

    return obj;
  };

  return (
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">
          {edit == typeOfData ? 'Edit Quote' : title}
        </div>
        {save && (
          <div className="table-header-controls">
            {edit == typeOfData ? (
              <div
                className="table-header-controls-item-svg"
                onClick={(e) =>
                  submitDeleteRow(
                    e,
                    typeOfData,
                    setMessage,
                    'delete_quote',
                    setLoading,
                    token,
                    deleteType,
                    stateData._id,
                    allData,
                    setAllData,
                    setDynamicSVG,
                    resetCheckboxes,
                    setControls,
                    typeOfDataParent,
                    changeView
                  )
                }
              >
                {loading == 'delete_quote' ? (
                  <span>
                    <div className="loading-spinner"></div>
                  </span>
                ) : (
                  <span>
                    <SVG svg={'thrash-can'}></SVG>
                  </span>
                )}
              </div>
            ) : null}
            <div
              id="save"
              className="table-header-controls-item"
              onClick={(e) =>
                edit == typeOfData
                  ? stateData.payment == 'deposit' ||
                    stateData.payment == 'complete'
                    ? setMessage(
                        'Cannot update quotes after a payment was processed'
                      )
                    : submitUpdate(
                        e,
                        stateData,
                        'quotes',
                        'images',
                        setMessage,
                        'create_quote',
                        setLoading,
                        token,
                        'quotes/update-quote',
                        resetType,
                        resetState,
                        allData,
                        setAllData,
                        setDynamicSVG,
                        changeView,
                        'quotes'
                      )
                  : submitCreate(
                      e,
                      stateData,
                      'quotes',
                      'images',
                      setMessage,
                      'create_quote',
                      setLoading,
                      token,
                      'quotes/create-quote',
                      resetType,
                      resetState,
                      allData,
                      setAllData,
                      setDynamicSVG
                    )
              }
            >
              {loading == 'create_quote' ? (
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
          <div className="form-box-heading">Contact Info</div>
          <div className="form-box-container">
            <div className="form-group">
              <input
                onClick={() => setInputDropdown('quote_contact')}
                value={manageFormFields(stateData.contact_name, 'contact_name')}
                onChange={(e) => (
                  setInputDropdown(''),
                  stateMethod(createType, 'contact_name', e.target.value),
                  stateMethod(createType, 'quote_name', e.target.value)
                )}
              />
              <label
                className={
                  `input-label ` +
                  (stateData.contact_name.length > 0 ||
                  typeof stateData.contact_name == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="contact_name"
              >
                Contact
              </label>
              <div onClick={() => setInputDropdown('quote_contact')}>
                <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              {input_dropdown == 'quote_contact' && (
                <div className="form-group-list" ref={myRefs}>
                  {originalData &&
                    originalData.contacts
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="form-group-list-item"
                          onClick={(e) => (
                            populateAddress(
                              'address_id',
                              item,
                              stateMethod,
                              createType
                            ),
                            setInputDropdown('')
                          )}
                        >
                          {item.contact_name}
                        </div>
                      ))}
                </div>
              )}
            </div>
            <PlacesAutocomplete
              value={stateData.address}
              onChange={(e) => stateMethod(createType, 'address', e)}
              /////  KEYS RESPECTIVELY: ADDRESS, CITY, STATE, ZIP, COUNTRY
              onSelect={(e) => (
                setInputDropdown(''),
                addressSelect(
                  e,
                  'address',
                  createType,
                  stateMethod,
                  'addressGeoId',
                  'city',
                  'state',
                  'zip_code',
                  'country'
                )
              )}
              searchOptions={searchOptionsAddress}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div className="form-group">
                  <input
                    onClick={() => setInputDropdown('supplier_address')}
                    {...getInputProps()}
                  />
                  <label
                    className={
                      `input-label ` +
                      (stateData.address.length > 0 ||
                      typeof stateData.address == 'object'
                        ? ' labelHover'
                        : '')
                    }
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <div onClick={() => setInputDropdown('supplier_address')}>
                    <SVG svg={'dropdown-arrow'}></SVG>
                  </div>
                  {input_dropdown == 'supplier_address' && (
                    <div className="form-group-list" ref={myRefs}>
                      {loading ? <div>...loading</div> : null}
                      {suggestions.map((item, idx) => (
                        <div
                          key={idx}
                          className="form-group-list-item"
                          {...getSuggestionItemProps(item)}
                        >
                          {item.description}
                          <input
                            id="addressGeoId"
                            value={item.placeId}
                            style={{ display: 'none' }}
                            readOnly
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
            <div className="form-group">
              <input
                id="city"
                value={stateData.city}
                onChange={(e) =>
                  stateMethod(createType, 'city', e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.city.length > 0 ||
                  typeof stateData.city == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="city"
              >
                City
              </label>
            </div>
            <div className="form-group">
              <input
                id="state"
                value={stateData.state}
                onChange={(e) =>
                  stateMethod(createType, 'state', e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.state.length > 0 ||
                  typeof stateData.state == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="state"
              >
                State
              </label>
            </div>
            <div className="form-group">
              <input
                id="country"
                value={stateData.country}
                onChange={(e) =>
                  stateMethod(createType, 'country', e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.country.length > 0 ||
                  typeof stateData.country == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="country"
              >
                Country
              </label>
            </div>
            <div className="form-group">
              <input
                id="zip_code"
                value={stateData.zip_code}
                onChange={(e) => (
                  validateNumber('zip_code'),
                  stateMethod(createType, 'zip_code', e.target.value)
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.zip_code.length > 0 ||
                  typeof stateData.zip_code == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="zip_code"
              >
                Zip Code
              </label>
            </div>
            <div className="form-group">
              <input
                id="phone"
                value={stateData.phone}
                onChange={(e) => (
                  validateNumber('phone'),
                  stateMethod(createType, 'phone', e.target.value),
                  phoneNumber('phone', createType, stateMethod)
                )}
              />
              <label
                className={
                  `input-label ` +
                  (stateData.phone.length > 0 ||
                  typeof stateData.phone == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="phone"
              >
                Phone
              </label>
            </div>
            <div className="form-group">
              <input
                id="cell"
                value={stateData.cell}
                onChange={(e) => (
                  validateNumber('cell'),
                  stateMethod(createType, 'cell', e.target.value),
                  phoneNumber('cell', createType, stateMethod)
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.cell.length > 0 ||
                  typeof stateData.cell == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="cell"
              >
                Cell
              </label>
            </div>
            <div className="form-group">
              <input
                id="fax"
                value={stateData.fax}
                onChange={(e) => (
                  validateNumber('fax'),
                  stateMethod(createType, 'fax', e.target.value)
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.fax.length > 0 || typeof stateData.fax == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="fax"
              >
                Fax
              </label>
            </div>
            <div className="form-group">
              <input
                id="email"
                value={stateData.email}
                onChange={(e) =>
                  stateMethod(createType, 'email', e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.email.length > 0 ||
                  typeof stateData.email == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="email"
              >
                Email
              </label>
            </div>
            <div className="form-group-textarea">
              <label
                className={
                  stateData.contact_notes.length > 0 ? ' labelHover' : ''
                }
              >
                Contact Notes
              </label>
              <textarea
                id="contact_notes"
                rows="5"
                wrap="hard"
                maxLength="400"
                name="contact_notes"
                value={stateData.contact_notes}
                onChange={(e) =>
                  stateMethod(createType, 'contact_notes', e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="form-box" style={{ width: '49%' }}>
          <div className="form-box-heading">
            Quote Detail
            <div
              className="form-box-heading-item"
              onClick={() => setModal('accounts')}
            >
              <SVG svg={'move-file'}></SVG>
            </div>
          </div>
          <div className="form-box-container">
            <div className="form-group">
              <input
                onClick={() => setInputDropdown('quote_account')}
                value={manageFormFields(stateData.account, 'name')}
                onChange={(e) => (
                  setInputDropdown(''),
                  stateMethod(createType, 'account', e.target.value)
                )}
              />
              <label
                className={
                  `input-label ` +
                  (stateData.account.length > 0 ||
                  typeof stateData.account == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="account"
              >
                Account
              </label>
              <div onClick={() => setInputDropdown('quote_account')}>
                <SVG svg={'dropdown-arrow'}></SVG>
              </div>
              {input_dropdown == 'quote_account' && (
                <div className="form-group-list" ref={myRefs}>
                  {originalData &&
                    originalData.accounts
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="form-group-list-item"
                          onClick={(e) => (
                            stateMethod(createType, 'account', item),
                            setInputDropdown('')
                          )}
                        >
                          {item.name}
                        </div>
                      ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <input
                id="quote_name"
                value={stateData.quote_name}
                onChange={(e) =>
                  stateMethod(createType, 'quote_name', e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.quote_name.length > 0 ||
                  typeof stateData.quote_name == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="quote_name"
              >
                Quote Name
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
                id="lead"
                value={stateData.lead}
                onChange={(e) =>
                  stateMethod(createType, 'lead', e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.lead.length > 0 ||
                  typeof stateData.lead == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="lead"
              >
                Lead
              </label>
            </div>
            <div className="form-group">
              <input
                id="quote_number"
                value={stateData.quote_number}
                onChange={(e) => (
                  validateNumber('quote_number'),
                  stateMethod(createType, 'quote_number', e.target.value)
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.quote_number !== '' ||
                  typeof stateData.quote_number == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="quote_number"
              >
                Quote #
              </label>
            </div>
            <div className="form-group">
              <input
                id="po_number"
                value={stateData.po_number}
                onChange={(e) => (
                  validateNumber('po_number'),
                  stateMethod(createType, 'po_number', e.target.value)
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.po_number.length > 0 ||
                  typeof stateData.po_number == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="po_number"
              >
                PO #
              </label>
            </div>
            <div className="form-group-textarea">
              <label
                className={
                  stateData.quote_notes.length > 0 ? ' labelHover' : ''
                }
              >
                Quote Notes
              </label>
              <textarea
                id="quote_notes"
                rows="5"
                wrap="hard"
                maxLength="400"
                name="quote_notes"
                value={stateData.quote_notes}
                onChange={(e) =>
                  stateMethod(createType, 'quote_notes', e.target.value)
                }
              />
            </div>
          </div>

          <div className="form-box-heading">Quote Revision</div>
          <div className="form-box-container">
            <div className="form-group">
              <input
                id="quote_date"
                value={stateData.quote_date}
                onChange={(e) =>
                  validateDate(e, 'quote_date', createType, stateMethod)
                }
              />
              <label
                className={
                  `input-label ` +
                  (stateData.quote_date.length > 0 ||
                  typeof stateData.quote_date == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="quote_date"
              >
                Quote Date
              </label>
              <div
                onClick={() =>
                  input_dropdown == 'calendar'
                    ? setInputDropdown('')
                    : setInputDropdown('calendar')
                }
              >
                <SVG svg={'calendar'}></SVG>
              </div>
              {input_dropdown == 'calendar' && (
                <div className="form-group-list" ref={myRefs}>
                  <Calendar
                    onClickDay={(date) =>
                      stateMethod(
                        createType,
                        'quote_date',
                        formatDate(date),
                        setInputDropdown('')
                      )
                    }
                    minDate={new Date(Date.now())}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <input
                id="quote_discount"
                value={stateData.quote_discount}
                onChange={(e) => (
                  validateNumber('quote_discount'),
                  stateMethod(createType, 'quote_discount', e.target.value)
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.quote_discount.length > 0 ||
                  typeof stateData.quote_discount == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="quote_discount"
              >
                Discount %
              </label>
            </div>
            <div className="form-group">
              <input
                id="quote_tax"
                value={stateData.quote_tax}
                onChange={(e) =>
                  stateMethod(
                    createType,
                    'quote_tax',
                    validateTax(e.target.value)
                  )
                }
              />

              <label
                className={
                  `input-label ` +
                  (stateData.quote_tax.length > 0 ||
                  typeof stateData.quote_tax == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="quote_tax"
              >
                Tax Rate %
              </label>
            </div>
            <div className="form-group">
              <input
                id="quote_deposit"
                value={stateData.quote_deposit}
                onChange={(e) => (
                  validateNumber('quote_deposit'),
                  stateMethod(
                    createType,
                    'quote_deposit',
                    numberType(e, depositType)
                  )
                )}
              />

              <label
                className={
                  `input-label ` +
                  (stateData.quote_deposit.length > 0 ||
                  typeof stateData.quote_deposit == 'object'
                    ? ' labelHover'
                    : '')
                }
                htmlFor="quote_deposit"
              >
                Deposit
              </label>
              <div
                onClick={() =>
                  depositType == 'percentage'
                    ? (setDepositType('dollar'),
                      stateMethod(createType, 'quote_deposit', ''))
                    : (setDepositType('percentage'),
                      stateMethod(createType, 'quote_deposit', ''))
                }
              >
                {depositType == 'percentage' ? (
                  <SVG svg={'dollar'}></SVG>
                ) : (
                  <SVG svg={'percentage'}></SVG>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-box" style={{ width: '100%' }}>
          <div className="form-box-heading">
            Quote Estimate
            <div
              className="form-box-heading-item"
              onClick={() => (
                stateData.payment == 'deposit' ||
                stateData.payment == 'complete'
                  ? setMessage(
                      'Cannot update quote lines after a payment processed'
                    )
                  : setModal('add_quote_line'),
                setModalEdit('')
              )}
            >
              <SVG svg={'plus'}></SVG>
            </div>
            <div
              className="form-box-heading-item"
              onClick={() => (
                setModal('new_pdf'), stateMethod(changeFormType, null, '')
              )}
            >
              <SVG svg={'print'}></SVG>
            </div>
            {save && (
              <>
                <div
                  className="form-box-heading-item"
                  onClick={() => setModal('email')}
                >
                  <SVG svg={'send'}></SVG>
                </div>
                {edit == typeOfData ? (
                  <div
                    className="form-box-heading-item"
                    onClick={() => (
                      setEdit(''),
                      stateMethod(
                        'CREATE_CONTRACT',
                        'name',
                        manageFormFields(stateData.contact_name, 'contact_name')
                      ),
                      stateMethod('CREATE_CONTRACT', 'email', stateData.email),
                      stateMethod(
                        'CREATE_CONTRACT',
                        'description',
                        stateData.contact_notes
                      ),
                      changeView('contractForm'),
                      window.scrollTo(0, 0)
                    )}
                  >
                    Create Contract
                  </div>
                ) : null}

                {edit == typeOfData ? (
                  <div
                    className="form-box-heading-item"
                    onClick={() => (
                      setEdit(''),
                      resetState('RESET_JOB'),
                      stateMethod(
                        'CREATE_JOB',
                        'name',
                        manageFormFields(stateData.contact_name, 'contact_name')
                      ),
                      stateMethod(
                        'CREATE_JOB',
                        'salesperson',
                        stateData.salesperson
                      ),
                      stateMethod(
                        'CREATE_JOB',
                        'accountAddress',
                        generateAccountAddress(stateData)
                      ),
                      stateMethod('CREATE_JOB_ARRAY_ITEM', 'quotes', stateData),
                      changeView('job'),
                      setModal('accounts'),
                      window.scrollTo(0, 0)
                    )}
                  >
                    Create Job
                  </div>
                ) : null}

                {/* <div 
                  id="save" 
                  className="form-box-heading-item" 
                  onClick={(e) => edit == typeOfData 
                    ? 
                      stateData.payment == 'deposit' || stateData.payment == 'complete'
                      ?
                      setMessage('Cannot update quotes after a payment was processed')
                      :
                      submitUpdate(e, stateData, 'quotes', 'images', setMessage, 'update_quote', setLoading, token, 'quotes/update-quote', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'quotes')
                    : 
                    submitCreate(e, stateData, 'quotes', 'images', setMessage, 'create_quote', setLoading, token, 'quotes/create-quote', resetType, resetState, allData, setAllData, setDynamicSVG) 
                  }
                  >
                  {loading == 'create_quote' ? 
                  <div className="loading">
                    <span style={{backgroundColor: loadingColor}}></span>
                    <span style={{backgroundColor: loadingColor}}></span>
                    <span style={{backgroundColor: loadingColor}}></span>
                  </div>
                  : 
                    edit == typeOfData ? 'Update' : 'Save'
                  }
                </div> */}
              </>
            )}
            {message && (
              <div className="form-box-heading-message">
                <SVG svg={dynamicSVG}></SVG>
                <span>{message.substr(0, 200)}</span>
              </div>
            )}
          </div>
          <div className="form-box-container">
            <div className="form-estimate">
              {stateData.quote_lines.length > 0 &&
                stateData.quote_lines.map((item, idx) => (
                  <React.Fragment>
                    <span
                      key={idx}
                      onClick={() => (
                        setModal('add_quote_line'),
                        setModalEdit('quote_line'),
                        updateQuoteLine(
                          item,
                          stateMethod,
                          createQuoteLineType,
                          idx
                        ),
                        stateMethod(changeFormType, null, item.typeForm)
                      )}
                    >
                      <div className="form-estimate-line">
                        <SVG svg={'adjust'}></SVG>
                        <div>{item.quantity ? item.quantity : '0 qty.'}</div>
                        <div className="form-estimate-line-description">
                          {item.material
                            ? `${manageFormFields(item.material, 'name')} 
                              ${
                                item.model
                                ? ` / ${manageFormFields(item.model, 'name')}`
                                : ''
                              }`
                            : item.category
                            ? `${manageFormFields(item.category, 'name')}`
                            : item.model
                            ? `Sink: ${manageFormFields(item.model, 'name')}
                              ${
                                item.color
                                  ? ` / ${manageFormFields(item.color, 'name')}`
                                  : ''
                              }`
                            : item.description}
                        </div>
                        <div>
                          {item.price && item.quantity
                            ? manageEstimates( 'lineTotal', item.quantity, item.price )
                            : `(No subtotal)`}
                        </div>
                      </div>
                      <div className="form-estimate-line-label">
                        [Category:{' '}
                        {item.category
                          ? manageFormFields(item.category, 'name')
                          : 'none'}
                        ][{item.price ? `${item.price}/each` : 'No Price'}]
                      </div>
                    </span>
                  </React.Fragment>
                ))}

              {stateData.quote_lines.length > 0 && (
                <div className="form-estimate-line-total">
                  <label>Subtotal</label>
                  <span id="subtotal">${stateData.quote_subtotal}</span>
                </div>
              )}

              {stateData.quote_lines.length > 0 && (
                <div className="form-estimate-line-total">
                  <label>Taxable Discount</label>
                  <span id="taxableDiscount">
                    ${stateData.quote_taxable_discount}
                  </span>
                </div>
              )}

              {stateData.quote_lines.length > 0 && (
                <div className="form-estimate-line-total">
                  <label>Taxable Total</label>
                  <span id="taxableTotal">
                    ${stateData.quote_taxable_total}
                  </span>
                </div>
              )}

              {stateData.quote_lines.length > 0 && (
                <div className="form-estimate-line-total">
                  <label>Non-Taxable Subtotal</label>
                  <span id="nonTaxableSubtotal">
                    ${stateData.quote_nontaxable_subtotal}
                  </span>
                </div>
              )}

              {stateData.quote_lines.length > 0 && (
                <div className="form-estimate-line-total">
                  <label>Non-Taxable Discount</label>
                  <span id="nonTaxableSubtotal">
                    ${stateData.quote_nontaxable_discount}
                  </span>
                </div>
              )}

              {stateData.quote_lines.length > 0 && (
                <div className="form-estimate-line-total">
                  <label>Total</label>
                  <span id="total">${stateData.quote_total}</span>
                </div>
              )}

              {stateData.quote_lines.length > 0 && (
                <div className="form-estimate-line-total">
                  <label>Deposit</label>
                  <span id="deposit">${stateData.quote_deposit_total}</span>
                </div>
              )}

              {stateData.quote_lines.length > 0 && (
                <div className="form-estimate-line-total">
                  <label>Balance Due</label>
                  <span id="balance">${stateData.quote_balance}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuoteForm;
