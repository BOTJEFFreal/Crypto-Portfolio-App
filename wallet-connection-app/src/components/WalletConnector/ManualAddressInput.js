import React, { useState } from 'react';
import { InfuraProvider, isAddress, formatEther } from 'ethers';

function ManualAddressInput() {
  const [manualAddress, setManualAddress] = useState('');
  const [manualBalance, setManualBalance] = useState('');
  const [isManualAddressValid, setIsManualAddressValid] = useState(false);

  const handleManualAddressChange = (e) => {
    const inputAddress = e.target.value.trim();
    setManualAddress(inputAddress);

    if (isAddress(inputAddress)) { // validate the address
      setIsManualAddressValid(true);
      getBalance(inputAddress);
    } else {
      setIsManualAddressValid(false);
      setManualBalance('');
    }
  };

  const getBalance = async (address) => {
    try {
      const network = 'homestead';
      const provider = new InfuraProvider(
        network,
        process.env.REACT_APP_INFURA_PROJECT_ID
      );

      const balance = await provider.getBalance(address);
      const balanceInEth = formatEther(balance);
      setManualBalance(balanceInEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setManualBalance('Error fetching balance');
    }
  };

  return (
    <div>
      <h2>Or Enter a Wallet Address Manually</h2>
      <input
        type="text"
        placeholder="Enter Ethereum Address"
        value={manualAddress}
        onChange={handleManualAddressChange}
        style={{ padding: '10px', width: '300px', fontSize: '16px' }}
      />
      {manualAddress && (
        <div>
          <p style={{ color: isManualAddressValid ? 'green' : 'red' }}>
            {isManualAddressValid ? 'Valid Ethereum Address' : 'Invalid Ethereum Address'}
          </p>
          {isManualAddressValid && (
            <p>
              Balance: <strong>{manualBalance} ETH</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ManualAddressInput;
