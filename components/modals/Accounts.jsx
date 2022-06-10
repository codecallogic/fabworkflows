import { useState, useEffect, useRef } from 'react';
import SVG from '../../files/svgs';
import { manageFormFields } from '../../helpers/forms';
import { selectCreateType, selectResetType } from '../../helpers/dispatchTypes';
import { filterAccountSearch } from '../../helpers/validations';

const Accounts = ({
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

  //// CRUD
  submitCreate,
  submitUpdate,
}) => {
  const createType = selectCreateType(typeOfData);
  const resetType = selectResetType(typeOfData);
  const myRefs = useRef(null);
  const [loadingColor, setLoadingColor] = useState('white');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

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
            {edit == dataType ? 'Edit' : 'Select'}
          </span>
          <div onClick={() => (setModal(''), setMessage(''))}>
            <SVG svg={'close'}></SVG>
          </div>
        </div>
        <form className="addFieldItems-modal-form">
          <div className="form-group">
            <input
              value={manageFormFields(autoFill[autoFillType], 'name')}
              onChange={(e) => (
                stateMethod(createType, autoFillType, e.target.value),
                setSearch(e.target.value)
              )}
            />
            <label
              className={
                `input-label ` +
                (autoFill[autoFillType].length > 0 ||
                typeof autoFill[autoFillType] == 'object'
                  ? ' labelHover'
                  : '')
              }
              htmlFor={`${autoFillType}`}
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
              {allData &&
                allData[dataType]
                  .sort((a, b) => sort === 'down' ? a.name > b.name ? -1 : 1 : a.name > b.name ? 1 : -1)
                  .map((item, idx) =>
                    search.length > 0 ? (
                      filterAccountSearch(item, search) ? (
                        <div
                          key={idx}
                          className="addFieldItems-modal-form-container-searchList-list-item"
                          onClick={() =>
                            stateMethod(createType, autoFillType, item)
                          }
                        >
                          {item.name}
                        </div>
                      ) : null
                    ) : (
                      <div
                        key={idx}
                        className="addFieldItems-modal-form-container-searchList-list-item"
                        onClick={() => stateMethod(createType, autoFillType, item)}
                      >
                        {item.name}
                      </div>
                    )
                  )}
            </div>
          </div>
        </form>

        <div className="addFieldItems-modal-box-footer">
          {message && (
            <span className="form-group-message">
              <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
              {message}
            </span>
          )}
          {
            <button className="form-group-button" onClick={(e) => setModal('')}>
              {loading == 'select_account' ? (
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

export default Accounts;
