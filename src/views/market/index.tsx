import React, { useEffect, useState, useRef } from 'react'
import GlobModal from 'components/GlobModal'
import { VscChromeClose, VscInfo, VscSettings } from "react-icons/vsc"
import { useWeb3Context } from 'hooks/useWeb3Context';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GRAPH_API_URL_MARKETPLACE, BACKEND_URL } from 'config/nfts';
import { GET_NFTS, GetNftsData, Nft, GET_HISTORIES, GET_MARKET_ITEMS, Histories, GET_BUY_HISTORIES, BuyHistoriesData, BuyHistories } from 'queries/querys';
import { getMarketplaceContract, getRewardContract, getUsdtContract } from 'utils/contractHelpers';
import Moralis from "moralis";
// import * from "@moralisweb3";
import axios from 'axios';
import { CHAIN } from 'config';
import { ethers } from 'ethers';
import { getMarketplaceAddress } from 'utils/addressHelpers';
import { async } from 'q';
// import Moralis from "moralis";
// import { EvmChain } from "@moralisweb3/common-evm-utils";
// import { forEach } from 'lodash';
// import { create } from 'ipfs-http-client';

const API_KEY = "oaK7FkVxleNibQEBBnkKJjKihHOhidxRljMxJLDhEmqjAD8C0KweUWnXxzjcEpRU";
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Input = styled.input`
  display: none;
`;

const InputVal = styled.input`
  width: 200px;
  height: 40px;
  padding: 10px;
  border: 2px solid lightgray;
  border-radius: 5px;
  background-color: #f2f2f2;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    border: none;
    background-color: #e6e6e6;
  }

  &:focus {
    outline: lightgray;
    border: none;
    box-shadow: 0 0 0 2px #007bff;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 50px;
  border: 2px dashed gray;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  color: gray;
  cursor: pointer;
  margin-top: 20px;
  margin-right: 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: #aaa;
    color: #aaa;
  }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #0062cc;
  }
`;

const Select = styled.select`
  width: 200px;
  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #f2f2f2;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #e6e6e6;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #007bff;
  }
`;

const Option = styled.option`
  background-color: #f2f2f2;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  `;


const ownerWallet = '0x2db1f6eC280AECf2035567E862700f24D952573d'

const Market = ({selectedChain}: {selectedChain: any}) => {
  const web3Context = useWeb3Context();
  const [marketItems, setMarketItems] = useState<any>([]);
  const [buyloadHistory, setbuyloadHistory] = useState<any>([]);
  const [tab, selectTab] = useState<string>('apparels')
  
  useEffect(() => {
    selectedChain(1);

    const fetchItems =async () => {
			const client = new ApolloClient({
        uri: GRAPH_API_URL_MARKETPLACE,
        cache: new InMemoryCache(),
      });

      const lists = await client.query<any>({ query: GET_MARKET_ITEMS });
      const buylists = await client.query<any>({ query: GET_BUY_HISTORIES })

      console.log("sniper: fetch item success", lists)
      if(lists && lists.data.itemLists.length > 0) {
        const _marketItems = lists.data.itemLists.map((item: any) => {
          return {
            id: item.id,
            index: Number(item.index),
            category: item.category,
            title: item.title,
            count: Number(item.count),
            imgHash: item.imgHash,
            priceForBBOSS: Number(ethers.utils.formatEther(item.priceForBBOSS)),
            priceForUSD: Number(ethers.utils.formatUnits(item.priceForUSD, 6)),
            createdAt: Number(item.createdAt),
          }
        })
        setMarketItems(_marketItems);
      } else {
        setMarketItems([]);
      } 
      // console.log(lists);
      if(buylists && buylists.data.buyHistories.length > 0) {
        const _buyItems = buylists.data.buyHistories.map((item: any) => {
          return {
            title: item.title,
            payMethod: item.payMethod,
            paidAmount: Number(ethers.utils.formatEther(item.paidAmount)),
            index: Number(item.index),
            id: item.id,
            email: item.email,
            createdAt: Number(item.createdAt),
            count: Number(item.count),
            category: item.category,
            buyer: item.buyer
          }
        })
        setbuyloadHistory(_buyItems);
      } else {
        setbuyloadHistory([]);
      } 
		}
    
    fetchItems();
  }, [selectedChain])

  const [maticPrice, setMaticPrice] = useState(0)
  useEffect(() => {
    const fetchMaticPrice = async () => {
      try {
        const contract = getMarketplaceContract(1, web3Context?.provider);
        const nativePrice = await contract.methods.getNativePrice().call()
        setMaticPrice(Number(ethers.utils.formatEther(nativePrice)))
        console.log("sniper: matic price: ", Number(ethers.utils.formatEther(nativePrice)))
      } catch (error) {
        console.error(error)
      }
    }
    if(web3Context) fetchMaticPrice()
  }, [web3Context])

  const [modalOpen1, setModalOpen1] = useState<any>(false)  
  const [modalOpen2, setModalOpen2] = useState<any>(false)  
  const [modalOpen3, setModalOpen3] = useState<any>(false)  
  // buy product 
  const [selectedPriceType, setSelectedPriceType] = useState<string>("NONE");
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any>();
  // upload product
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [productTitle, setProductTitle] = useState<string>('');
  const [insertCount, setInsertCount] = useState<number>(0);
  const [priceBB, setPriceBB] = useState<number>(0);
  const [priceUSD, setPriceUSD] = useState<number>(0);
  const [productImage, setProductImage] = useState<string>("");
  
  // buy
  const handleBuyOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("handleBuyOptionChange");   
    const type = event.target.value;
    if (type === "BBOSS") {
      setSelectedPriceType("BBOSS");   
    } else if (type === "NATIVE" ) {
      setSelectedPriceType("NATIVE");   
    } else if (type === "STABLE" ) {
      setSelectedPriceType("STABLE");   
    } else if (type === "NONE" ){
      setSelectedPriceType("NONE");   
    }
 
    console.log(selectedPriceType);
  }

  const handleBuyCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCount(event.target.value as unknown as number);
  }

  const handleBuyEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEmail(event.target.value);
  }
  
  // const handleBuyPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setProductPrice(event.target.value as unknown as number);
  // }

  const handleOpenBuyModal = (ind: number) => {
    let selInfo:any;
    console.log(marketItems);

    marketItems.forEach((item:any) => {
      if (item.index === ind) {
        selInfo = item;
      }
    });

    setSelectedItem(selInfo);
    setProductImage(selInfo.imgHash);
    setModalOpen1(true);
  } 

  const handleBuySubmit = async() => {
    if(!web3Context?.account) {
      toast.error("Confirm your wallet connection!");
      return
    }
		if(web3Context?.chainId !== CHAIN[1]) {
		  toast.error("Confirm you are on Polygon Network!")
		  return 
		}

    const isValidEmail: boolean = emailRegex.test(selectedEmail);

    if (selectedCount === 0) {
		  toast.error("Enter Count you would like to buy!")
      return;
    }

    if (selectedCount > selectedItem.count) {
		  toast.error("Exceeded Count!")
      return;
    }

    if (selectedPriceType === "NONE") {
		  toast.error("Select payment method!")
      return;
    }

    if (!isValidEmail) {
		  toast.error("Invalid Email!")
      return;
    }
    
    console.log("sniper: selected item: ", selectedItem, selectedPriceType)
    if(selectedPriceType === "BBOSS") {
      const bboss = getRewardContract(1, web3Context.provider)
      const allowance = await bboss.methods.allowance(web3Context.account, getMarketplaceAddress(1)).call()
      if(Number(ethers.utils.formatEther(allowance)) < selectedCount * selectedItem.priceForBBOSS) {
        await bboss.methods.approve(getMarketplaceAddress(1), ethers.constants.MaxUint256).send({from: web3Context.account})
      }
      
      const contract = getMarketplaceContract(1, web3Context?.provider);
      console.log("sniper: buyItem: ", selectedItem, selectedCount, selectedPriceType, selectedEmail)
      await contract.methods.buyItem(selectedItem.index, selectedCount, selectedItem.category, 
        selectedItem.title, selectedPriceType, selectedEmail)
        .send({from: web3Context.account});
    }
    if(selectedPriceType === "STABLE") {
      const usdt = getUsdtContract(1, web3Context.provider)
      const allowance = await usdt.methods.allowance(web3Context.account, getMarketplaceAddress(1)).call()
      console.log("sniper: buyItem: ", allowance, selectedItem.priceForUSD)
      if(Number(ethers.utils.formatUnits(allowance, 6)) < selectedCount * selectedItem.priceForUSD) {
        await usdt.methods.approve(getMarketplaceAddress(1), ethers.constants.MaxUint256).send({from: web3Context.account})
      }
      
      const contract = getMarketplaceContract(1, web3Context?.provider);
      console.log("sniper: buyItem: ", selectedItem, selectedCount, selectedPriceType, selectedEmail)
      await contract.methods.buyItem(selectedItem.index, selectedCount, selectedItem.category, 
        selectedItem.title, selectedPriceType, selectedEmail)
        .send({from: web3Context.account});
    }

    if(selectedPriceType === "NATIVE") {
      const contract = getMarketplaceContract(1, web3Context?.provider);
      const nativePrice = Number(ethers.utils.formatEther(await contract.methods.getNativePrice().call()))
      console.log("sniper: buyItem: ", selectedItem.priceForUSD,nativePrice,selectedCount)
      await contract.methods.buyItem(selectedItem.index, selectedCount, selectedItem.category, 
        selectedItem.title, selectedPriceType, selectedEmail)
        .send({from: web3Context.account, value: ethers.utils.parseEther((selectedItem.priceForUSD / nativePrice * selectedCount + 0.1).toString())});
    }
    setSelectedEmail("");
    setSelectedCount(0);
    setSelectedPriceType("NONE");

    setModalOpen1(false);
  }

  // admin 
  const handleAdminFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?event.target.files[0]:null);
  };
  
  const handleAdminOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleAdminTitleChanage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductTitle(event.target.value);
  }; 

  const handleAdminInsertCountChanage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInsertCount(event.target.value as unknown as number);
  };

  const handleAdminPriceBBChanage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceBB(event.target.value as unknown as number);
  };

  const handleAdminPriceUSDChanage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceUSD(event.target.value as unknown as number);
  };
  
  const handleAdminSubmit = async() => {
    if(!web3Context?.account) {
      toast.error("Confirm your wallet connection!");
      return;
    }

		if(web3Context?.chainId !== CHAIN[1]) {
<<<<<<< HEAD
		  toast.error("Confirm you are on Ethereum Network!");
		  return;
=======
		  toast.error("Confirm you are on Polygon Network!")
		  return 
>>>>>>> 299e0503e8ec64a08e240183ce539ee708964e89
		}

    if (selectedFile === null) { toast.error("Select File"); return; }
    if (selectedOption === '') { toast.error("Select Category"); return; }
    if (productTitle === '') { toast.error("Enter Title");return; }
    if (insertCount === 0) { toast.error("Enter Count");return; }
    if (priceBB === 0) { toast.error("Enter Price for BBOSS");return; }
    if (priceUSD === 0) { toast.error("enter Price for USD");return; }

    if (selectedFile) {
      // file upload
      let hashImg = ""; 
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post(BACKEND_URL + '/api/upload', formData)
        .then(function (response) {
          console.log("hashImg");
          hashImg = response.data;
        }).catch(function(error){
          console.log(error);
        });

        console.log(hashImg);

      const contract = getMarketplaceContract(1, web3Context?.provider);
      await contract.methods.listItem(selectedOption, productTitle, hashImg, insertCount, 
          ethers.utils.parseEther(priceBB.toString()), ethers.utils.parseUnits(priceUSD.toString(), 6)).send({from: web3Context.account});    
    }

    setSelectedFile(null);
    setSelectedOption('');
    setProductTitle('');
    setInsertCount(0);
    setPriceBB(0);
    setPriceUSD(0);

    setModalOpen2(false);
  }

  const handleProductSubmit = (e:React.MouseEvent<HTMLDivElement>): void => {
    setModalOpen1(true);
    console.log("click1");
  }


  const handleHistorySubmit = (e:React.MouseEvent<HTMLDivElement>): void => {
    setModalOpen3(true);

    const fetchHistorys =async (account:string) => {
			const client = new ApolloClient({
        uri: GRAPH_API_URL_MARKETPLACE,
        cache: new InMemoryCache(),
      });		
		}

		if (web3Context?.account) {
			fetchHistorys(web3Context.account);
		}
  }

  return (
    <div>
      <GlobModal size="sm" open={modalOpen1} setOpen={setModalOpen1} >
        <div className='font-sans	'>
					<div className=' w-full flex items-center justify-between px-3 py-2 border-b border-black'>
						<h1 className=' text-xl text-black'>Buy</h1> 
            <VscChromeClose onClick={() => setModalOpen1(false)} className=' w-5 h-5 cursor-pointer text-black ' />
					</div>
					<div className='items-center justify-center w-full pt-1 pb-1'>
            <div className='flex mt-2'>
              <img src={ `${ BACKEND_URL }/uploads${productImage}` } style={{ width: '300px', margin: 'auto' }}  />
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Category : </label>
              </div>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-left '>{ selectedItem ? selectedItem?.category : "" }</label>
              </div>
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Name : </label>
              </div>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-left '>{ selectedItem? selectedItem.title : "" }</label>
              </div>
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Price Type : </label>
              </div>
              <Select value={selectedPriceType} onChange={ handleBuyOptionChange }>
                <Option value=" ">Choose Price Type</Option>
                <Option value="BBOSS">BBOSS</Option>
                <Option value="NATIVE">MATIC</Option>
                <Option value="STABLE">USDT</Option>
              </Select>
            </div>
            {/* <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Price : </label>
              </div>
              <div className=' w-28 mb-2 mr-2'>
                <InputVal type="number" className=' text-black mt-2 float-left ' value={ productPrice } onChange={ handleBuyPriceChange } />
              </div>
            </div> */}
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Count : </label>
              </div>
              <InputVal type='number' value={ selectedCount } onChange={ handleBuyCountChange } />
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Email : </label>
              </div>
              <InputVal type='email' value={ selectedEmail } onChange={ handleBuyEmailChange } />
            </div>
          </div>
          <div className=' flex items-center justify-center py-3'>
            <button onClick={ handleBuySubmit } className=' px-16 py-2 text-sm rounded-3xl text-black border-2 border-black'>Submit</button>
          </div>
        </div>
			</GlobModal>  
      
	    <GlobModal size="sm" open={modalOpen2} setOpen={setModalOpen2}  >
				<div className='font-sans	'>
					<div className=' w-full flex items-center justify-between px-3 py-2 border-b border-black'>
						<h1 className=' text-xl text-black'>Owner</h1> 
            <VscChromeClose onClick={() => setModalOpen2(false)} className=' w-5 h-5 cursor-pointer text-black ' />
					</div>
					<div className='items-center justify-center w-full pt-1 pb-1'>
            <div className='flex justify-center'>
              <Label htmlFor="file-input">
                {selectedFile ? selectedFile.name.substring(0, 5) + '...' : 'Choose a file'}
                <Input id="file-input" type="file" onChange={ handleAdminFileChange } accept="image/png, image/jpg, image/jpeg" autoFocus />
              </Label>
              {/* <Button onClick={handleFileUpload}>Upload</Button> */}
            </div>
            <div className='flex mt-2'>
            <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Category : </label>
              </div>
              <Select value={selectedOption} onChange={handleAdminOptionChange} autoFocus >
                <Option value="">Choose an option</Option>
                <Option value="apparels">apparels</Option>
                <Option value="plushies">plushies</Option>
                <Option value="misc">misc</Option>
              </Select>
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Title : </label>
              </div>
              <InputVal type='text' value={ productTitle } onChange={ handleAdminTitleChanage } autoFocus />
            </div>

            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Count : </label>
              </div>
              <InputVal type='number' value={ insertCount } onChange={ handleAdminInsertCountChanage } autoFocus />
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Price(BBoss) : </label>
              </div>
              <InputVal type='number' value={ priceBB } onChange={ handleAdminPriceBBChanage } autoFocus />
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Price(MATIC) : </label>
              </div>
              <InputVal type='number' value={  (priceUSD / maticPrice).toFixed(4) } disabled />
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Price(USD) : </label>
              </div>
              <InputVal type='number' value={ priceUSD } onChange={ handleAdminPriceUSDChanage } autoFocus />
            </div>
          </div>
          <div className=' flex items-center justify-center py-3'>
            <button onClick={ handleAdminSubmit } className=' px-16 py-2 text-sm rounded-3xl text-black border-2 border-black'>Submit</button>
          </div>
        </div>
			</GlobModal>

      <GlobModal size="xl" open={modalOpen3} setOpen={setModalOpen3} >
        <div className='font-sans	'>
					<div className=' w-full flex items-center justify-between px-3 py-2 border-b border-black'>
						<h1 className=' text-xl text-black'>Buy History</h1> 
            <VscChromeClose onClick={() => setModalOpen3(false)} className=' w-5 h-5 cursor-pointer text-black ' />
					</div>
  				<div className='w-full flex items-center justify-between px-3 py-2 border-b border-black text-center' style={{fontSize: '11px', borderCollapse: 'collapse'}}>
            <table >
              <thead>
                <tr className=''>
                  <th style={{border: "1px solid gray", paddingLeft: "5px", paddingRight: "5px"}}>Date</th>
                  <th style={{border: "1px solid gray", paddingLeft: "5px", paddingRight: "5px"}}>Category</th>
                  <th style={{border: "1px solid gray", paddingLeft: "5px", paddingRight: "5px"}}>title</th>
                  <th style={{border: "1px solid gray", paddingLeft: "5px", paddingRight: "5px"}}>count</th>
                  <th style={{border: "1px solid gray", paddingLeft: "5px", paddingRight: "5px"}}>Payment Method</th>
                  <th style={{border: "1px solid gray", paddingLeft: "5px", paddingRight: "5px"}}>Paid Amount</th>
                  <th style={{border: "1px solid gray", paddingLeft: "5px", paddingRight: "5px"}}>email</th>
                </tr>
              </thead>
              <tbody className=''>
                {buyloadHistory && buyloadHistory.map((item: any) => {
                  return <tr className=''>
                    <td style={{border: "1px solid gray"}}>{new Date(item.createdAt * 1000).toLocaleString()}</td>
                    <td style={{border: "1px solid gray"}}>{item.category}</td>
                    <td style={{border: "1px solid gray"}}>{item.title}</td>
                    <td style={{border: "1px solid gray"}}>{item.count}</td>
                    <td style={{border: "1px solid gray"}}>{item.payMethod}</td>
                    <td style={{border: "1px solid gray"}}>{item.paidAmount}</td>
                    <td style={{border: "1px solid gray"}}>{item.email}</td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
          <div className=' flex items-center justify-center py-3'>
            <button onClick={() => setModalOpen3(false)} className=' px-16 py-2 text-sm rounded-3xl text-black border-2 border-black'>OK</button>
          </div>
        </div>
    </GlobModal>

      {web3Context?.account && ownerWallet.toLowerCase() === web3Context?.account.toLowerCase() && <div className=' fixed top-80 bg-red-400 rounded-r-md cursor-pointer text-2xl '>
        <div className='p-3 hover:text-white' onClick={ handleHistorySubmit } >
          <VscInfo />
        </div>
        <div className='p-3 hover:text-white' onClick={() => setModalOpen2(true) } >
          <VscSettings />
        </div>
      </div>}
      <div className='px-4 lg:px-32 py-4 lg:pt-20'>
        <div className="lg:flex lg:justify-between lg:flex-row">
          <div className='py-2 px-4 cursor-pointer rounded-t-md font3 text-4xl' >
              STORE
          </div>
          <div className='flex border-b-2 border-gray-600 w-full lg:justify-end justify-center'>
            <div className={`py-2 px-1 lg:px-5 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg hover:text-[#ff06f5] ${tab === "apparels"? "text-[#ff06f5]" : "text-[#6740b0]"}`} onClick={() => selectTab('apparels') } >
              apparels
            </div>
            <div className={`py-2 px-1 lg:px-5 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg hover:text-[#ff06f5] ${tab === "plushies"? "text-[#ff06f5]" : "text-[#6740b0]"}`} onClick={() => selectTab('plushies') } >
              plushies
            </div>
            <div className={`py-2 px-1 lg:px-5 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg hover:text-[#ff06f5] ${tab === "misc"? "text-[#ff06f5]" : "text-[#6740b0]"}`} onClick={() => selectTab('misc') } >
              misc
            </div>
            {/* <div className='py-1 lg:py-2 px-1 lg:px-8 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' >
              <button className='bg-black mb-1 text-white text-sm px-1 py-1 rounded-md float-right'>
                CHECKOUT
              </button>
            </div>             */}
          </div>
      </div>
    </div>
    <div className='px-4 lg:px-32 py-4 lg:py-4 ' id="nft-lists">
      <div className="grid lg:grid-cols-3 grid-cols-1">
        {marketItems?.map((item:Histories, index:number) => {
            return (          
              (item.category === tab) ? (
                <div key={index} className=' mx-5 my-5 cursor-pointer'>
                  <div className='bg-red-500 rounded-3xl'>
                    <img src='images/image-layer2.png' alt=''/>
                  </div>
                  <div className='pt-1 lg:text-1xl'>
                    {`${item.title}`}
                  </div>
                  <div className='flex align-center justify-between mt-2'>
                    <div className=' lg:text-md text-sm'>
                      Price(BBOSS)
                    </div>
                    <div style={{ color: '#ff06f5' }}>{ item.priceForBBOSS }</div>
                  </div>
                  <div className='flex align-center justify-between'>
                    <div className=' lg:text-md text-sm'>
                      Price(USDT)
                    </div>
                    <div style={{ color: '#ff06f5' }}>{ item.priceForUSD }</div>
                  </div>
                  <div className='flex align-center justify-between'>
                    <div className=' lg:text-md text-sm'>
                      Price(MATIC)
                    </div>
                    <div style={{ color: '#ff06f5' }}>{ (item.priceForUSD / maticPrice).toFixed(4) }</div>
                  </div>
                  <div className=' text-center pt-3 lg:text-2xl text-sm' style={{ color: '#ff06f5' }} onClick={ () =>handleOpenBuyModal(item.index) }>
                    <label className='cursor-pointer bg-blue-600 font3 text-white px-5 py-3 rounded-xl'>Buy</label>
                  </div>
                </div>
              ) : <></>
            )
        })}        
      </div>
    </div>      
  </div>
  )
}

export default Market;