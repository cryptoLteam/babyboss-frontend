import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import WalletConnectButton from 'components/WalletConnectButton'
import { Link, useNavigate } from 'react-router-dom'
import { VscChromeClose } from "react-icons/vsc"
import { AiFillCheckCircle } from "react-icons/ai"

const Header = () => {
  return (
    <div className='header-main'>
      <Link to="/">  
        <img src="/images/main-logo.png" className='' alt="" />
      </Link>
      <div className='category'>
        <Link to="/" className='font3'>HOME</Link>
        <Link to="/stake" className='font3'>STAKE</Link>		
		<Link to="/market" className='font3'>SHOP</Link>		
		<WalletConnectButton />
      </div>
    </div>
  )
}

export default Header