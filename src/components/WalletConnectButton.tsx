import React from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'hooks/useWeb3Context'

const StyledConnectButton = styled.button`
  background-color: #ff06f5;
  color: #FFFFFF;
  padding: 0px 10px 0px 10px;
  border-radius: 15px;
  min-height: 30px;  
`

const WalletConnectButton = () => {
  const web3Context = useWeb3Context()
  const displayAddress =  `${web3Context?.account.substring(0, 5)}...${web3Context?.account.substring(web3Context?.account.length - 3)}`
  
  return (
    <div className=''>
      { web3Context?.account ?
        <StyledConnectButton  className=' '  onClick={web3Context?.disconnect}>
          Disconnect
          <br/>
          {displayAddress}
        </StyledConnectButton>
        :
        <StyledConnectButton className='mt-1 lg:mt-2' onClick={web3Context?.connectWallet}>Connect</StyledConnectButton>
      }
    </div>
  )
}

export default WalletConnectButton