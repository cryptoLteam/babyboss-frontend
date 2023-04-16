import React, { useEffect, useState } from 'react'
import { useWeb3Context } from 'hooks/useWeb3Context'
import TabWidget from 'components/tabWidget';
import backgroundStake1 from '../../assets/img/stake/layer.png';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GRAPH_API_URL } from 'config/nfts';
import { GET_NFTS, GetNftsData, Nft } from 'queries/querys';
import { getStakingContract } from 'utils/contractHelpers';
import { ethers } from 'ethers';
import { getNFTAddress } from 'utils/addressHelpers';
import { toast } from 'react-toastify';
import { CHAIN } from 'config';


const Stake = () => {
	const web3Context = useWeb3Context()
	const [nfts, setNfts] = useState<Nft[]>([])

	useEffect(() => {
		const fetchMyNFTs =async (account:string) => {
			const client = new ApolloClient({
				uri: GRAPH_API_URL,
				cache: new InMemoryCache(),
			  });
			
			  const nfts = await client.query<GetNftsData>({query: GET_NFTS, variables: {owner: account}});
			
			  if(nfts && nfts.data.nfts.length > 0) {
				setNfts(nfts.data.nfts)
			  } else {
				setNfts([])
			  } 
		}
		if(web3Context?.account) {
			fetchMyNFTs(web3Context.account)
		}
	})

	const [pendingReward, setPendingReward] = useState(0)
	const [reload, setReload] = useState(false)
	useEffect(() => {
		const fetchPendingReward =async (account:string) => {
			const nftAddress = getNFTAddress(0)
			const contract = getStakingContract(0, web3Context?.provider)
			const _pending = await contract.methods.pendingReward(nftAddress, account).call()
			setPendingReward(Number(ethers.utils.formatEther(_pending)))
			console.log()
		}
		if(web3Context?.account) {
			fetchPendingReward(web3Context.account)
		}
	}, [web3Context?.account, web3Context?.provider, reload])

	const handleClaim = async () => {
		if(!web3Context?.account) {
			toast.error("Confirm your wallet connection!")
			return
		}
		if(web3Context?.chainId !== CHAIN[0]) {
		  toast.error("Confirm you are on Ethereum Network!")
		  return 
		}
		const contract = getStakingContract(0, web3Context.provider) 
		await contract.methods.claimRewards(getNFTAddress(0)).send({from: web3Context.account})
		toast.success("Claimed Successfully. Confirm on Polygon")
		setReload(!reload)
	}

	return (
		<div>
			<div className='w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-5' style={{ backgroundImage: `url(${backgroundStake1})`, backgroundSize: 'cover'}}>
				<div className='lg:flex'>
					<img className='hidden lg:block w-3/6 object-cover mb-0 lg:pl-32 sm:pl-5 mt-16' src="/images/imgs/stake/shop.png" alt=""  />			
					<p className='text-white pl-4 mt-40 text-3xl '>
						STAKE YOUR
						<br/>
						BABY BOSS
					</p>
				</div>
				<div className=''>
					<div className="lg:float-right lg:mr-32 p-8 lg:rounded-xl mt-5" style={{ backgroundColor: '#8c55bc' }}>
						<div className=' text-3xl text-white pb-5 '>Current Earning:</div>
						<div className=' text-4xl text-green-500 pb-5 '>{pendingReward}$ BBOSS</div>
						<div className=' text-white text-center text-2xl p-3 rounded-xl cursor-pointer' style={{ backgroundColor: "#ff06f5" }} onClick={handleClaim}>CLAIM ALL</div>
					</div>
				</div>
			</div>
			<div className='px-4 lg:px-32 py-4 lg:py-20'>
				{
					nfts && nfts?.length > 0 && 
					<TabWidget nftlists = { nfts } /> 
				}
			</div>
		</div>
	)
}

export default Stake