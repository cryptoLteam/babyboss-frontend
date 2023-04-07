import { useEffect, useState } from 'react';
import NftItem from './nftItem';
import { Nft } from 'queries/querys';
import { getMechaContract, getNFTContract, getStakingContract } from 'utils/contractHelpers';
import { Web3Context } from 'contexts/Web3Context';
import { useWeb3Context } from 'hooks/useWeb3Context';
import { toast } from 'react-toastify';
import { getNFTAddress, getStakingAddress } from 'utils/addressHelpers';

type Props = {
  nftlists: any
};

function TabWidget({ nftlists }: Props) {
  const web3Context = useWeb3Context()
  const [selectedTab, setSelectedTab] = useState(0);
	const [nftItems, setNftItems] = useState<Nft[]>([]);
  
  const [selectedNFTsonWallet, setSelectedNFTsonWallet] = useState<number[]>([])
  const [selectedNFTsonStaking, setSelectedNFTsonStaking] = useState<number[]>([])

  let tabs = [
    { label: 'STAKING' },
    { label: 'COLLECTION' },
  ];

  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false)
  const [isApprovedForAllMecha, setIsApprovedForAllMecha] = useState<boolean>(false)
  useEffect(() => {
    const fetchIsApprovedForAll = async (account: string) => {
      const contract = getNFTContract(0, web3Context?.provider)
      const result = await contract.methods.isApprovedForAll(account, getStakingAddress(0)).call()
      setIsApprovedForAll(result)
    }
    const fetchIsApprovedForAllMecha = async (account: string) => {
      const contract = getMechaContract(0, web3Context?.provider)
      const result = await contract.methods.isApprovedForAll(account, getStakingAddress(0)).call()
      setIsApprovedForAllMecha(result)
    }
    if(web3Context?.account) {
      fetchIsApprovedForAll(web3Context.account)
      fetchIsApprovedForAllMecha(web3Context.account)
    }    
  }, [web3Context?.account, web3Context?.provider])

  useEffect(() => {
    setNftItems(nftlists);
  }, [nftlists]);

  const handleItemClick = (id: any, nft_state: any) => {
    if (selectedTab === 0 ) { // staking
      let _selectedNftsonStaking = selectedNFTsonStaking.slice()
      if(nft_state === true) {
        _selectedNftsonStaking.push(Number(id))
      } else {
        let index = _selectedNftsonStaking.indexOf(Number(id)); // find the index of the item you want to remove
        if (index !== -1) { // check if the item exists in the array
          _selectedNftsonStaking.splice(index, 1); // remove the item using splice()
        }
      }
      setSelectedNFTsonStaking(_selectedNftsonStaking)
      console.log(_selectedNftsonStaking);
    }
    else if (selectedTab === 1 ) { // wallet
      let _selectedNftsonWallet = selectedNFTsonWallet.slice()
      if(nft_state === true) {
        _selectedNftsonWallet.push(Number(id))
      } else {
        let index = _selectedNftsonWallet.indexOf(Number(id)); // find the index of the item you want to remove
        if (index !== -1) { // check if the item exists in the array
          _selectedNftsonWallet.splice(index, 1); // remove the item using splice()
        }
      }
      setSelectedNFTsonWallet(_selectedNftsonWallet)
      console.log(_selectedNftsonWallet);
    }
  }

  const handleItem = (id: any) => {
    const item = nftItems.filter((item: any) => Number(item.id) === id)
    if(item && item.length > 0) {
      if(item[0].stake === true) {
        handleUnStakeItems([Number(id)])
      } else {
        handleStakeItems([Number(id)])
      }
    }
  }

  const handleStakeItems = async (ids: any) => {
    if(!web3Context?.provider) {
      toast.error("Confirm your wallet connection.")
      return
    }
    const nftAddress = getNFTAddress(0)
    const stakingAddress = getStakingAddress(0)
    if(isApprovedForAll === false) {
      const nftContract = getNFTContract(0, web3Context.provider)
      await nftContract.methods.setApprovalForAll(stakingAddress, true).send({from: web3Context.account})
    }
    const contract = getStakingContract(0, web3Context?.provider)
    await contract.methods.stake(nftAddress, ids).send({from: web3Context?.account})
    toast.error("Staked Successfully!")

    setSelectedNFTsonWallet([])
    setSelectedNFTsonStaking([])
  }

  const handleUnStakeItems = async (ids: any) => {
    if(!web3Context?.provider) {
      toast.error("Confirm your wallet connection.")
      return
    }
    const nftAddress = getNFTAddress(0)
    const stakingAddress = getStakingAddress(0)
    if(isApprovedForAllMecha === false) {
      const mechaContract = getMechaContract(0, web3Context.provider)
      await mechaContract.methods.setApprovalForAll(stakingAddress, true).send({from: web3Context.account})
    }
    const contract = getStakingContract(0, web3Context?.provider)
    await contract.methods.unStake(nftAddress, ids).send({from: web3Context?.account})
    toast.error("Staked Successfully!")

    setSelectedNFTsonWallet([])
    setSelectedNFTsonStaking([])
  }

  return (
    <div>
      {(() => {
        if (selectedTab === 0 && selectedNFTsonStaking.length > 0)
          return (
            <div className='float-right cursor-pointer hover:text-red-400' onClick={ () => handleUnStakeItems(selectedNFTsonStaking) }>
              UNSTAKE
            </div>
          )
        else if (selectedTab === 1 && selectedNFTsonWallet.length > 0)
          return (
            <div className='float-right cursor-pointer hover:text-red-400' onClick={ () => handleStakeItems(selectedNFTsonWallet) }>
              STAKE
            </div>
          ) 
      })()}
      {/* Tab headers */}
      <div className="flex">
        <div className='flex'>
        {tabs.map((tab, index) => (
          <div 
          key={index} 
          className={`py-2 px-4 cursor-pointer rounded-t-md ${selectedTab === index ? 'text-white' : 'text-black'}`} 
          style={{ backgroundColor: `${selectedTab === index ? '#ff06f5' : '#e6e6e6'}` }}
          onClick={() => {setSelectedTab(index)}}
          >
            {tab.label}
          </div>
        ))}
        </div>       
      </div>     
      {/* Tab content */}
      <div className='py-6'>
        <div id="nft-lists" className='grid lg:grid-cols-4 grid-cols-2 cursor-pointer relative ' style={{ height: "800px", overflowY: "auto" }}>
				{selectedTab === 0 &&
          nftItems?.map((item, index) => (
            (item['stake'] === true) ? (
              <NftItem 
                key={index} 
                id={ item['tokenId'] } 
                imgSrc="/images/imgs/stake/nfts/nft1.png" 
                amount="200" owner={ '' } staked={ item['stake'] } 
                handleItemClick={ handleItemClick }
                handleItem={handleItem}
              /> ) : ''
          ))
        }

        {selectedTab === 1 &&
          nftItems?.map((item, index) => (
            (item['stake'] === false) ? (
              <NftItem 
                key={index} 
                id={ item['tokenId'] } 
                imgSrc="/images/imgs/stake/nfts/nft1.png" 
                amount="200" owner={ '' } 
                staked={ item['stake'] }
                handleItemClick={ handleItemClick }
                handleItem={handleItem}
              /> ) : ''
          ))
        }

				</div>
      </div>
    </div>
  )
}


export default TabWidget;
