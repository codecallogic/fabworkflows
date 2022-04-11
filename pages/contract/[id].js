import { useEffect, useState } from 'react'
import { API } from '../../config'
import axios from 'axios'
import ContractModal from '../../components/modals/Contract'
import SVG from '../../files/svgs'
import dynamic from 'next/dynamic'
const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false })

const Contract = ({
  token,
  data,
  error
}) => {

  const [contract, setContract] = useState('')
  const [modal, setModal] = useState('')
  const [message, setMessage] = useState( error ? error : '')

  useEffect(() => {
    setContract(data)
  }, [])

  const convertToPDF = async () => {
    const html = await import('html2pdf.js')
   
    let element = document.getElementById('pdf')
    let opt = {
      margin: 1,
      filename: `${contract.subject}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    }
    html.default().set(opt).from(element).save()
  }
  
  return (
    <div className="contract">
      { contract && contract.signed == false &&
      <div className="contract-container">
        <div className="contract-title">Fabworkflow has requested that you sign the following document.</div>
        <div 
          className="form-group-button"
          onClick={() => setModal('sign')}
        >
          Review and sign
        </div>
        <div id="pdf" className="pdf">
          <div className="pdf-container">
            <div dangerouslySetInnerHTML={{ __html: contract.contract ? contract.contract : ''}}>
            </div>
          </div>
        </div>
      </div>
      }

      {contract && contract.signed && 
      
        <div className="overlay-message">
          <div className="overlay-message-svg">
            <SVG svg={'checkmark'}></SVG>
          </div>
          <span className="overlay-message-text">Thank you! The document has been signed!</span>
          <button 
            className="overlay-message-button"
            onClick={(e) => (e.preventDefault(),  convertToPDF())}
          >
            view document
          </button>
        </div>
      
      }

      {!contract &&
      
        <div className="overlay-message">
          <div className="overlay-message-svg">
            <SVG svg={'error'}></SVG>
          </div>
          {message ? <span className="overlay-message-text">{message.substring(0, 500)}</span> : ''}
        </div>
        
      }

      {contract && 
      <div id="element">
        <div id="pdf" className="pdf">
          <div className="pdf-container">
            <div dangerouslySetInnerHTML={{ __html: contract.contract ? contract.contract : ''}}>
            </div>
          </div>
          <img src={contract.image} alt={contract.signatureFullName} />
          {contract.dateSigned ? <h3>Date signed: {contract.dateSigned}</h3> : null}
          {contract.signatureFullName ? <h3>Signed By: {contract.signatureFullName}</h3> : null}
        </div> 
      </div>
      }


      { modal == 'sign' &&
        <ContractModal
          token={token}
          setModal={setModal}
          message={message}
          setMessage={setMessage}
          data={contract}
          setContract={setContract}
        >
        </ContractModal>
      }

    </div>
  )
}

Contract.getInitialProps = async ({query}) => {

  let token
  let contract
  let error

  if(query.token){
    try {
      const response = await axios.post(`${API}/contracts/get-contract`, {token: query.token}, {
        headers: {
          Authorization: `Bearer ${query.token}`,
          contentType: 'multipart/form-data'
        }
      })
      contract = response.data

    } catch (err) {
      console.log(err.response)
      error = 'Error occurred, link has expired please contact support'
    }
  }
  
  return {
    token: query.token ? query.token : null,
    data: contract ? contract : null,
    error: error ? error : null
  }
  
}

export default Contract
