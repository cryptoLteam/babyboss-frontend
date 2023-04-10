import React, { useEffect, useState, useRef } from 'react'
import GlobModal from 'components/GlobModal'
import { VscChromeClose, VscInfo, VscSettings } from "react-icons/vsc"
import { useWeb3Context } from 'hooks/useWeb3Context';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GRAPH_API_URL_MARKETPLACE } from 'config/nfts';
import { GET_NFTS, GetNftsData, Nft, GET_HISTORIES, HistoriesData, Histories, GET_BUY_HISTORIES, BuyHistoriesData, BuyHistories } from 'queries/querys';
import { getMarketplaceContract } from 'utils/contractHelpers';
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { forEach } from 'lodash';
import { create } from 'ipfs-http-client';

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
  
const Market = ({selectedChain}: {selectedChain: any}) => {
  const web3Context = useWeb3Context();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadHistory, setUploadHistory] = useState<any>([]);
  const [buyloadHistory, setbuyloadHistory] = useState<any>([]);
  const [buyhistory, setBuyHistory] = useState<any>([]);
  const [selIndex, setSelIndex] = useState<number>(0)
  const [tab, selectTab] = useState<string>('apparels')

  useEffect(() => {
    const fetchItems =async (account:string) => {
			const client = new ApolloClient({
        uri: GRAPH_API_URL_MARKETPLACE,
        cache: new InMemoryCache(),
      });

      const lists = await client.query<any>({ query: GET_HISTORIES });
      const buylists = await client.query<any>({ query: GET_BUY_HISTORIES })

      if(lists && lists.data.listHistories.length > 0) {
        setUploadHistory(lists.data.listHistories);
      } else {
        setUploadHistory([]);
      } 

      console.log(lists);


      if(buylists && buylists.data.buyHistories.length > 0) {
        setbuyloadHistory(buylists.data.buyHistories);
      } else {
        setbuyloadHistory([]);
      } 

		}

		if (web3Context?.account) {
			fetchItems(web3Context.account);
		}

    selectedChain(1);

  }, [selectedChain])

  const [modalOpen1, setModalOpen1] = useState<any>(false)  
  const [modalOpen2, setModalOpen2] = useState<any>(false)  
  const [modalOpen3, setModalOpen3] = useState<any>(false)  
  const [message, setMessage] = useState<string>("")  
  // buy product 
  const [selectedPriceType, setSelectedPriceType] = useState<string>("NONE");
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [priceForBBOSS, setpriceForBBOSS] = useState<number>(0);
  const [priceForMATIC, setpriceForMATIC] = useState<number>(0);
  const [priceForUSD, setpriceForUSD] = useState<number>(0);
  const [productId, setproductId] = useState<number>(0);
  // upload product
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [productTitle, setProductTitle] = useState<string>('');
  const [insertCount, setInsertCount] = useState<number>(0);
  const [priceBB, setPriceBB] = useState<number>(0);
  const [priceMatic, setPriceMatic ] = useState<number>(0);
  const [priceUSD, setPriceUSD] = useState<number>(0);
  const [ipfsHash, setIpfsHash] = useState<string>('');

  const [productImage, setProductImage] = useState<string>("");  
  const [categoryName, setCategoryName] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productPriceType, setProductPriceType] = useState<string>("");
  const [productEmail, setProductEmail] = useState<string>("");
 
  // buy
  const handleBuyOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("handleBuyOptionChange");   
    const type = event.target.value;
    // console.log(priceForBBOSS, priceForMATIC, priceForUSD);
    if (type === "BBOSS") {
      setProductPrice(priceForBBOSS as unknown as number);
      setSelectedPriceType("BBOSS");   
    } else if (type === "NATIVE" ) {
      setProductPrice(priceForMATIC as unknown as number);
      setSelectedPriceType("NATIVE");   
    } else if (type === "STABLE" ) {
      setSelectedPriceType("STABLE");   
      setProductPrice(priceForUSD as unknown as number);
    } else if (type === "NONE" ){
      setSelectedPriceType("NONE");   
      setProductPrice(0);
    }
 
    console.log(selectedPriceType);
  }

  const handleBuyCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCount(event.target.value as unknown as number);
  }

  const handleBuyEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEmail(event.target.value);
  }
  
  const handleBuyPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductPrice(event.target.value as unknown as number);
  }

  const handleOpenBuyModal = (ind: number) => {
    let selInfo:any;

    uploadHistory.forEach((item:any) => {
      if (item.index === ind) {
        selInfo = item;
        console.log(item);
      }
    });

    setproductId(selInfo.index);
    setCategoryName(selInfo.category);    
    setProductName(selInfo.title);
    setpriceForBBOSS(parseFloat(selInfo.priceForBBOSS));
    setpriceForMATIC(parseFloat(selInfo.priceForMATIC));
    setpriceForUSD(parseFloat(selInfo.priceForUSD));
    setModalOpen1(true);
  } 

  const handleBuySubmit = async() => {
    if(!web3Context?.account) {
      toast.error("Confirm your wallet connection!");
      return
    }

    const isValidEmail: boolean = emailRegex.test(selectedEmail);

    if (selectedCount === 0) {
      return;
    }

    if (selectedPriceType === "NONE") {
      return;
    }

    if (!isValidEmail) {
      return;
    }

    const contract = getMarketplaceContract(1, web3Context?.provider);
    await contract.methods.buyItem(productId, selectedCount,  categoryName, productName, selectedPriceType, selectedEmail).send({from: web3Context.account});

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

  const handleAdminPriceMaticChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceMatic(event.target.value as unknown as number);
  }

  const handleAdminPriceUSDChanage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceUSD(event.target.value as unknown as number);
  };
  
  const handleAdminSubmit = async() => {
    if(!web3Context?.account) {
      toast.error("Confirm your wallet connection!");
      return
    }

    if (selectedFile === null) { return; }
    if (selectedOption === '') { return; }
    if (productTitle === '') { return; }
    if (insertCount === 0) { return; }
    if (priceBB === 0) { return; }
    if (priceMatic === 0) { return; }
    if (priceUSD === 0) { return; }

    if (selectedFile) {
      // file upload
      await Moralis.start({
        apiKey: API_KEY,
      });
    
      // const abi = [
      //   {
      //     path: "YOUR_FILE_PATH",
      //     content: "YOUR_JSON_OR_BASE64",
      //   },
      // ];
      // const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });
      // const hashImg = (response.toJSON())[0]['path']; 

      const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });
      const fileAdded = await ipfs.add(selectedFile);
      const hash = `https://ipfs.infura.io/ipfs/${fileAdded.path}`
      // const hash = fileAdded.cid.toString();

      // contract
      console.log(`File uploaded to IPFS with hash: ${hash}`);

      // console.log(" hashImg: ", hashImg);
      // return;

      const contract = getMarketplaceContract(1, web3Context?.provider);

      // await contract.methods.listItem(selectedOption, productTitle, hashImg, insertCount, priceBB, priceMatic, priceUSD).send({from: web3Context.account});
    }

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
              <img src='{ productImage }' />
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Category : </label>
              </div>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-left '>{ categoryName }</label>
              </div>
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Name : </label>
              </div>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-left '>{ productName }</label>
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
                <Input id="file-input" type="file" onChange={ handleAdminFileChange } autoFocus />
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
              <InputVal type='number' value={ priceMatic } onChange={ handleAdminPriceMaticChange } autoFocus />
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

      <GlobModal size="sm"   open={modalOpen3} setOpen={setModalOpen3} >
        <div className='font-sans	'>
					<div className=' w-full flex items-center justify-between px-3 py-2 border-b border-black'>
						<h1 className=' text-xl text-black'>Buy History</h1> 
            <VscChromeClose onClick={() => setModalOpen3(false)} className=' w-5 h-5 cursor-pointer text-black ' />
					</div>
  				<div className='w-full flex items-center justify-between px-3 py-2 border-b border-black'>
            <div style={{ overflow: "auto", margin:"auto", width:"600px" }} className=' list-table relative'  >
              <div className='flex bg-white head'>
                <div>Category</div>
                <div>title</div>
                <div>count</div>
                <div>payMethod</div>
                <div className='w-24'>email</div>
              </div>
              <div className=' h-28 main'>
                <div className='flex'>
                  <div>Category</div>
                  <div>title</div>
                  <div>count</div>
                  <div>payMethod</div>
                  <div>hellenistic00@gamil.com</div>
                </div>
                <div className='flex'>
                  <div>Category</div>
                  <div>title</div>
                  <div>count</div>
                  <div>payMethod</div>
                  <div>hellenistic00@gamil.com</div>
                </div>
                <div className='flex'>
                  <div>Category</div>
                  <div>title</div>
                  <div>count</div>
                  <div>payMethod</div>
                  <div>hellenistic00@gamil.com</div>
                </div>
                <div className='flex'>
                  <div>Category</div>
                  <div>title</div>
                  <div>count</div>
                  <div>payMethod</div>
                  <div>hellenistic00@gamil.com</div>
                </div>
                <div className='flex'>
                  <div>Category</div>
                  <div>title</div>
                  <div>count</div>
                  <div>payMethod</div>
                  <div>hellenistic00@gamil.com</div>
                </div>
                <div className='flex'>
                  <div>Category</div>
                  <div>title</div>
                  <div>count</div>
                  <div>payMethod</div>
                  <div>hellenistic00@gamil.com</div>
                </div>
              </div>
            </div>
          </div>
          <div className=' flex items-center justify-center py-3'>
            <button onClick={() => setModalOpen3(false)} className=' px-16 py-2 text-sm rounded-3xl text-black border-2 border-black'>OK</button>
          </div>
        </div>
    </GlobModal>

      <div className=' fixed top-80 bg-red-400 rounded-r-md cursor-pointer text-2xl '>
        <div className='p-3 hover:text-white' onClick={ handleHistorySubmit } >
          <VscInfo />
        </div>
        <div className='p-3 hover:text-white' onClick={() => setModalOpen2(true) } >
          <VscSettings />
        </div>
      </div>
      
      <div className='px-4 lg:px-32 py-4 lg:pt-20'>
        <div className="lg:flex lg:justify-between lg:flex-row">
          <div className='py-2 px-4 cursor-pointer rounded-t-md font3 text-4xl' >
              STORE
          </div>
          <div className='flex border-b-2 border-gray-600 w-full lg:justify-end justify-center'>
            <div className='py-2 px-1 lg:px-20 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg ' onClick={() => selectTab('apparels') } >
              apparels
            </div>
            <div className='py-2 px-1 lg:px-20 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' onClick={() => selectTab('plushies') } >
              plushies
            </div>
            <div className='py-2 px-1 lg:px-20 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' onClick={() => selectTab('misc') } >
              misc
            </div>
            <div className='py-1 lg:py-2 px-1 lg:px-8 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' >
              <button className='bg-black mb-1 text-white text-sm px-1 py-1 rounded-md float-right'>
                CHECKOUT
              </button>
            </div>            
          </div>
      </div>
    </div>
    <div className='px-4 lg:px-32 py-4 lg:py-4 ' id="nft-lists">
      <div className="flex grid lg:grid-cols-4 grid-cols-1">
        {uploadHistory?.map((item:Histories, index:number) => (          
          (item.category === tab) ? (
            <div key={index} className=' mx-5 my-5 cursor-pointer'>
              <div className='bg-red-500 rounded-3xl'>
                <img src='images/image-layer2.png' />
              </div>
              <div className=' text-center pt-1 lg:text-1xl'>
                { item.title }
              </div>
              <div className=' text-center pt-2 lg:text-2xl text-sm' style={{ color: '#ff06f5' }}>
                { item.priceForBBOSS } BBOSS
              </div>
              <div className=' text-center pt-3 lg:text-2xl text-sm' style={{ color: '#ff06f5' }} onClick={ () =>handleOpenBuyModal(item.index) }>
                <label className='cursor-pointer bg-blue-600 font3 text-white px-5 py-3 rounded-xl'>Buy</label>
              </div>
            </div>
          ) : ''
        ))}        
      </div>
    </div>      
  </div>
  )
}

export default Market;