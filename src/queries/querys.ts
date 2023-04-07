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