import { ethers } from 'ethers'
import Web3 from 'web3'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
  getNFTAddress,
  getStakingAddress,
  getRewardAddress,
  getMulticallAddress1,
  getMulticallAddress2,
  getMulticallAddress3,
  getRegisterAddress,
  getRouterAddress,
  getMechaAddress,
} from 'utils/addressHelpers'

// ABI
import nft from 'config/abis/nft.json'
import reward from 'config/abis/reward.json'
import NFTStaking from 'config/abis/nftStaking.json'
import MultiCallAbi from 'config/abis/multicall.json'
import RegisterAbi from 'config/abis/register.json'
import RouterABI from 'config/abis/router.json'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

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

export const getMulticallContract1 = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress1(id), signer) as any
}

export const getMulticallContract2 = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress2(id), signer) as any
}

export const getMulticallContract3 = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress3(id), signer) as any
}

export const getRegisterContract = (id: number, provider: any) => {
  return getContractWithWeb3(RegisterAbi, getRegisterAddress(id), provider)
}

export const getRouterContract = (id: number, provider: any) => {
  return getContractWithWeb3(RouterABI, getRouterAddress(id), provider)
}