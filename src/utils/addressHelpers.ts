import { CHAIN } from 'config'
import addresses from 'config/contracts'
import { Address } from 'config/types'

export const getAddress = (id: number, address: any): string => {
  const chainId = CHAIN[id]
  return address[chainId]
}

export const getNFTAddress = (id: number) => {
  return getAddress(id, addresses.nft)
}
export const getMechaAddress = (id: number) => {
  return getAddress(id, addresses.mecha)
}
export const getStakingAddress = (id: number) => {
  return getAddress(id, addresses.staking)
}
export const getRewardAddress = (id: number) => {
  return getAddress(id, addresses.reward)
}
export const getMulticallAddress1 = (id: number) => {
  return getAddress(id, addresses.multicall1)
}
export const getMulticallAddress2 = (id: number) => {
  return getAddress(id, addresses.multicall2)
}
export const getMulticallAddress3 = (id: number) => {
  return getAddress(id, addresses.multicall3)
}
export const getRegisterAddress = (id: number) => {
  return getAddress(id, addresses.register)
}
export const getRouterAddress = (id: number) => {
  return getAddress(id, addresses.pancakeRouter)
}
export const getWBNBAddress = (id: number) => {
  return getAddress(id, addresses.WBMB)
}