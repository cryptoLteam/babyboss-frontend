import React, { useEffect, useState } from 'react'
import GlobModal from 'components/GlobModal'
import { VscChromeClose, VscInfo, VscSettings } from "react-icons/vsc"
import { useWeb3Context } from 'hooks/useWeb3Context';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { GRAPH_API_URL } from 'config/nfts';
import { getStakingContract } from 'utils/contractHelpers';

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
  useEffect(() => {
    selectedChain(1)
  })

  const web3Context = useWeb3Context()

  const [modalOpen1, setModalOpen1] = useState<any>(false)  
  const [modalOpen2, setModalOpen2] = useState<any>(false)  
  const [modalOpen3, setModalOpen3] = useState<any>(false)  
  const [message, setMessage] = useState<String>("")  
  // upload product
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [insertCount, setInsertCount] = useState<number>(0);
  const [priceBB, setPriceBB] = useState<number>(0);
  const [priceUSD, setPriceUSD] = useState<number>(0);
  const [ipfsHash, setIpfsHash] = useState<string>('');

  const [productImage, setProductImage] = useState<String>("");  
  const [productName, setProductName] = useState<String>("");
  const [productPrice, setProductPrice] = useState<String>("");
  const [productPriceType, setProductPriceType] = useState<String>("");
  const [productEmail, setProductEmail] = useState<String>("");
 

  // admin 
  const handleAdminFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?event.target.files[0]:null);
  };
  
  const handleAdminOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
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
      return
    }

    if (selectedFile === null) { return; }
    if (selectedOption === '') { return; }
    if (insertCount === 0) { return; }
    if (priceBB === 0) { return; }
    if (priceUSD === 0) { return; }

    // file upload
    if (selectedFile) {
    }



    setModalOpen2(false);
  }

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make API call to upload file
      // axios.post('/api/upload', formData)
      //   .then(response => console.log(response))
      //   .catch(error => console.log(error));
    }
  };

  const handleProductSubmit = (e:React.MouseEvent<HTMLDivElement>): void => {
    setModalOpen1(true);
    console.log("click1");
  }


  const handleHistorySubmit = (e:React.MouseEvent<HTMLDivElement>): void => {
    setModalOpen3(true);
    console.log("click3");

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
                <label className=' text-black mt-2 float-right '>Name : </label>
              </div>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-left '>{ productName }</label>
              </div>
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Price : </label>
              </div>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-left '>{ productPrice }</label>
              </div>
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Price Type : </label>
              </div>
              <Select value={selectedOption} onChange={handleAdminOptionChange}>
                <Option value="">Choose an option</Option>
                <Option value="apparels">apparels</Option>
                <Option value="plushies">plushies</Option>
                <Option value="misc">misc</Option>
              </Select>
            </div>
            <div className='flex mt-2'>
              <div className=' w-28 mb-2 mr-2'>
                <label className=' text-black mt-2 float-right '>Email : </label>
              </div>
              <InputVal type='email' required />
            </div>
          </div>
          <div className=' flex items-center justify-center py-3'>
            <button onClick={() => setModalOpen2(false)} className=' px-16 py-2 text-sm rounded-3xl text-black border-2 border-black'>Submit</button>
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

      <GlobModal size="md" open={modalOpen3} setOpen={setModalOpen3} >
				<div >
					<div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
						<h1 className=' text-xl text-white'>Buy</h1> <VscChromeClose onClick={() => setModalOpen3(false)} className=' w-5 h-5 cursor-pointer text-white ' />
					</div>
					<div className=' flex items-center justify-center w-full pt-10 pb-5'>
						<svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
					</div>
					<p className=' text-sm text-center text-white py-2'>{message}</p>

					<div className=' flex items-center justify-center py-3'>
						<button onClick={() => setModalOpen3(false)} className=' px-16 py-2 text-sm rounded-3xl text-pr border-2 border-pr'>Cancel</button>
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
            <div className='py-2 px-1 lg:px-20 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg ' >
              apparels
            </div>
            <div className='py-2 px-1 lg:px-20 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' >
              plushies
            </div>
            <div className='py-2 px-1 lg:px-20 cursor-pointer rounded-md font3 lg:text-right text-sm lg:text-lg' >
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
        <div className=' mx-5 my-5 cursor-pointer'>
          <div className='bg-red-500 rounded-3xl'>
            <img src='images/image-layer2.png' />
          </div>
          <div className=' text-center pt-1 lg:text-1xl'>
            baby boss 2023 hoodi
          </div>
          <div className=' text-center pt-2 lg:text-2xl text-sm' style={{ color: '#ff06f5' }}>
            $80
          </div>
          <div className=' text-center pt-3 lg:text-2xl text-sm' style={{ color: '#ff06f5' }} onClick={ handleProductSubmit }>
            <label className='cursor-pointer bg-blue-600 font3 text-white px-5 py-3 rounded-xl'>Buy</label>
          </div>
        </div>
      </div>
    </div>      
  </div>
  )
}

export default Market;