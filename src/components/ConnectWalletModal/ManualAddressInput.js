import React, { useState } from 'react';
import { InfuraProvider, isAddress, formatEther } from 'ethers';
import './ManualAddressInput.css';

const ManualAddressInput = ({ manualAddress, setManualAddress, setIsManualAddressValid }) => {
  const [manualBalance, setManualBalance] = useState('');

  const handleManualAddressChange = (e) => {
    const inputAddress = e.target.value.trim();
    setManualAddress(inputAddress);

    if (isAddress(inputAddress)) {
      setIsManualAddressValid(true);
      getBalance(inputAddress);
    } else {
      setIsManualAddressValid(false);
      setManualBalance('');
    }
  };

  const getBalance = async (address) => {
    try {
      const provider = new InfuraProvider('homestead', process.env.REACT_APP_INFURA_PROJECT_ID);
      const balance = await provider.getBalance(address);
      setManualBalance(formatEther(balance));
    } catch (error) {
      setManualBalance('Error fetching balance');
    }
  };

  return (
    <div className="manual-address-container">
      <h2>Or Enter a Wallet Address</h2>
      <input
        type="text"
        placeholder="Enter Ethereum Address"
        value={manualAddress}
        onChange={handleManualAddressChange}
        className="manual-address-input"
      />
      {manualAddress && (
        <div className="validation-feedback">
          <p className={isAddress(manualAddress) ? 'valid-address' : 'invalid-address'}>
            {isAddress(manualAddress) ? '✅ Valid Ethereum Address' : '❌ Invalid Ethereum Address'}
          </p>
          {isAddress(manualAddress) && (
            <p className="balance-display">
              Balance: <strong>{manualBalance} ETH</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManualAddressInput;
