import { ethers } from 'ethers'
import Web3 from 'web3'

// Addresses
import {
  getNFTAddress,
  getStakingAddress,
  getRewardAddress,
  getRegisterAddress,
  getRouterAddress,
  getMechaAddress,
  getMarketplaceAddress,
} from 'utils/addressHelpers'

// ABI
import nft from 'config/abis/nft.json'
import reward from 'config/abis/reward.json'
import NFTStaking from 'config/abis/nftStaking.json'
import MultiCallAbi from 'config/abis/multicall.json'
import RegisterAbi from 'config/abis/register.json'
import RouterABI from 'config/abis/router.json'
import MarktplaceABI from 'config/abis/marketplace.json'

export function getContractWithWeb3(abi: any, address: string, provider: any) {
  const web3 = new Web3(provider)

  return new web3.eth.Contract(abi, address)
}

export const getNFTContract = (id: number, provider: any) => {
  return getContractWithWeb3(nft, getNFTAddress(id), provider)
}

export const getMechaContract = (id: number, provider: any) => {
  return getContractWithWeb3(nft, getMechaAddress(id), provider)
}

export const getRewardContract = (id: number, provider: any) => {
  return getContractWithWeb3(reward, getRewardAddress(id), provider)
}

export const getStakingContract = (id: number, provider: any) => {
  return getContractWithWeb3(NFTStaking, getStakingAddress(id), provider)
}

export const getRegisterContract = (id: number, provider: any) => {
  return getContractWithWeb3(RegisterAbi, getRegisterAddress(id), provider)
}

export const getRouterContract = (id: number, provider: any) => {
  return getContractWithWeb3(RouterABI, getRouterAddress(id), provider)
}

export const getMarketplaceContract = (id: number, provider: any) => {
  return getContractWithWeb3(MarktplaceABI, getMarketplaceAddress(id), provider);
}