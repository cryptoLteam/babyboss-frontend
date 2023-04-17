import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import WalletConnectButton from 'components/WalletConnectButton'
import { Link, useLocation, useNavigate, useRoutes } from 'react-router-dom'
import { VscChromeClose } from "react-icons/vsc"
import { AiFillCheckCircle } from "react-icons/ai"

const Header = () => {
  const location = useLocation()
  console.log("sniper: router: ", location)
  return (
    <div className='header-main'>
      <Link to="/">  
        <img src="/images/main-logo.png" className='' alt="" />
      </Link>
      <div className='category'>
        <Link to="/" className={`font3 m-tab ${location.pathname === "/"? "m-tab-active" : ""}`}>HOME</Link>
        <Link to="/stake" className={`font3 m-tab ${location.pathname === "/stake"? "m-tab-active" : ""}`}>STAKE</Link>		
		    <Link to="/market" className={`font3 m-tab ${location.pathname === "/market"? "m-tab-active" : ""}`}>SHOP</Link>		
		    <WalletConnectButton />
      </div>
    </div>
  )
}

export default Header