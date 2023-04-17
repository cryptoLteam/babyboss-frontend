import { gql } from '@apollo/client';

export interface Nft {
	id: string;
	tokenId: string;
	owner: string;
	approved: string;
	stake: boolean;
}

export interface GetNftsData {
  nfts: Nft[];
}  
 
export const GET_NFTS = gql`
	query GetNfts($owner: Bytes!) {
		nfts(where: {owner: $owner}) {
			id
			tokenId
			owner
			approved
			stake
		}
	}
`
export interface Histories {
	id: string;
	index: number;
	category: string;
	title: string;
	count: number;
	imgHash: string;
	priceForBBOSS: number;
	priceForUSD: number;
	createdAt: number;
}

export interface HistoriesData {
	items : Histories[];
}  

export const GET_MARKET_ITEMS = gql`
	query GetMarketItems {
		itemLists {
			createdAt
			count
			category
			imgHash
			index
			priceForBBOSS
			priceForUSD
			title
		}
	}
`
 
export const GET_HISTORIES = gql`
	query GetHistories {
		listHistories {
			createdAt
			count
			category
			imgHash
			index
			priceForBBOSS
			priceForUSD
			title
		  }
	}
`

export interface BuyHistories {
	id: string;
	index: number;
	category: string;
	title: string;
	count: number;
	imgHash: string;
	priceForBBOSS: number;
	priceForUSD: number;
	createdAt: number;
}

export interface BuyHistoriesData {
	items : BuyHistories[];
}  

export const GET_BUY_HISTORIES = gql`
	query GetBuyHistories {
		buyHistories {
			title
			payMethod
			paidAmount
			index
			id
			email
			createdAt
			count
			category
			buyer
		  }
	}
`
// category
// title

