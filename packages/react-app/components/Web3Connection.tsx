import React, { useState, useEffect, useCallback } from 'react';
import { useEmojiWeb3 } from '../contexts/useEmojiWeb3';

interface Web3ConnectionProps {
  isDarkMode: boolean;
  onAddressChange?: (address: string | null) => void;
}

const Web3Connection: React.FC<Web3ConnectionProps> = ({ isDarkMode, onAddressChange }) => {
  const { address, isConnecting, connectWallet, getBalance, getContractInfo } = useEmojiWeb3();
  const [balance, setBalance] = useState<string | null>(null);
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBalance = useCallback(async () => {
    if (!address) return;
    try {
      const bal = await getBalance();
      setBalance(bal);
    } catch (err) {
      console.error('Error loading balance:', err);
    }
  }, [address, getBalance]);

  const loadContractInfo = useCallback(async () => {
    try {
      const info = await getContractInfo();
      setContractInfo(info);
    } catch (err) {
      console.error('Error loading contract info:', err);
    }
  }, [getContractInfo]);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(address);
    }
  }, [address, onAddressChange]);

  useEffect(() => {
    if (address) {
      loadBalance();
      loadContractInfo();
    }
  }, [address, loadBalance, loadContractInfo]);

  const handleConnect = async () => {
    setError(null);
    try {
      await connectWallet();
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const containerClasses = `
    p-4 rounded-lg border-2 mb-6
    ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-green-300'}
  `;

  const buttonClasses = `
    px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95
    ${isDarkMode ? 'bg-lime-600 hover:bg-lime-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}
  `;

  const infoClasses = `
    text-sm p-2 rounded font-mono break-all
    ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
  `;

  if (!address) {
    return (
      <div className={containerClasses}>
        <div className="text-center">
          <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-lime-400' : 'text-green-800'}`}>
            Connect Your Wallet
          </h3>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Connect your Web3 wallet to mint Emoji NFTs and interact with the blockchain
          </p>
          
          {error && (
            <div className={`
              mb-4 p-3 rounded-lg text-sm
              ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800'}
            `}>
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={buttonClasses}
          >
            {isConnecting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </span>
            ) : (
              '🔗 Connect Wallet'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-lime-400' : 'text-green-800'}`}>
        Wallet Connected ✅
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Address:
          </p>
          <p className={infoClasses}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>

        {balance && (
          <div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Balance:
            </p>
            <p className={infoClasses}>
              {parseFloat(balance).toFixed(4)} CELO
            </p>
          </div>
        )}
      </div>

      {contractInfo && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-lime-300' : 'text-green-700'}`}>
            EmojiNFT Contract Info
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Mint Price:</p>
              <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{contractInfo.mintPrice} CELO</p>
            </div>
            <div>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Supply:</p>
              <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{contractInfo.totalSupply}</p>
            </div>
            <div>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Max Supply:</p>
              <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{contractInfo.maxSupply}</p>
            </div>
            <div>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Remaining:</p>
              <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{contractInfo.remainingSupply}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Web3Connection;
