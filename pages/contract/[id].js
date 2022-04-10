import { useEffect, useState } from 'react'
import { API } from '../../config'
import axios from 'axios'
import ContractModal from '../../components/modals/Contract'

const Contract = ({
  contract
}) => {
  
  const [modal, setModal] = useState('')
  
  return (
    <div className="contract">
      <div className="contract-container">
        <div 
          className="form-group-button"
          onClick={() => setModal('sign')}
        >
          Review and sign
        </div>
        <div className="pdf">
          <div className="pdf-container">
            <div id="pdf" dangerouslySetInnerHTML={{ __html: contract.contract ? contract.contract : ''}}>
            </div>
          </div>
        </div>
      </div>

      { modal == 'sign' &&
        <ContractModal
          setModal={setModal}
        >
        </ContractModal>
      }

    </div>
  )
}

Contract.getInitialProps = async ({query}) => {

  let token
  let contract

  if(query.token){
    try {
      const response = await axios.post(`${API}/contracts/get-contract`, {token: query.token})
      contract = response.data

    } catch (error) {
      console.log(error)
    }
  }
  
  return {
    contract: contract ? contract : null
  }
  
}

export default Contract
