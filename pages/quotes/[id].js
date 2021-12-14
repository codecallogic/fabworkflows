import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import {useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import SVGs from '../../files/svgs'
import PlacesAutocomplete from 'react-places-autocomplete'
import {geocodeByPlaceId} from 'react-places-autocomplete'
import {API} from '../../config'
import axios from 'axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import QuotePDF from '../../components/pdf/quote'
import Agreement from '../../components/pdf/agreement'
import {PDFViewer, PDFDownloadLink, BlobProvider} from '@react-pdf/renderer'
import withUser from '../withUser'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const Quote = ({showSideNav, hideSideNav, quoteData, quote, createQuote, priceList, addressList, quoteLine, createQuoteLine, brands, models, categories, addQuoteLine, resetQuoteLine, updateQuoteLine, removeQuoteLine, products, productLine, createProduct, product_categories, resetQuote}) => {
  // console.log(quoteData)
  const myRefs = useRef(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [modal, setModal] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState('')
  const [show, setShow] = useState('address')
  const [input_dropdown, setInputDropdown] = useState('')
  const [calendar, setCalendar] = useState('')
  const [allPriceLists, setPriceLists] = useState(priceList ? priceList : '')
  const [allAddresses, setAllAddresses] = useState(addressList ? addressList : '')
  const [allBrands, setAllBrands] = useState(brands ? brands : '')
  const [allModels, setAllModels] = useState(models ? models : '')
  const [allCategories, setAllCategories] = useState(categories ? categories : '')
  const [allProductCategories, setAllProductCategories] = useState(product_categories ? product_categories : '')
  const [allProducts, setAllProducts] = useState(products ? products : '')
  const [typeForm, setTypeForm] = useState('')
  const [update, setUpdate] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(true)
  const [customerEmail, setCustomerEmail] = useState('')
  const [discount_total, setDiscountTotal] = useState(0)
  const [width, setWidth] = useState()

  //////////// QUOTE LINE SEARCH ////////////
  const [search, setSearch] = useState('')
  const [searchItems, setSearchItems] = useState(false)
  const [filterSearch, setFilterSearch] = useState('')

  useEffect(() => {
    if(search.length == 0) setSearchItems(false)
  }, [search])


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
 
  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

  useEffect(() => {
    for(let key in quoteData){
      createQuote(key, quoteData[key])
    }
  }, [])

  useEffect(() => {
    if(window.innerWidth < 992) hideSideNav()
    
    function handleResize() {
      if(width){
        if(width < 992){hideSideNav()}
        if(width > 992){showSideNav()}
      }
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, [width])
  
  useEffect(() => {
    
    let orderNumber = Math.floor(100000000 + Math.random() * 900000000)
    createQuote('quote_number', orderNumber)
    createQuote('quote_date', formatDate(new Date(Date.now())))
    
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])

  useEffect(() => {
    enableQuoteSubmission()
  }, [quote])

  const handleSelect = async (e, type, id) => {
    let geo
    
    if(id){
     geo = await geocodeByPlaceId(id)
    }

    if(geo){
      geo[0].address_components.forEach((item) => {
        console.log(item)
        if(item.types.includes('postal_code')){
          createQuote('zip_code', item.long_name)
        }
        if(item.types.includes('country')){
          createQuote('country', item.long_name)
        }
      })
    }

    if(type == 'address_one'){
      createQuote('address_one', e.split(',')[0])
    }
    
    createQuote('city', e.split(',')[1])
    createQuote('state', e.split(',')[2])
  }

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /^(\d+(\d{0,2})?|\.?\d{1,2})$/
    input.value = input.value.split(regex).join('')
  }

  const validateIsEmail = (type) => {
    const input = document.getElementById(type)
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
    return regex.test(input.value)
  }

  const formatDate = (e) => {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var month = monthNames[e.getUTCMonth()]
    var day = e.getUTCDate()
    var year = e.getUTCFullYear()
    return `${month} ${day}, ${year}`
  }

  const handleDate = (date) => {
    setCalendar(date)
    createQuote('quote_date', formatDate(date))
    setInputDropdown('')
  }

  const selectSavedAddress = (data) => {
    for(let key in data){
      createQuote(key, data[key])
    }
  }

  const validateIsPrice = (evt) => {
    let newValue = Number(evt.target.value.replace(/\D/g, '')) / 100
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    
    return formatter.format(newValue)
  }

  const validateIsNumberToCents = (evt) => {
    let newValue = Number(evt.target.value.replace(/\D/g, '')) / 100
    return newValue
  }

  const validateIsNumberToCentsCheck2 = (evt) => {
    // console.log(evt)
    let newValue = Number(evt.replace(/\D/g, '')) / 100
    return newValue
  }


  const validateIsPriceNumber = (amount) => {
    let newValue = amount
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }) 
    return formatter.format(newValue)
  }


  // ADD QUOTE LINES
  useEffect(() => {

    // TOTAL AND NONTAXABLE SUBTOTAL
    
    let subtotal = 0
    let nontaxablesubtotal = 0

    quote.quote_lines.forEach((item) => {
      if(item.taxable) subtotal += (item.quantity * item.price_unformatted)
      if(!item.taxable) nontaxablesubtotal += (item.quantity * item.price_unformatted)
    })
    
    createQuote('quote_subtotal', subtotal)
    createQuote('quote_nontaxable_subtotal', nontaxablesubtotal)

    let total = 0
    quote.quote_lines.forEach((item) => {
      if(item.discount){
        if(item.taxable){
          total += ((((item.quantity * item.price_unformatted) - ((item.quantity * item.price_unformatted) * (quote.quote_discount / 100)))))
        }
      }else{
        if(item.taxable){
          total += (item.quantity * item.price_unformatted)
        }        
      }
    })
    
    total += (total * quote.quote_tax/100)

    !nontaxablesubtotal
    ? 
      (total = total - (nontaxablesubtotal - (nontaxablesubtotal * (quote.quote_discount/100))))
    :
      (total = total + (nontaxablesubtotal - (nontaxablesubtotal * (quote.quote_discount/100))))

    createQuote('quote_total', total)

    let totalDeposit = quote.quote_deposit ? quote.quote_deposit.includes('$') ? +quote.quote_deposit.replace('$', '') : (quote.quote_total * (quote.quote_deposit.replace('%', '')/100)): 0

    let balance = total - totalDeposit
    createQuote('quote_balance', balance)

    // DISCOUNT TOTAL
    let discountTotal = 0
    quote.quote_lines.forEach((item) => { 
      if(item.discount) discountTotal += +quote.quote_subtotal * (+quote.quote_discount / 100)
    })
    setDiscountTotal(discountTotal)

  }, [quote.quote_lines, quote.quote_discount, quote.quote_tax, quote.quote_deposit])

  // SUM UP QUOTE LINES
  useEffect(() => {
    const speed = 150;

    if(quote.quote_lines.length > 0){
      const updateCount = () => {
        let el = document.getElementById('total')
        const target = +el.getAttribute('data-target')
        const count = +el.innerText.replace('$', '')

        const inc = target / speed;

        if(count < target){
          el.innerText = count + inc
          setTimeout(updateCount, 1)
        }else{
          el.innerText = validateIsPriceNumber(target)
        }
      }
      updateCount()
    }

  }, [quote.quote_total])

  const setQuoteLine = (item) => {
    for(let key in item){
      createQuoteLine(key, item[key])
    }
  }

  const renderQuote = (url) => {
    if(!quote.contact_name) return setError('Contact name is required')
    if(!quote.address_one) return setError('Contact address is required')
    if(!quote.city) return setError('Contact city is required')
    if(!quote.state) return setError('Contact state is required')
    if(!quote.zip_code) return setError('Contact zip code is required')
    if(!quote.phone) return setError('Contact phone is required')
    if(!quote.quote_tax) return setError('Tax is required')
    if(!quote.quote_name) return setError('Quote name is required')
    if(!quote.salesperson) return setError('Salesperson is required')
    if(quote.quote_lines < 1) return setError('At least one item is required')
    
    if(url) window.open(url, '_blank')
  }

  const downloadQuote = (url) => {
    if(!quote.contact_name) return setError('Contact name is required')
    if(!quote.address_one) return setError('Contact address is required')
    if(!quote.city) return setError('Contact city is required')
    if(!quote.state) return setError('Contact state is required')
    if(!quote.zip_code) return setError('Contact zip code is required')
    if(!quote.phone) return setError('Contact phone is required')
    if(!quote.quote_tax) return setError('Tax is required')
    if(!quote.quote_name) return setError('Quote name is required')
    if(!quote.salesperson) return setError('Salesperson is required')
    if(quote.quote_lines < 1) return setError('At least one item is required')

    let link = document.createElement('a');
    link.href = url;
    link.download = 'quote.pdf';
    link.dispatchEvent(new MouseEvent('click'));
  }

  const renderAgreement = (url) => {
    if(!quote.contact_name) return setError('Contact name is required')
    if(!quote.quote_name) return setError('Quote name is required')
    
    if(url) window.open(url, '_blank')
  }

  const downloadAgreement = (url) => {
    if(!quote.contact_name) return setError('Contact name is required')
    if(!quote.quote_name) return setError('Quote name is required')
    
    let link = document.createElement('a');
    link.href = url;
    link.download = 'agreement.pdf';
    link.dispatchEvent(new MouseEvent('click'));
  }

  const enableQuoteSubmission = () => {
    if(!quote.contact_name) return setDisableSubmit(true)
    if(!quote.address_one) return setDisableSubmit(true)
    if(!quote.city) return setDisableSubmit(true)
    if(!quote.state) return setDisableSubmit(true)
    if(!quote.zip_code) return setDisableSubmit(true)
    if(!quote.phone) return setDisableSubmit(true)
    if(!quote.salesperson) return setDisableSubmit(true)
    if(!quote.quote_tax) return setDisableSubmit(true)
    if(!quote.quote_name) return setDisableSubmit(true)
    if(quote.quote_lines < 1) return setDisableSubmit(true)

    return setDisableSubmit(false)
  }

  const isValidEmail = (email) => {
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return true
    }else{
      return false
    }
  }

  const updateQuote = async () => {
    setLoading('submit')
    setError('')
    setModal('')
    if(isValidEmail(quote.email)){
      try {
        const responseSaveQuote = await axios.post(`${API}/transaction/update-quote`, quote)
        setLoading('')
        for(let key in responseSaveQuote.data){
          createQuote(key, responseSaveQuote.data[key])
        }
        window.location.reload();
      } catch (error) {
        setLoading('')
        setModal('error')
        if(error) error.response ? setError(error.response.data) : setError('Error occurred could not save quote')
      }
    }else{
      setError('Invalid email address')
    }
  }
  
  const sendQuote = async (e) => {
    e.preventDefault()
    setLoading('send_quote')
    setError('')
    setMessage('')
    try {
      const responseQuote = await axios.post(`${API}/transaction/send-quote`, {quote: quote, customer: customerEmail})
      setLoading('')
      setMessage('Email was sent')
    } catch (error) {
      setLoading('')
      if(error) error.response ? setError(error.response.data) : setError('Error occurred could not send quote')
    }
  }

  return (
    <>
    <TopNav></TopNav>
    <div className="clientDashboard">
      <SideNav width={width}></SideNav>
      <div className="clientDashboard-view-slab_form-container">
        <div className="clientDashboard">
      {/* <PDFViewer width={'100%'} height={1000} showToolbar={true}>
        <Agreement date={quote.quote_date} quote_name={quote.quote_name} account_name={quote.contact_name}/>
      </PDFViewer> */}
      {/* <PDFViewer width={'100%'} height={1000} showToolbar={true}>
        <QuotePDF date={quote.quote_date} order={quote.quote_number} contact_name={quote.contact_name} address={quote.address_one} city={quote.city} state={quote.state} zip_code={quote.zip_code} phone={quote.phone} lines={quote.quote_lines} subtotal={quote.quote_subtotal} tax={quote.quote_tax} total={quote.quote_total} POnumber={quote.po_number} salesperson={quote.salesperson}/>
      </PDFViewer> */}
      </div>
      <div className="clientDashboard-view-slab_form-heading">
        <span>Update Quote</span>
        <div className="form-error-container">
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        </div>
      </div>
      <div className="clientDashboard-view-slab_form">
        <div className="clientDashboard-view-form-left">
        <div className="clientDashboard-view-slab_form-left-box">
          <div className="clientDashboard-view-form-left-box-heading">
            <span>Set Address</span>
            <span onClick={() => (setModal('add_address'), setShow('address'))}><SVGs svg={'edit'}></SVGs></span>
          </div>
          <div className="clientDashboard-view-form-left-box-container-2">
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Contact Name: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.contact_name ? <span className="clientDashboard-view-form-left-box-container-2-item-content-toggle">{quote.contact_name} <span className="button-toggle" onClick={() => (createQuote('contact_name', ''), setInputDropdown(''))}>List</span></span>: 
                    <>
                    <div className="clientDashboard-view-form-left-box-container-2-item-content-textarea">
                      <textarea rows="2" name="name" placeholder="(Select By Name)" onClick={() => setInputDropdown('quote_address')} value={quote.contact_name} readOnly></textarea>
                      <SVGs svg={'dropdown-arrow'}></SVGs>
                    </div>
                    {input_dropdown == 'quote_address' && 
                    <div className="clientDashboard-view-form-left-box-container-2-item-content-list" ref={myRefs}>
                      {allAddresses && allAddresses.map((item, idx) => 
                        <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item" onClick={() => selectSavedAddress(item)}>
                        {item.contact_name}
                       </div>
                      )   
                      }
                    </div>
                    }
                    </>
                  }
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Address: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.address_one ? quote.address_one : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">City: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.city ? quote.city : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">State: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.state ? quote.state : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Zip Code: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.zip_code ? quote.zip_code : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Country: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.country ? quote.country : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Phone: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.phone ? quote.phone : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Cell: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.cell ? quote.cell : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Fax: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.fax ? quote.fax : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Email: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.email ? quote.email : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Notes: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.address_notes ? quote.address_notes : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clientDashboard-view-form-right">
        <div className="clientDashboard-view-slab_form-left-box">
          <div className="clientDashboard-view-form-left-box-heading">
            <span>Quote Detail</span>
            <span onClick={() => setModal('quote_detail')}><SVGs svg={'edit'}></SVGs></span>
          </div>
          <div className="clientDashboard-view-form-left-box-container-2">
          <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Quote Name: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.quote_name? quote.quote_name : ''}
                </div>
              </div>
              {/* <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Price List: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.price_list ? quote.price_list : ''}
                </div>
              </div> */}
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Salesperson: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.salesperson ? quote.salesperson : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Lead: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.lead ? quote.lead : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Quote #: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.quote_number ? quote.quote_number : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">PO #: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.po_number ? quote.po_number : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Notes: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.quote_notes ? quote.quote_notes : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clientDashboard-view-slab_form-quoteLine">
          <div className="clientDashboard-view-slab_form-quoteLine-left">
            <div className="clientDashboard-view-slab_form-quoteLine-left-box">
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-heading">
                <span>Revision</span>
                <span onClick={() => setModal('revision')}><SVGs svg={'edit'}></SVGs></span>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-item">
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-heading">Quote Date: </div>
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-content">
                  {quote.quote_date ? quote.quote_date : ''}
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-item">
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-heading">Discount: </div>
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-content">
                  {quote.quote_discount ? `${quote.quote_discount}%` : ''}
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-item">
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-heading">Tax Rate: </div>
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-content">
                  {quote.quote_tax ? `${quote.quote_tax}%` : ''}
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-item">
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-heading">Deposit: </div>
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-content">
                  {quote.quote_deposit ? quote.quote_deposit : ''}
                </div>
              </div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_form-quoteLine-right">
            <div className="clientDashboard-view-slab_form-quoteLine-left-box">
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-heading">
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-heading-left">
                <div>Quote Estimate</div>
                <span className="clientDashboard-view-slab_form-quoteLine-right-box-heading-icon" onClick={() => (setUpdate(false), setTypeForm(''), setModal('quote_line'))}><SVGs svg={'plus'}></SVGs></span>
                <span className="clientDashboard-view-slab_form-quoteLine-right-box-heading-icon" onClick={() => (setUpdate(false), setModal('print'))}><SVGs svg={'print'}></SVGs></span>
                </div>
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-heading-right">
                  <button className="form-button w100 flex-span">{<span onClick={() => (setCustomerEmail(quoteData.email), setModal('email_quote'))}><SVGs svg={'send'}></SVGs>Quote</span>}</button>
                  <button className="form-button w100" disabled={disableSubmit}>{loading !== 'submit' && <span onClick={() => updateQuote()}>Update</span>} {loading == 'submit' && <div className="loading"><span></span><span></span><span></span></div>}</button>
                </div>
              </div>
              { quote.quote_lines.length > 0 && quote.quote_lines.map((item, idx) => 
                <div key={idx} id={`quote_line_${idx}`}className="clientDashboard-view-slab_form-quoteLine-right-box-line">
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-line-container" onClick={() => (setModal('quote_line'), setTypeForm(item.typeForm), setQuoteLine(item), setEdit(idx), setUpdate(true))}>
                    <SVGs svg={'adjust'}></SVGs>
                    <div className="clientDashboard-view-slab_form-quoteLine-right-box-line-quantity">{item.quantity}</div>
                    <pre className="clientDashboard-view-slab_form-quoteLine-right-box-line-description">{item.brand ? `${item.brand}/${item.model}` : item.description}</pre>
                    <div className="clientDashboard-view-slab_form-quoteLine-right-box-line-total">{item.price_unformatted ? validateIsPriceNumber(item.quantity * item.price_unformatted) : `(No price)`}</div>
                  </div>
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-line-label">
                    [Category: {item.category ? item.category : 'none'}][{item.price ? `${item.price}/each` : 'No Price'}]
                  </div>
                </div>
              )
              }
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate">
                { quote.quote_lines.length > 0 &&
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                   <label>Subtotal</label>
                   <span id="subtotal">{validateIsPriceNumber(quote.quote_subtotal)}</span>
                  </div>
                }
                { quote.quote_lines.length > 0 &&
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-discount">
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                   <label>Discount</label>
                   <span id="discount">{discount_total ? validateIsPriceNumber(discount_total) : 0}</span>
                  </div>
                </div>
                }
                { quote.quote_lines.length > 0 &&
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-tax">
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                   <label>Tax</label>
                   <span id="tax">{quote.quote_tax ? (validateIsPriceNumber((quote.quote_subtotal - (quote.discount ? quote.quote_subtotal * (quote.quote_discount/100) : 0)) * (quote.quote_tax / 100))) : 0}</span>
                  </div>
                </div>
                }
                { quote.quote_lines.length > 0 &&
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-nontaxable-subtotal">
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                   <label>Non-Taxable Subtotal</label>
                   <span id="nontaxable_subtotal">{validateIsPriceNumber(quote.quote_nontaxable_subtotal)}</span>
                  </div>
                </div>
                }
                { quote.quote_lines.length > 0 &&
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-nontaxable-discount">
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                    <label>Non-Taxable Discount</label>
                    <span id="discount">{quote.quote_discount ? (validateIsPriceNumber(quote.quote_nontaxable_subtotal * (quote.quote_discount / 100))) : 0}</span>
                  </div>
                </div>
                }
                { quote.quote_lines.length > 0 &&
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-total">
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                    <label>Total</label>
                    <span id="total" data-target={quote.quote_total}></span>
                  </div>
                </div>
                }
                { quote.quote_lines.length > 0 &&
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-deposit">
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                    <label>Deposit</label>
                    <span id="deposit" >{quote.quote_deposit ? quote.quote_deposit.includes('$') ? quote.quote_deposit : validateIsPriceNumber((quote.quote_total * (quote.quote_deposit.replace('%', '')/100))): 0}</span>
                  </div>
                </div>
                }
                { quote.quote_lines.length > 0 &&
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-balance">
                  <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                    <label>Balance Due</label>
                    <span id="balance" >{validateIsPriceNumber(quote.quote_balance)}</span>
                  </div>
                </div>
                }
              </div>
          </div>
          </div>
        </div>
      </div>

{/* /////////////////////////  MODALS ///////////////////////////////////// */}


      { modal == 'add_address' &&
        <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" touch-action="none" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{msTransform: `translateX(${translate.x}px) translateY(${translate.y}px)`, MozTransform: `translateX(${translate.x}px) translateY(${translate.y}px`, WebkitTransform: `translateX(${translate.x}px) translateY(${translate.y}px)`, transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Address'}</span>
            <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <div className="addFieldItems-modal-form-container">
          <form className="addFieldItems-modal-form">
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="name">Contact Name</label>
                <textarea id="name" rows="1" name="name" placeholder="(Contact Name)" value={quote.contact_name} onChange={(e) => createQuote('contact_name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Contact Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <PlacesAutocomplete value={quote.address_one} onChange={(e) => createQuote('address_one', e)} onSelect={(e) => handleSelect(e, 'address_one', document.getElementById('address_place_id').value)} searchOptions={searchOptionsAddress}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-group-single-textarea-autocomplete">
                  <label htmlFor="address">Address One</label>
                  <div className="form-group-single-textarea-autocomplete-textarea"><textarea {...getInputProps({rows: 2, placeholder: 'Address One'})} required/>
                  {show == 'address' ? <span onClick={() => setShow('hide')}>Hide</span> : <span onClick={() => setShow('address')}>Show</span>}
                  </div>
                  <div  className="form-group-single-textarea-autocomplete-box">
                  {show == 'address' && loading ? <div>...loading</div> : null}
                  {show == 'address' && suggestions.map((suggestion, idx) => {
                    const className = suggestion.active
                    ? 'form-group-single-textarea-autocomplete-suggestion-active'
                    : 'form-group-single-textarea-autocomplete-suggestion';
                    const style = suggestion.active ? {cursor: 'pointer'} : {cursor: 'pointer'}
                    return (
                    <div key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}
                    <input id="address_place_id" value={suggestion.placeId} readOnly/>
                    </div>
                    )
                  })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="address">City</label>
                <textarea id="city" rows="1" name="city" placeholder="(City)" value={quote.city} onChange={(e) => createQuote('city', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(City)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="state">State</label>
                <textarea id="state" rows="1" name="state" placeholder="(State)" value={quote.state} onChange={(e) => createQuote('state', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(State)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="zip_code">Zip Code</label>
                <textarea id="zip_code" rows="1" name="zip_code" placeholder="(Zip Code)" value={quote.zip_code} onChange={(e) => createQuote('zip_code', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Zip Code)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="phone">Phone</label>
                <textarea id="phone_number" rows="1" name="phone" placeholder="(Phone Number)" value={quote.phone} onChange={(e) => (validateIsNumber('phone_number'), createQuote('phone', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Phone Number)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="cell">Cell Number</label>
                <textarea id="cell_number" rows="1" name="cell" placeholder="(Cell Number)" value={quote.cell} onChange={(e) => (validateIsNumber('cell_number'), createQuote('cell', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Cell Number)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} ></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="fax">Fax</label>
                <textarea id="fax" rows="1" name="fax" placeholder="(Fax)" value={quote.fax} onChange={(e) => (createQuote('fax', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Fax)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} ></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="email">Email</label>
                <textarea id="email" rows="1" name="email" placeholder="(Email)" value={quote.email} onChange={(e) => (createQuote('email', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Email)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} ></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" rows="4" name="notes" placeholder="(Notes)" value={quote.address_notes} onChange={(e) => (createQuote('address_notes', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Notes)'} ></textarea>
              </div>
            </div>
          </form>
          </div>
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          {!edit && <button onClick={(e) => (e.preventDefault(), setModal(''))} className="form-button w100">{loading !== 'address' && <span>Done</span>} {loading == 'address' && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {edit == 'color' && <button onClick={(e) => updateColor(e)} className="form-button w100">{loading == 'address' && <span>Update Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        </div>
      </div>
      }
      { modal == 'quote_detail' &&
        <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Quote Detail'}</span>
            <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <div className="addFieldItems-modal-form-container">
          <form className="addFieldItems-modal-form" onSubmit={(e) => (e.preventDefault(), setModal(''))}>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_name">Quote Name</label>
                <textarea id="quote_name" rows="1" name="quote_name" placeholder="(Quote Name)" value={quote.quote_name} onChange={(e) => createQuote('quote_name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
              </div>
            </div>
            {/* <div className="form-group-single-dropdown">
                <label htmlFor="">Price List</label>
                <div className="form-group-single-dropdown-textarea">
                  <textarea id="price_list" rows="2" name="price_list" placeholder="(Select Price List)" onClick={() => setInputDropdown('price_list')} value={quote.price_list} readOnly></textarea>
                  <SVGs svg={'dropdown-arrow'}></SVGs>
                </div>
                {input_dropdown == 'price_list' && 
                <div className="form-group-single-dropdown-list" ref={myRefs}>
                  {allPriceLists && allPriceLists.map((item, idx) => 
                    <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item" onClick={() => (createQuote('price_list', `${item.name} (${item.tax}%)`), createQuote('price_list_id', item._id), createQuote('quote_tax', item.tax), setInputDropdown(''))}>
                    {item.name} ({item.tax}%)
                    </div>
                  )   
                  }
                </div>
                }
            </div> */}
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="salesperson">Salesperson</label>
                <textarea id="salesperson" rows="1" name="salesperson" placeholder="(Salesperson)" value={quote.salesperson} onChange={(e) => createQuote('salesperson', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Salesperson)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="lead">Lead</label>
                <textarea id="lead" rows="1" name="lead" placeholder="(Lead)" value={quote.lead} onChange={(e) => createQuote('lead', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Lead)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_number">Quote #</label>
                <textarea id="quote_number" rows="1" name="quote_number" placeholder="(Quote Number)" value={quote.quote_number} onChange={(e) => (validateIsNumber('quote_number'), createQuote('quote_number', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Number)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="po_number">PO #</label>
                <textarea id="po_number" rows="1" name="po_number" placeholder="(PO #)" value={quote.po_number} onChange={(e) => (validateIsNumber('po_number'), createQuote('po_number', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(PO #)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_notes">Notes</label>
                <textarea id="quote_notes" rows="4" name="quote_notes" placeholder="(Notes)" value={quote.quote_notes} onChange={(e) => (createQuote('quote_notes', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Notes)'} ></textarea>
              </div>
            </div>
          </form>
          </div>
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          {!edit && <button onClick={(e) => (e.preventDefault(), setModal(''))} className="form-button w100">{!loading && <span>Done</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {edit == 'color' && <button onClick={(e) => updateColor(e)} className="form-button w100">{!loading && <span>Update Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        </div>
      </div>
      }
      { modal == 'revision' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Revision'}</span>
            <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <form className="addFieldItems-modal-form" onSubmit={(e) => (e.preventDefault(), setModal(''))}>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-dropdown">
                <label htmlFor="quote_date">Date</label>
                <div className="form-group-single-textarea-dropdown-input">
                  <textarea id="quote_date" rows="1" name="quote_date" placeholder="(Quote Date)" value={quote.quote_date} onClick={() => input_dropdown == 'calendar' ? setInputDropdown('') : setInputDropdown('calendar')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Date)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly></textarea>
                  <span onClick={() => input_dropdown == 'calendar' ? setInputDropdown('') : setInputDropdown('calendar')}><SVGs svg={'calendar'}></SVGs></span>
                  {input_dropdown == 'calendar' && <span className="form-group-single-textarea-dropdown-input-popup">
                    <Calendar
                      onClickDay={(date) => handleDate(date)}
                      value={calendar}
                      minDate={new Date(Date.now())}
                    />
                  </span>
                  }
                </div>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_discount">Discount %</label>
                <textarea id="quote_discount" rows="1" name="quote_discount" placeholder="(Quote Discount)" value={quote.quote_discount} onChange={(e) => (validateIsNumber('quote_discount'), createQuote('quote_discount', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Discount)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_tax">Tax %</label>
                <textarea id="quote_tax" rows="1" name="quote_tax" placeholder="(Quote Tax)" value={quote.quote_tax} onChange={(e) => (validateIsNumber('quote_tax'), createQuote('quote_tax', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Tax)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-dropdown">
                <label htmlFor="quote_deposit">Deposit</label>
                <div className="form-group-single-textarea-dropdown-input">
                  <textarea id="quote_deposit" rows="1" name="quote_deposit" placeholder="(Quote Deposit)" value={quote.quote_deposit} onChange={(e) => (validateIsNumber('quote_deposit'), createQuote('quote_deposit', show == 'address' ? `$${e.target.value}` : `${e.target.value}%`))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Deposit)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
                  {show == 'address' ? <span onClick={() => (createQuote('quote_deposit', ''), setShow('percentage'))}><SVGs svg={'percentage'}></SVGs></span> : <span onClick={() => (createQuote('quote_deposit', ''),setShow('address'))}><SVGs svg={'dollar'}></SVGs></span>}
                </div>
              </div>
            </div>
            {!edit && <button type="submit" className="form-button w100">{!loading && <span>Done</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          </form>
        </div>
      </div>
      }
      { modal == 'quote_line' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header" >
            <span className="addFieldItems-modal-form-title"><div>{edit ? 'Edit Color' : 'Add Quote Line'}</div> {update ? <span onClick={() => (removeQuoteLine(edit), setModal(''), setError(''), setEdit(''), resetQuoteLine())}><SVGs svg={'thrash-can'}></SVGs></span> : null}
            
            <div className={`form-group-search-small`}>
              <form autoComplete="off">
                <input type="text" name="search" placeholder="Search" value={search} onChange={(e) => (setSearchItems(true), setSearch(e.target.value))} onFocus={(e) => (setSearchItems(true), e.target.placeholder = '', setError(''))} onBlur={(e) => (e.target.placeholder = 'Search', setError(''))} onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  required></input>
              </form>
            </div>
            
            </span>

            {typeForm == '' && 
              <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
            }
            {typeForm !== '' && 
              <div onClick={() => (setTypeForm(''), resetQuoteLine(), setUpdate(false))}><SVGs svg={'arrow-left-large'}></SVGs></div>
            }
          </div>
          <div className="addFieldItems-modal-form-container">
          {searchItems && <div className="addFieldItems-modal-form-container-searchList">
            <div className="addFieldItems-modal-form-container-searchList-categories-container">
              <div className="addFieldItems-modal-form-container-searchList-categories">
                <span className={`addFieldItems-modal-form-container-searchList-categories-item ` + (filterSearch == 'products' ? 'categoryClicked' : '')} onClick={() => filterSearch == 'products' ? setFilterSearch('') : setFilterSearch('products')}>Products</span>
                <span className={`addFieldItems-modal-form-container-searchList-categories-item ` + (filterSearch == 'priceLists' ? ' categoryClicked' : '')} onClick={() => filterSearch == 'priceLists' ? setFilterSearch('') : setFilterSearch('priceLists')}>Price List</span>
              </div>
              <span onClick={() => setSearchItems(false)}><SVGs svg={'close'}></SVGs></span>
            </div>
            <div className="addFieldItems-modal-form-container-searchList-container">
              {filterSearch !== 'priceLists' &&
              <>
              <div className="addFieldItems-modal-form-container-searchList-header">
                Products
              </div>
              <div className="addFieldItems-modal-form-container-searchList-list">
                { allProducts && allProducts.map((item, idx) => 
                  search.length > 0 ? 
                  filterProductsSearch(item) ? 
                    <div key={idx} className="addFieldItems-modal-form-container-searchList-list-item" onClick={() => (setSearchItems(false),createQuoteLine('typeForm', 'products'), setTypeForm('products'), createQuoteLine('brand', item.brand), createQuoteLine('model', item.model), createQuoteLine('category', item.category), createQuoteLine('description', item.description), createQuoteLine('price', item.price), createQuoteLine('price_unformatted', validateIsNumberToCentsCheck2(item.price)), setInputDropdown(''))}>
                    {item.brand} / {item.category} / {item.model}
                    </div>
                  : 
                    null
                  :
                  <div key={idx} className="addFieldItems-modal-form-container-searchList-list-item" onClick={() => (setSearchItems(false),createQuoteLine('typeForm', 'products'), setTypeForm('products'), createQuoteLine('brand', item.brand), createQuoteLine('model', item.model), createQuoteLine('category', item.category), createQuoteLine('description', item.description), createQuoteLine('price', item.price), createQuoteLine('price_unformatted', validateIsNumberToCentsCheck2(item.price)),setInputDropdown(''))}>
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
                  { allPriceLists && allPriceLists.map((item, idx) => 
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
          <form className="addFieldItems-modal-form">
            {typeForm == '' && <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-box-container"><span className="form-group-single-textarea-box" onClick={() => (createQuoteLine('typeForm', 'products'), setTypeForm('products'))}>Product</span></div>
              <div className="form-group-single-textarea-box-container"><span className="form-group-single-textarea-box" onClick={() => (createQuoteLine('typeForm', 'priceList'), setTypeForm('priceList'))}>Price List</span></div>
              <div className="form-group-single-textarea-box-container"><span className="form-group-single-textarea-box" onClick={() => (createQuoteLine('typeForm', 'miscellaneous'), setTypeForm('miscellaneous'))}>Miscellaneous Item</span></div>
            </div>
            }
            {
              typeForm == 'miscellaneous' && 
              <>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-field">
                  <label htmlFor="misc_quantity">Quantity</label>
                  <textarea id="misc_quantity" rows="1" name="misc_quantity" placeholder="(Quantity)" value={quoteLine.quantity} onChange={(e) => (validateIsNumber('misc_quantity'), createQuoteLine('quantity', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quantity)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                </div>
              </div>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-field">
                  <label htmlFor="misc_description">Description</label>
                  <textarea id="misc_description" rows="4" name="misc_description" placeholder="(Description)" value={quoteLine.description} onChange={(e) => (createQuoteLine('description', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Description)'} wrap="hard"></textarea>
                </div>
              </div>
              <div className="form-group-single-dropdown">
                <label htmlFor="category">Category</label>
                <div className="form-group-single-dropdown-textarea">
                  <textarea id="category" rows="2" name="category" placeholder="(Select Category)" onClick={() => setInputDropdown('category')} value={quoteLine.category} readOnly></textarea>
                  <SVGs svg={'dropdown-arrow'}></SVGs>
                </div>
                {input_dropdown == 'category' && 
                <div className="form-group-single-dropdown-list" ref={myRefs}>
                  {allCategories && allCategories.map((item, idx) => 
                    <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item" onClick={() => (createQuoteLine('category', item.name), setInputDropdown(''))}>
                    {item.name}
                    </div>
                  )   
                  }
                </div>
                }
              </div>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-field">
                  <label htmlFor="misc_price">Unit Price</label>
                  <textarea id="misc_price" rows="1" name="misc_price" placeholder="(0.00)" value={quoteLine.price} onChange={(e) => (createQuoteLine('price', validateIsPrice(e)), createQuoteLine('price_unformatted', validateIsNumberToCents(e)))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(0.00)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
                </div>
              </div>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-checkbox">
                  <input type="checkbox" name="taxable" id="taxable" hidden={true} checked={quoteLine.taxable ? true : false} readOnly/>
                  <label htmlFor="taxable" onClick={() => (document.getElementById('taxable').checked ? createQuoteLine('taxable', false) : createQuoteLine('taxable', true))}></label>
                  <span>Taxable</span>
                </div>
                <div className="form-group-single-textarea-checkbox">
                  <input type="checkbox" name="discount" id="discount_checkbox" hidden={true} checked={quoteLine.discount ? true : false} readOnly/>
                  <label htmlFor="discount_checkbox" onClick={() => (document.getElementById('discount_checkbox').checked ? createQuoteLine('discount', false) : createQuoteLine('discount', true))}></label>
                  <span>Allow discount</span>
                </div>
              </div>
              {/* {update ? 
                <button onClick={(e) => (e.preventDefault(), updateQuoteLine(edit, quoteLine), setModal(''), setTypeForm(''), resetQuoteLine())} className="form-button w100">{!loading && <span>Update</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
                : 
                <button onClick={(e) => (e.preventDefault(), addQuoteLine(quoteLine), setModal(''), setTypeForm(''), resetQuoteLine())} className="form-button w100">{!loading && <span>Save</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
              }
              {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>} */}
              </>
            }
            {
              typeForm == 'products' && 
              <>
              <div className="form-group-single-dropdown">
                <label htmlFor="brand">Brand</label>
                <div className="form-group-single-dropdown-textarea">
                  <textarea id="brand" rows="2" name="brand" placeholder="(Select Brand)" onClick={() => setInputDropdown('products')} value={quoteLine.brand} readOnly></textarea>
                  <SVGs svg={'dropdown-arrow'}></SVGs>
                </div>
                {input_dropdown == 'products' && 
                <div className="form-group-single-dropdown-list" ref={myRefs}>
                  {allProducts && allProducts.map((item, idx) => 
                    <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item" onClick={() => (createQuoteLine('brand', item.brand), createQuoteLine('model', item.model), createQuoteLine('category', item.category), createQuoteLine('description', item.description), setInputDropdown(''))}>
                    {item.brand} / {item.category} / {item.model}
                    </div>
                  )   
                  }
                </div>
                }
              </div>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-field">
                  <label htmlFor="product_quantity">Quantity</label>
                  <textarea id="product_quantity" rows="1" name="product_quantity" placeholder="(Quantity)" value={quoteLine.quantity} onChange={(e) => (validateIsNumber('product_quantity'), createQuoteLine('quantity', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quantity)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                </div>
              </div>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-field">
                  <label htmlFor="product_description">Description</label>
                  <textarea id="product_description" rows="4" name="product_description" placeholder="(Description)" value={quoteLine.description} onChange={(e) => (createQuoteLine('description', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Description)'} wrap="hard"></textarea>
                </div>
              </div>
              <div className="form-group-single-dropdown">
                <label htmlFor="category">Category</label>
                <div className="form-group-single-dropdown-textarea">
                  <textarea id="category" rows="2" name="category" placeholder="(Select Category)" onClick={() => setInputDropdown('category')} value={quoteLine.category} readOnly></textarea>
                  <SVGs svg={'dropdown-arrow'}></SVGs>
                </div>
                {input_dropdown == 'category' && 
                <div className="form-group-single-dropdown-list" ref={myRefs}>
                  {allProductCategories && allProductCategories.map((item, idx) => 
                    <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item" onClick={() => (createQuoteLine('category', item.name), setInputDropdown(''))}>
                    {item.name}
                    </div>
                  )   
                  }
                </div>
                }
              </div>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-field">
                  <label htmlFor="misc_price">Unit Price</label>
                  <textarea id="misc_price" rows="1" name="misc_price" placeholder="(0.00)" value={quoteLine.price} onChange={(e) => (createQuoteLine('price', validateIsPrice(e)), createQuoteLine('price_unformatted', validateIsNumberToCents(e)))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(0.00)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
                </div>
              </div>
              {/* <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-checkbox">
                  <input type="checkbox" name="taxable" id="taxable" hidden={true} checked={quoteLine.taxable ? true : false} readOnly/>
                  <label htmlFor="taxable" onClick={() => document.getElementById('taxable').checked ? createQuoteLine('taxable', false) : createQuoteLine('taxable', true)}></label>
                  <span>Taxable</span>
                </div>
                <div className="form-group-single-textarea-checkbox">
                  <input type="checkbox" name="discount" id="discount" hidden={true} checked={quoteLine.discount ? true : false} readOnly/>
                  <label htmlFor="discount" onClick={() => document.getElementById('discount').checked ? createQuoteLine('discount', false) : createQuoteLine('discount', true)}></label>
                  <span>Allow discount</span>
                </div>
              </div> */}
              {/* {update ? 
                <button onClick={(e) => (e.preventDefault(), updateQuoteLine(edit, quoteLine), setModal(''), setTypeForm(''), resetQuoteLine())} className="form-button w100">{!loading && <span>Update</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
                : 
                <button onClick={(e) => (e.preventDefault(), addQuoteLine(quoteLine), setModal(''), setTypeForm(''), resetQuoteLine())} className="form-button w100"><span>Save</span></button>
              }
              {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>} */}
              </>
            }
            {
              typeForm == 'priceList' && 
              <>
              <div className="form-group-single-dropdown">
                <label htmlFor="brand">Brand</label>
                <div className="form-group-single-dropdown-textarea">
                  <textarea id="brand" rows="2" name="brand" placeholder="(Select Brand)" onClick={() => setInputDropdown('products')} value={quoteLine.brand} readOnly></textarea>
                  <SVGs svg={'dropdown-arrow'}></SVGs>
                </div>
                {input_dropdown == 'products' && 
                <div className="form-group-single-dropdown-list" ref={myRefs}>
                  {allPriceLists && allPriceLists.map((item, idx) => 
                    <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item" onClick={() => (createQuoteLine('brand', item.brand), createQuoteLine('model', item.model), createQuoteLine('category', item.color), setInputDropdown(''))}>
                    {item.brand} / {item.color} / {item.model}
                    </div>
                  )   
                  }
                </div>
                }
              </div>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-field">
                  <label htmlFor="product_quantity">Quantity</label>
                  <textarea id="product_quantity" rows="1" name="product_quantity" placeholder="(Quantity)" value={quoteLine.quantity} onChange={(e) => (validateIsNumber('product_quantity'), createQuoteLine('quantity', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quantity)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                </div>
              </div>
              <div className="form-group-single-dropdown">
                <label htmlFor="color">Color</label>
                <div className="form-group-single-dropdown-textarea">
                  <textarea id="color" rows="2" name="color" placeholder="(Color)" onChange={(e) => createQuoteLine('category', e.target.value)} value={quoteLine.category} readOnly></textarea>
                  <SVGs svg={'dropdown-arrow'}></SVGs>
                </div>
              </div>
              <div className="form-group-single-dropdown">
                <label htmlFor="model">Model</label>
                <div className="form-group-single-dropdown-textarea">
                  <textarea id="model" rows="2" name="model" placeholder="(Model)" onChange={(e) => createQuoteLine('model', e.target.value)} value={quoteLine.model} readOnly></textarea>
                  <SVGs svg={'dropdown-arrow'}></SVGs>
                </div>
              </div>
              <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-field">
                  <label htmlFor="misc_price">Unit Price</label>
                  <textarea id="misc_price" rows="1" name="misc_price" placeholder="(0.00)" value={quoteLine.price} onChange={(e) => (createQuoteLine('price', validateIsPrice(e)), createQuoteLine('price_unformatted', validateIsNumberToCents(e)))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(0.00)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
                </div>
              </div>
              {/* <div className="form-group-single-textarea">
                <div className="form-group-single-textarea-checkbox">
                  <input type="checkbox" name="taxable" id="taxable" hidden={true} checked={quoteLine.taxable ? true : false} readOnly/>
                  <label htmlFor="taxable" onClick={() => document.getElementById('taxable').checked ? createQuoteLine('taxable', false) : createQuoteLine('taxable', true)}></label>
                  <span>Taxable</span>
                </div>
                <div className="form-group-single-textarea-checkbox">
                  <input type="checkbox" name="discount" id="discount" hidden={true} checked={quoteLine.discount ? true : false} readOnly/>
                  <label htmlFor="discount" onClick={() => document.getElementById('discount').checked ? createQuoteLine('discount', false) : createQuoteLine('discount', true)}></label>
                  <span>Allow discount</span>
                </div>
              </div> */}
              {/* {update ? 
                <button onClick={(e) => (e.preventDefault(), updateQuoteLine(edit, quoteLine), setModal(''), setTypeForm(''), resetQuoteLine())} className="form-button w100">{!loading && <span>Update</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
                : 
                <button onClick={(e) => (e.preventDefault(), addQuoteLine(quoteLine), setModal(''), setTypeForm(''), resetQuoteLine())} className="form-button w100"><span>Save</span></button>
              }
              {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>} */}
              </>
            }
          </form>
          </div>
          {typeForm !== '' ? update ? 
            <button onClick={(e) => (e.preventDefault(), updateQuoteLine(edit, quoteLine), setModal(''), setTypeForm(''), resetQuoteLine())} className="form-button w100">{!loading && <span>Update</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            : 
            <button onClick={(e) => (e.preventDefault(), addQuoteLine(quoteLine), setModal(''), setTypeForm(''), resetQuoteLine())} className="form-button w100"><span>Save</span></button>
            : 
            null
          }
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        </div>
      </div>
      }
      { modal == 'print' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Printing Options'}</span>
            {typeForm == '' && 
              <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
            }
          </div>
          <form className="addFieldItems-modal-form">
            {typeForm == '' && <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-box-container">
                <BlobProvider document={<QuotePDF date={quote.quote_date} order={quote.quote_number} contact_name={quote.contact_name} address={quote.address_one} city={quote.city} state={quote.state} zip_code={quote.zip_code} phone={quote.phone} lines={quote.quote_lines} subtotal={quote.quote_subtotal} tax={quote.quote_tax} total={quote.quote_total} POnumber={quote.po_number} salesperson={quote.salesperson}/>}>
                {({ blob, url, loading, error }) =>
                  <span className="form-group-single-textarea-box" onClick={() => renderQuote(url)}>View Quote</span>
                }
                </BlobProvider>
              </div>
              <div className="form-group-single-textarea-box-container"><BlobProvider document={<QuotePDF date={quote.quote_date} order={quote.quote_number} contact_name={quote.contact_name} address={quote.address_one} city={quote.city} state={quote.state} zip_code={quote.zip_code} phone={quote.phone} lines={quote.quote_lines} subtotal={quote.quote_subtotal} tax={quote.quote_tax} total={quote.quote_total} POnumber={quote.po_number} salesperson={quote.salesperson}/>}>
                {
                  ({ blob, url, loading, error}) =>
                  <span className="form-group-single-textarea-box" onClick={() => downloadQuote(url)}>Download Quote</span>
                }
              </BlobProvider>
              </div>
              <div className="form-group-single-textarea-box-container">
                <BlobProvider document={<Agreement date={quote.quote_date} quote_name={quote.quote_name} account_name={quote.contact_name}/>}>
                {({ blob, url, loading, error }) =>
                  <span className="form-group-single-textarea-box" onClick={() => renderAgreement(url)}>View Agreement</span>
                }
                </BlobProvider>
              </div>
              <div className="form-group-single-textarea-box-container"><BlobProvider document={<Agreement date={quote.quote_date} quote_name={quote.quote_name} account_name={quote.contact_name}/>}>
                {
                  ({ blob, url, loading, error}) =>
                  <span className="form-group-single-textarea-box" onClick={() => downloadAgreement(url)}>Download Agreement</span>
                }
              </BlobProvider>
              </div>
            </div>
            }
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          </form>
        </div>
      </div>
      }
      { modal == 'email_quote' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Send Quote to Client'}</span>
            {typeForm == '' && 
              <div onClick={() => (setModal(''), setError(''), setEdit(''), setMessage(''))}><SVGs svg={'close'}></SVGs></div>
            }
          </div>
          <form className="addFieldItems-modal-form" onSubmit={(e) => sendQuote(e)}>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="email">Email</label>
                <textarea id="email" rows="1" name="email" placeholder="(Quantity)" value={customerEmail} onChange={(e) => (setCustomerEmail(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Customer Email)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
              </div>
            </div>
            <button type="submit" className="form-button w100">{loading !== 'send_quote' && <span>Send</span>} {loading == 'send_quote' && <div className="loading"><span></span><span></span><span></span></div>}</button>
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
            {message && <span className="form-messageIcon"><SVGs svg={'error'}></SVGs>{message}</span>}
          </form>
        </div>
      </div>
      }
      { modal == 'error' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Error'}</span>
            {typeForm == '' && 
              <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
            }
          </div>
          <form className="addFieldItems-modal-form">
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          </form>
        </div>
      </div>
      }
      </div>
    </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    quote: state.quote,
    quoteLine: state.quoteLine,
    productLine: state.product
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    createQuote: (name, data) => dispatch({type: 'CREATE_QUOTE', name: name, value: data}),
    resetQuote: () => dispatch({type: 'RESET_QUOTE'}),
    createQuoteLine: (name, data) => dispatch({type: 'CREATE_QUOTE_LINE', name: name, value: data}),
    addQuoteLine: (quote_line) => dispatch({type: 'ADD_QUOTE_LINE', value: quote_line}),
    resetQuoteLine: () => dispatch({type: 'RESET_QUOTE_LINE'}),
    updateQuoteLine: (index, object) => dispatch({type: 'UPDATE_QUOTE_LINE', index: index, quoteline:  object}),
    createProduct: (name, value) => dispatch({type:'CREATE_PRODUCT', name: name,value: value}),
    removeQuoteLine: (index) => dispatch({type: 'DELETE_QUOTE_LINE', index: index})
  }
}

Quote.getInitialProps = async ({query}) => {
  // console.log(query)
  let quote
  try {
    const responseQuote = await axios.post(`${API}/transaction/get-quote`, {id: query.id})
    // console.log(responseQuote.data)
    quote = responseQuote.data
  } catch (error) {
    // console.log(error)
    if(error) console.log(error)
  }

  return {
    quoteData: quote
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Quote))
