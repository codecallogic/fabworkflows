import { useState, useEffect, useRef } from 'react';
import SVG from '../../files/svgs';
import { newActivityConfirmed } from '../../helpers/messaging'

const ActivityStatusList = ({
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

  const createType = 'CREATE_ACTIVITY';
  const resetType = 'RESET_ACTIVITY';
  const updateJobArrayItem = 'UPDATE_JOB_ARRAY_ITEM'
  const myRefs = useRef(null);
  const [loadingColor, setLoadingColor] = useState('white');
  const [input_dropdown, setInputDropdown] = useState('')

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
          <div onClick={() => (
            setModal(''),
            setMessage(''),
            setLoading('')
          )}>
            <SVG svg={'close'}></SVG>
          </div>
        </div>
        <form className="addFieldItems-modal-form" style={{ height:'35rem' }}>
          <div className="form-group">
            <input
            onClick={() => setInputDropdown('activity_status')} 
            value={stateData.status.replaceAll('-', ' ')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'status', e.target.value))}/>
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
            <div 
            onClick={() => setInputDropdown('activity_status')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'activity_status' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData.activityStatus.length > 0 && allData.activityStatus.map((item, idx) => 
                  item.status !== 'auto-schedule' &&
                  <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'status', item.status), setInputDropdown(''))}>
                      {item.status.replaceAll('-', ' ')}
                  </div>
                )}
              </div>
            }
          </div>
        </form>

        <div className="addFieldItems-modal-box-footer">
          {loading == 'error_loading' && 
            <span className="form-group-message">
              <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
              {message}
              <span 
                className="form-group-message-button"
                onClick={() => (
                  setModal('activities'),
                  setMessage(''),
                  setLoading('')
                )}
              >
                <SVG svg={'arrow-left'} color={'#fd7e3c'}></SVG>
                go back
              </span>
            </span>
          }
          {
            <button 
              className="form-group-button" 
              onClick={(e) => (
                stateMethod(updateJobArrayItem, 'activities', stateData),
                newActivityConfirmed(token, stateData, setModal, setLoading, 'select_activity_status', setMessage, setDynamicSVG)
              )}
            >
              {loading == 'select_activity_status' ? (
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
          {/* {edit == dataType && (
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
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ActivityStatusList;
