import { createContext, useState, CSSProperties } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { RefreshContextProvider } from 'contexts/RefreshContext';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Header from 'layouts/Header';
import Footer from 'layouts/Footer';
import Main from 'views/main';
import Stake from 'views/stake';
import Market from 'views/market';
import ScrollUpButton from 'components/scrollUpButton';
import { Web3ContextProvider } from 'contexts/Web3Context';

export const MainContext = createContext({})

const override: CSSProperties = {
  display: "block",
  position: 'fixed',
  left: '0',
  top: '0',
  width: '100vw',
  height: '100vh',
  margin: "0 auto",
  borderColor: "red",
};

const App = () => {
  const isLogin = true;
  const [toggle, setToggle] = useState(false)
  const [loader, setLoader] = useState(false)
  const [selectedChain, setSelectedChain] = useState(1)

  return (
    <Web3ContextProvider id={selectedChain}>
      <RefreshContextProvider>
        <MainContext.Provider value={{toggle, setToggle}}>
          <BrowserRouter>
            <ToastContainer />
            <div className='container'>
              <Header />
              <Routes>
                <Route path="/" element={<Main setLoader={setLoader}/>} /> 
                <Route path="/stake" element={isLogin? <Stake /> : <Navigate to='/' />} />
                <Route path="/market" element={isLogin? <Market selectedChain={setSelectedChain}/> : <Navigate to='/' />} />
              </Routes>
              <Footer />
            </div>
            <ScrollUpButton />
          </BrowserRouter>
        </MainContext.Provider>
      </RefreshContextProvider>
    </Web3ContextProvider>
  );
}

export default App;
