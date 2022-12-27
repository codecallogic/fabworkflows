//// HELPERS
import { messageType, appointmentKeys } from "../../helpers/lists"

//// LIBRARIES
import { useState, useRef, useEffect } from 'react'
import SVG from '../../files/svgs'
import { insertAppointmentKey, onInputContent, showPreview, stringCount } from "../../helpers/messaging";

const MessageForm = ({
  setModal,
  setEdit,
  setAltEdit,
  loading,
  setLoading,
  token,
  setMessage,
  changeView,
  dynamicSVG,
  setDynamicSVG,
  message,
  modal,
  altEdit,
  events,

  // REDUX
  editData,
  stateMethod,
  stateData,
  resetState,

  // DATA
  allData,
  setAllData,

  // CRUD
  submitUpdate
}) => {

  const loadingColor = 'white';
  const createType = 'CREATE_MESSAGE';
  const resetType = 'RESET_MESSAGE';
  const myRefs = useRef(null);
  console.log(events)
  const [active, setActive] = useState('0')
  const [type, setType] = useState(0)
  const [inputDropdown, setInputDropdown] = useState('')
  const [preview, setPreview] = useState('Select Preview Item')
  const [messageTemplate, setMessageTemplate] = useState(allData.messageTemplates ? allData.messageTemplates[0] : '')
  const [subject, setSubject] = useState('')

  useEffect(() => {
    
    setActive('0')
    if(type == 0) document.getElementById('messageContent').textContent = allData.messageTemplates[0].template
    if(type == 1) document.getElementById('emailContent').textContent = allData.messageTemplates[0].emailTemplate
   
  }, [])

  useEffect(() => {
    if(type == 0) document.getElementById('messageContent').textContent = allData.messageTemplates[active].template
    if(type == 1) document.getElementById('emailContent').textContent = allData.messageTemplates[active].emailTemplate
    setSubject(allData.messageTemplates[active].emailSubject)
    
  }, [active])

  useEffect(() => {
    if(type == 0) document.getElementById('messageContent').textContent = allData.messageTemplates[active].template
    if(type == 1) document.getElementById('emailContent').textContent = allData.messageTemplates[active].emailTemplate
  }, [type])
  
  return (
    <div className="message">
      <div className="message-title">Default System - Edit Message</div>
      <div className="message-container">
        <div className="message-sideNav">
          <div className="message-sideNav-title">
            Scheduled Messages
          </div>
          { allData.messageTemplates && allData.messageTemplates.map((item, idx) => 
            <div 
              key={idx} 
              className={`message-sideNav-item ` + (active == idx ? 'message-sideNav-item-selected' : '')}
              onClick={() => (
                setActive(idx),
                setMessageTemplate(item),
                setType(0),
                setPreview('Select Preview Item')
              )}
            >
              {item.title}
            </div>
          )}
        </div>
        <div className="message-form-container">
          <div className="message-form">
            <div className="message-form-header">
              { messageType && messageType.map((item, idx) => 
                <div 
                  key={idx}
                  className={`message-form-header-item` + ( type == idx ? ' message-form-header-item-selected' : '')}
                  onClick={() => (
                    setType(idx),
                    setPreview('Select Preview Item')
                  )}
                >
                  {item}
                </div>
              )}
            </div>
            { type == 0 &&
              <>
              <div className="message-form-subtitle">Message Content</div>
              <div className="form-group-contentEditable">
                <span 
                  id="messageContent"
                  role="textbox" 
                  contentEditable
                  onInput={() => onInputContent(messageTemplate, document.getElementById('messageContent', 'message').textContent)} 
                >
                </span>
              </div>
              </>
            }
            { type == 1 &&
              <>
              <div className="form-group">
                <input
                  style={{ fontWeight: 500 }}
                  value={subject}
                  onChange={(e) => (
                   setSubject(e.target.value),
                   messageTemplate.emailSubject = e.target.value
                  )}
                />
                <label
                  style={{ fontWeight: 500 }}
                  className={
                    `input-label ` +
                    (messageTemplate.emailSubject && messageTemplate.emailSubject.length > 0
                      ? ' labelHover'
                      : '')
                  }
                  htmlFor="subject"
                >
                  Email Subject
                </label>
              </div>
              <div className="message-form-subtitle">Email Message Content</div>
              <div className="form-group-contentEditable">
                <span 
                  id="emailContent"
                  role="textbox" 
                  contentEditable
                  onInput={() => onInputContent(messageTemplate, document.getElementById('emailContent').textContent, 'email')} 
                >
                </span>
              </div>
              </>
            }
            <div className="form-group">
              <input
                onClick={() => inputDropdown == 'appointment' ? setInputDropdown('') : setInputDropdown('appointment')}
                readOnly 
              />
              <label 
                style={{ fontWeight: 500, fontSize: 14 }}
                className={`input-label `}
                htmlFor="data"
              >
                Appointment Data
              </label>
              <div 
                onClick={() => inputDropdown == 'appointment' ? setInputDropdown('') : setInputDropdown('appointment')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { inputDropdown == 'appointment' &&
                <div 
                  className="form-group-list" 
                  ref={myRefs}>
                  {appointmentKeys.map((item, idx) => 
                    <div 
                      key={idx} 
                      className="form-group-list-item" 
                      onClick={(e) => (
                        insertAppointmentKey(item.key, messageTemplate, type),
                        setInputDropdown('')
                      )}>
                        {item.title}
                    </div>
                  )}
                </div>
              }
            </div>
            <div className="message-form-footer">
              {/* <div className="form-group-button button-clear">Delete</div> */}
              <div 
                className="form-group-button w50"
                onClick={(e) => submitUpdate(e, messageTemplate, 'messageTemplates', null, setMessage, 'update_template', setLoading, token, 'message-templates/update-message-template', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'messaging', null)}
              >
                {loading == 'update_template' ? (
                  <div className="loading">
                    <span style={{ backgroundColor: loadingColor }}></span>
                    <span style={{ backgroundColor: loadingColor }}></span>
                    <span style={{ backgroundColor: loadingColor }}></span>
                  </div>
                ) : (
                  'Update Template'
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="message-preview">
          <div className="message-preview-title">Preview with appointment</div>
          <div className="form-group">
            <input
              value={typeof preview == 'object' ? preview.name : preview}
              onClick={() => inputDropdown == 'preview' ? setInputDropdown('') : setInputDropdown('preview')}
              readOnly 
            />
            <label 
              style={{ fontWeight: 500, fontSize: 14 }}
              className={`input-label `}
              htmlFor="data"
            >
            </label>
            <div 
              onClick={() => inputDropdown == 'preview' ? setInputDropdown('') : setInputDropdown('preview')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { inputDropdown == 'preview' &&
              <div 
                className="form-group-list" 
                ref={myRefs}>
                { allData.accounts.map((item, idx) => 
                  events.some( e => e.accountID == item._id)
                  ?
                  <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (
                      setPreview(item),
                      setInputDropdown('')
                    )}>
                      {item.name}
                  </div>
                  :
                  null
                )}
              </div>
            }
          </div>
          { type == 0 &&typeof preview == 'object' && document.getElementById('messageContent') && 
          <div className="message-preview-text">
            { events.filter( (e, id) => e.accountID == preview._id).map((item, idx) => 
              idx == 0
              ?
              <div
                key={idx}
              >
               <span>{showPreview(item, document.getElementById('messageContent').textContent)}</span>
               <div className="message-preview-characters">
                { stringCount(item, document.getElementById('messageContent').textContent) 
                  ?
                  `(${stringCount(item, document.getElementById('messageContent').textContent)} characters)`
                  :
                  ''
                }
               </div>
              </div>
              :
              null
            )}
          </div>
          }
          { type == 1 && typeof preview == 'object' && document.getElementById('emailContent') && 
            <div className="message-preview-text">
              { events.filter( (e, id) => e.accountID == preview._id).map((item, idx) => 
                idx == 0
                ?
                <div
                  key={idx}
                >
                <span>{showPreview(item, document.getElementById('emailContent').textContent)}</span>
                <div className="message-preview-characters">
                  { stringCount(item, document.getElementById('emailContent').textContent) 
                    ?
                    `(${stringCount(item, document.getElementById('emailContent').textContent)} characters)`
                    :
                    ''
                  }
                </div>
                </div>
                :
                null
              )}
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default MessageForm
