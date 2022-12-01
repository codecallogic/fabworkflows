import {useState, useEffect} from 'react'
import SVG from '../../files/svgs'
import { manageFormFields } from '../../helpers/forms';
import { selectCreateType, selectResetType } from '../../helpers/dispatchTypes';
import { filterAccountSearch } from '../../helpers/validations';


const MaterialModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  dynamicSVG,
  dynamicType,
  dynamicKey,
  setDynamicSVG,
  extractingStateData,
  setDynamicKey,
  setDynamicType,
  dataType,

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
  
  const createType = dynamicType
  const resetType = ''
  const [loadingColor, setLoadingColor] = useState('white')
  const [name, setName] = useState('')
  const [newAccount, setNewAccount] = useState(true)
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

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

  useEffect(() => {
    if(name.length > 0) setMessage('')
  }, [name])
  
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
            {edit == 'account' ? 
            'Edit Account' 
            : 
            'New Account'
            }
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
        </div>
      <form 
      className="addFieldItems-modal-form" 
      >
        <div className="horizontal">
          <div className="form-group-checkbox">
            <input 
              type="checkbox" 
              name="account" 
              id="account" 
              hidden={true} 
              checked={newAccount ? true : false} 
              readOnly
            />
            <label 
              htmlFor="taxable" 
              onClick={() => (
                newAccount
                ? 
                (
                  setNewAccount(false),
                  setName('')
                )
                : 
                (
                  setNewAccount(true),
                  setName('')
                )
              )}
            >
            </label>
            <span>New Account</span>
          </div>
          <div className="form-group-checkbox">
            <input 
              type="checkbox" 
              name="accountList" 
              id="accountList" 
              hidden={true} 
              checked={newAccount ? false : true} 
              readOnly
            />
            <label 
              htmlFor="discount" 
              onClick={() => (
                newAccount
                ? 
                (
                  setNewAccount(false),
                  setName('')
                )
                : 
                (
                  setNewAccount(true),
                  setName('')
                )
              )}
            >
            </label>
            <span>Find Account</span>
          </div>
        </div>
        {newAccount && 
        <div className="form-group">
          <input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}/>
          <label 
          className={`input-label ` + (
            name.length > 0 || 
            typeof name == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="name">
            Name
          </label>
        </div>
        }
        {!newAccount && 
        <>
          <div className="form-group">
            <input
              value={manageFormFields(name, 'name')}
              onChange={(e) => (
                setName(e.target.value),
                setSearch(e.target.value)
              )}
            />
            <label
              className={
                `input-label ` + 
                (
                name.length > 0 ||
                typeof name == 'object' 
                ? ' labelHover'
                : ''
                )
              }
              htmlFor={`name`}
            >
              Account (search by account name)
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
                <span>Account</span>
                <SVG svg={'dropdown-arrow'}></SVG>
              </div>
            </div>
            <div className="addFieldItems-modal-form-container-searchList-list">
              {allData && allData[dataType]
              .sort((a, b) => sort === 'down' ? a.name > b.name ? -1 : 1 : a.name > b.name ? 1 : -1)
              .map((item, idx) =>
                search.length > 0 ? (
                  filterAccountSearch(item, search) ? (
                    <div
                      key={idx}
                      className="addFieldItems-modal-form-container-searchList-list-item"
                      onClick={() =>
                        setName(item)
                      }
                    >
                      {item.name}
                    </div>
                  ) : null
                ) : 
                (
                  <div
                    key={idx}
                    className="addFieldItems-modal-form-container-searchList-list-item"
                    onClick={() => setName(item)}
                  >
                    {item.name}
                  </div>
                )
              )}
            </div>
          </div>
        </>          
        }
        {message && 
        <span className="form-group-message">
          <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
          {message}
        </span>
        }
        <button 
        className="form-group-button" 
        onClick={(e) => (
          e.preventDefault(),
          extractingStateData(name),
          setModal(''),
          setDynamicKey(''),
          setDynamicType(''),
          setMessage('')
        )}
        >
           {loading == 'create_quote_account_field' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Save'
            }
        </button>
        {edit == 'account' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), null)}
        >
           {loading == 'update_material' ? 
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
      </form>
    </div>
    </div>
  )
}

export default MaterialModal
