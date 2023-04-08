import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CookiesProvider } from "react-cookie";
import { Web3ContextProvider } from 'contexts/Web3Context'
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

export const SelectedChainId = ({ initialValue }: { initialValue: number }) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
  };
};

root.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
