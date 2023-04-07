import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'
import { FaFacebookF } from "react-icons/fa"
import { BsTwitter, BsThreeDots } from "react-icons/bs"
import { AiFillCheckCircle } from "react-icons/ai"
import MarketCard from 'components/marketplace/MarketCard'
import { NFTData } from 'state/marketplace'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { AUTHOR } from 'config/nfts'
import getDisplayStringFromNumber from 'utils/getDisplayStringFromNumber'
import { useWeb3Context } from 'hooks/useWeb3Context'

const SCROLL_COUNT = 20
const SCROLL_BOTTOM_COUNT = 130

const Market = () => {
  const web3Context = useWeb3Context()

  return (
    <div>
      <div className='px-4 lg:px-32 py-4 lg:py-20'>
        <div className="lg:flex">
          <div className='py-2 px-4 cursor-pointer rounded-t-md font3 text-4xl' >
              STORE
          </div>
          <div className='flex border-b-2 border-gray-600 w-full lg:grid lg:grid-cols-4'>
            <div className='py-2 px-1 lg:px-4 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg  ' >
              apparels
            </div>
            <div className='py-2 px-1 lg:px-4 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' >
              plushies
            </div>
            <div className='py-2 px-1 lg:px-4 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' >
              misc
            </div>
            <div className='py-1 px-1 lg:px-4 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' >
              <button className='bg-black mb-1 text-white text-sm px-1 py-1 rounded-md float-right'>
                CHECKOUT
              </button>
            </div>            
          </div>
      </div>
    </div>
    <div className='px-4 lg:px-32 py-4 lg:py-4 ' id="nft-lists">
      <div className="flex lg:grid lg:grid-cols-3 grid-cols-1">
      <div className=' mx-5 my-5'>
          <div className='bg-red-500 rounded-3xl'>
            <img src='images/image-layer2.png' />
          </div>
          <div className=' text-center pt-5 lg:text-3xl'>
            baby boss 2023 hoodi
          </div>
          <div className=' text-center pt-5 lg:text-3xl text-sm' style={{ color: '#ff06f5' }}>
            $80
          </div>
        </div>
        <div className=' mx-5 my-5' >
          <div className='bg-red-500 rounded-3xl'>
            <img src='images/image-layer2.png' />
          </div>
          <div className=' text-center pt-5 lg:text-3xl'>
            baby boss 2023 hoodi
          </div>
          <div className=' text-center pt-5 lg:text-3xl text-sm' style={{ color: '#ff06f5' }}>
            $80
          </div>
        </div>
        <div className=' mx-5 my-5'>
          <div className='bg-red-500 rounded-3xl'>
            <img src='images/image-layer2.png' />
          </div>
          <div className=' text-center pt-5 lg:text-3xl'>
            baby boss 2023 hoodi
          </div>
          <div className=' text-center pt-5 lg:text-3xl text-sm' style={{ color: '#ff06f5' }}>
            $80
          </div>
        </div>

      </div>
    </div>      
  </div>
  )
}

export default Market;