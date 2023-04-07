import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { GRAPH_API_URL, NFT_NUM, NULL_ADDRESS } from "config/nfts"

// import { getStakeNftLists } from 'queries/query'
import { GetNftsData, GET_NFTS } from 'queries/querys'

export const fetchNFTStakeData = async () => {
  // Initialize ApolloClient
  const client = new ApolloClient({
    uri: GRAPH_API_URL,
    cache: new InMemoryCache()
  });

  const nfts = await client.query<GetNftsData>({query: GET_NFTS, variables: {first: 1}});

  return nfts?.data.nfts;    
}
