import React, { useEffect, useState, ReactElement } from "react";
import { StaticJsonRpcProvider, JsonRpcProvider } from "@ethersproject/providers";
import { RPC_URL, INFURA_ID, CHAIN } from 'config'
import { getChainData } from 'utils/getChainData'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import WalletConnectProvider from '@walletconnect/web3-provider'

export type Web3ContextData = {
  provider: JsonRpcProvider;
  setProvider: any;
  account: string;
  setAccount: any;
  connectWallet: any;
  switchNetwork: any;
  disconnect: any;
  chainId: number;
} | null;

export const Web3Context = React.createContext<Web3ContextData>(null);

export const Web3ContextProvider: React.FC<{ children: ReactElement, id: number }> = ({ children, id }) => {
  const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(RPC_URL[id]));
  const [account, setAccount] = useState<string>('');
  // const [snackbar, setSnackbar] = useState<any>(null);
  const [chainId, setChainId] = useState<number>(0);

  const providerOptions =  {
    walletlink: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "NFT Stakging", // Required
        infuraId: INFURA_ID // Required unless you provide a JSON RPC url; see `rpc` below
      }
    },
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID // required
      }
    }
  }

  // const [web3Modal, setWeb3Modal] = useState()
  const web3Modal = new Web3Modal({
    network: getChainData(CHAIN[id]).network,
    cacheProvider: true, // optional
    providerOptions: providerOptions
  })
  
  // const [web3Modal, setWeb3Modal] = useState(new Web3Modal({
  //   network: getChainData(CHAIN[id]).network,
  //   cacheProvider: true, // optional
  //   providerOptions: providerOptions
  // }))

  // useEffect(() => {
  //   setWeb3Modal(new Web3Modal({
  //     network: getChainData(CHAIN[id]).network,
  //     cacheProvider: true, // optional
  //     providerOptions: providerOptions
  //   }))
  // }, [id, providerOptions])



  const subscribeProvider = (provider: any) => {
    provider.on("disconnect", (error: any) => {
      console.log("Wallet disconnected.");
      setChainId(0);
      setAccount('');
    });
    provider.on("accountsChanged", (accounts: any) => {
      console.log("account changed.")
      setAccount(accounts[0]?.toLowerCase());
    });
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log("Chain Id: ", chainId)
      setChainId(chainId);
      connectWallet()
    });
  };

  useEffect(() => {
    const eagerConnect = async () => {
      await connectWallet()
    }
    if (web3Modal.cachedProvider) {
      eagerConnect()
    }
  }, []);

  const connectWallet = async () => {
    try{
      const provider = await web3Modal.connect()
      subscribeProvider(provider);
      const library = new ethers.providers.Web3Provider(provider)
      const accounts = await library.listAccounts()

      if (accounts) {
        setAccount(accounts[0]?.toLowerCase())
      }
      if (library) {
        setProvider(provider)
      }
      if(provider) {
        setChainId(Number(provider.chainId))
      }

    } catch (error) {
      console.error(error);
    }
  }

  const switchNetwork = async() => {
    try{
      const provider = await web3Modal.connect()
      subscribeProvider(provider);
      const library = new ethers.providers.Web3Provider(provider)
      const accounts = await library.listAccounts()

      if (accounts) {
        setAccount(accounts[0]?.toLowerCase())
      }
      if (library) {
        setProvider(provider)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const disconnect = async () => {
    await web3Modal.clearCachedProvider()
    setAccount('')
  }

  return <Web3Context.Provider value={{ provider, setProvider, account, chainId, setAccount, connectWallet, switchNetwork, disconnect }}>{children}</Web3Context.Provider>;
};
