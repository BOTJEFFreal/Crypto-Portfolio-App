import React, { useContext, useState } from 'react';
import './AccountBalance.css';
import { CoinContext } from '../../context/CoinContext';

const AccountBalance = () => {
  const { connectedAddress, ethBalance } = useContext(CoinContext);
  const [isVisible, setIsVisible] = useState(true); 

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const truncatedAddress = connectedAddress
    ? `${connectedAddress.substring(0, 6)}...${connectedAddress.substring(connectedAddress.length - 4)}`
    : 'NA';

  const [integerPart, decimalPart] = isVisible
    ? (ethBalance ? parseFloat(ethBalance).toFixed(8).split('.') : ['0', '00'])
    : ['********', ''];

  return (
    <div className="account-balance-container">
      <div className="address-container">
        <span className="address">
          {truncatedAddress}
        </span>
        <button className="copy-button" onClick={() => navigator.clipboard.writeText(connectedAddress)}>
          <i className="fa-solid fa-copy"></i>
          <div className="tooltip">Copy to Clipboard</div>
        </button>
      </div>

      <div className="balance-container">
        <span className="balance-amount">
          <span className="integer-part">${integerPart}</span>
          {decimalPart && <span className="decimal-part">.{decimalPart}</span>}
        </span>
        <button className="visibility-button" onClick={toggleVisibility}>
          <i className={`fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
        </button>
      </div>

      {/* <div className="balance-change">
        <span className="balance-change-amount">$0.00</span>
        <span className="balance-change-percentage">(0.00%)</span>
      </div> */}
    </div>
  );
};

export default AccountBalance;
