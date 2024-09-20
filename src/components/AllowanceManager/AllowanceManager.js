import React, { useState, useContext } from 'react';
import { CoinContext } from '../../context/CoinContext'; // Use CoinContext for wallet and allowance management
import { isAddress } from 'ethers'; 
import CryptoModal from './CryptoModal';
import './AllowanceManager.css'; // Custom CSS for styling

const AllowanceManager = () => {
  const { connectedAddress, approveAllowance, checkAllowance, connectionStatus } = useContext(CoinContext); // Destructure functions from CoinContext

  const [spender, setSpender] = useState('');
  const [amount, setAmount] = useState('');
  const [allowance, setAllowance] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState('approve');

  const handleApprove = async () => {
    setError('');
    setSuccess('');

    if (!isAddress(spender)) {
      setError('Please enter a valid Ethereum address for the spender.');
      return;
    }

    if (!connectedAddress || connectionStatus !== 'connected') {
      setError('Please connect your wallet first.');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      console.log(`Attempting to approve ${amount} MTK for spender ${spender}`);
      const tx = await approveAllowance(spender, amount);
      console.log(`Approval transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log(`Transaction mined: ${tx.hash}`);
      setSuccess(`Successfully approved ${amount} MTK for spender ${spender}. Transaction Hash: ${tx.hash}`);
      setModalOpen(true);
    } catch (err) {
      console.error('Error approving allowance:', err);
      setError(err.message || 'Failed to approve allowance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAllowance = async () => {
    setError('');
    setAllowance(null);

    if (!isAddress(spender)) {
      setError('Please enter a valid Ethereum address for the spender.');
      return;
    }

    if (!connectedAddress || connectionStatus !== 'connected') {
      setError('Please connect your wallet first.');
      return;
    }

    setLoading(true);
    try {
      const allowanceAmount = await checkAllowance(connectedAddress, spender);
      setAllowance(allowanceAmount);
      setModalOpen(true);
    } catch (err) {
      console.error('Error fetching allowance:', err);
      setError(err.message || 'Failed to fetch allowance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="allowance-manager-container">
        <h2 className="title">
          {mode === 'approve' ? 'Approve Allowance' : 'Check Allowance'}
        </h2>

        <div className="form">
          <label htmlFor="spender" className="form-label">Spender Address</label>
          <input
            type="text"
            id="spender"
            className="form-input"
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
          />

          {mode === 'approve' && (
            <>
              <label htmlFor="amount" className="form-label">Amount (MTK)</label>
              <input
                type="text"
                id="amount"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </>
          )}

          <button
            onClick={mode === 'approve' ? handleApprove : handleCheckAllowance}
            disabled={loading}
            className="form-button"
          >
            {loading
              ? mode === 'approve' ? 'Approving...' : 'Checking...'
              : mode === 'approve' ? 'Approve' : 'Check Allowance'
            }
          </button>

          <button
            onClick={() => setMode(mode === 'approve' ? 'check' : 'approve')}
            className="switch-mode-button"
          >
            {mode === 'approve' ? 'Switch to Check Allowance' : 'Switch to Approve Allowance'}
          </button>
        </div>

        {modalOpen && (
          <CryptoModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={mode === 'approve' ? 'Allowance Approval Result' : 'Allowance Check Result'}
          >
            {mode === 'approve' && success && (
              <p className="alert alert-success">{success}</p>
            )}
            {mode === 'check' && allowance !== null && (
              <p className="alert alert-success">Current Allowance: {allowance} MTK</p>
            )}
            {error && (
              <p className="alert alert-error">{error}</p>
            )}
          </CryptoModal>
        )}
      </div>
    </>
  );
};

export default AllowanceManager;
