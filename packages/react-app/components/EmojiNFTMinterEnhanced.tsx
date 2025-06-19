import React, { useState, useEffect } from 'react';
import { useEmojiWeb3Enhanced } from '../contexts/useEmojiWeb3Enhanced';

interface EmojiNFTMinterEnhancedProps {
  isDarkMode: boolean;
  originalText: string;
  emojiMessage: string;
  onMintSuccess?: () => void;
}

const EmojiNFTMinterEnhanced: React.FC<EmojiNFTMinterEnhancedProps> = ({ 
  isDarkMode, 
  originalText, 
  emojiMessage, 
  onMintSuccess 
}) => {
  const { 
    address, 
    isConnected,
    contractInfo,
    prepareMint, 
    executeMint, 
    isMinting, 
    isMintSuccess,
    mintTxHash,
    error 
  } = useEmojiWeb3Enhanced();

  const [hasInitialized, setHasInitialized] = useState(false);

  // Prepare the mint when text changes
  useEffect(() => {
    if (originalText && emojiMessage && isConnected && !hasInitialized) {
      prepareMint(originalText, emojiMessage);
      setHasInitialized(true);
    }
  }, [originalText, emojiMessage, isConnected, prepareMint, hasInitialized]);

  // Handle successful mint
  useEffect(() => {
    if (isMintSuccess && onMintSuccess) {
      onMintSuccess();
      setHasInitialized(false); // Reset for next mint
    }
  }, [isMintSuccess, onMintSuccess]);

  const handleMint = () => {
    if (!isConnected) {
      return;
    }

    if (!originalText.trim() || !emojiMessage.trim()) {
      return;
    }

    // Prepare and execute mint
    prepareMint(originalText, emojiMessage);
    executeMint();
  };

  const buttonClasses = `
    w-full font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 text-lg
    transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4
    ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500/50' : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500/50'}
  `;

  const disabledButtonClasses = `
    w-full font-bold py-3 px-6 rounded-full shadow-lg text-lg opacity-50 cursor-not-allowed
    ${isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-400 text-gray-600'}
  `;

  // Show contract not deployed message
  if (!contractInfo.isDeployed) {
    return (
      <div className="mt-6">
        <button
          disabled
          className={disabledButtonClasses}
        >
          📡 Contract Not Deployed
        </button>
        <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Please deploy the EmojiNFT contract first
        </p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="mt-6">
        <button
          disabled
          className={disabledButtonClasses}
        >
          🔗 Connect Wallet to Mint NFT
        </button>
        <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Connect your wallet to mint this emoji message as an NFT
        </p>
      </div>
    );
  }

  if (!originalText.trim() || !emojiMessage.trim()) {
    return (
      <div className="mt-6">
        <button
          disabled
          className={disabledButtonClasses}
        >
          🎨 Create Message to Mint NFT
        </button>
        <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Type a message and see the emoji translation to mint it as an NFT
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleMint}
        disabled={isMinting}
        className={isMinting ? disabledButtonClasses : buttonClasses}
      >
        {isMinting ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Minting NFT...
          </span>
        ) : (
          `🖼️ Mint as NFT (${contractInfo.mintPrice} CELO)`
        )}
      </button>

      <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Mint your emoji translation as a unique NFT on Celo blockchain
      </p>

      {/* Contract Stats */}
      <div className={`
        mt-3 p-2 rounded text-xs text-center
        ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}
      `}>
        Total Supply: {contractInfo.totalSupply} / {contractInfo.maxSupply} NFTs minted
      </div>

      {/* Status Messages */}
      {error && (
        <div className={`
          mt-4 p-3 rounded-lg text-sm text-center
          ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800'}
        `}>
          <p className="font-medium">❌ Minting Failed</p>
          <p className="text-xs mt-1">{error.message || 'Unknown error occurred'}</p>
        </div>
      )}

      {isMintSuccess && (
        <div className={`
          mt-4 p-3 rounded-lg text-sm text-center
          ${isDarkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-800'}
        `}>
          <p className="font-medium">🎉 NFT Minted Successfully!</p>
          <p className="text-xs mt-1">Your emoji message is now immortalized on the blockchain</p>
          {mintTxHash && (
            <a
              href={`https://alfajores.celoscan.io/tx/${mintTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline hover:no-underline mt-1 block"
            >
              View on Celoscan ↗️
            </a>
          )}
        </div>
      )}

      {/* Preview Card */}
      <div className={`
        mt-4 p-4 rounded-lg border-2 text-center
        ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'}
      `}>
        <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
          NFT Preview
        </h4>
        
        <div className="mb-3">
          <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Original Text:
          </p>
          <p className={`
            text-sm p-2 rounded font-mono
            ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-700'}
          `}>
            &quot;{originalText}&quot;
          </p>
        </div>

        <div>
          <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Emoji Translation:
          </p>
          <div className={`
            text-2xl p-3 rounded
            ${isDarkMode ? 'bg-gray-600' : 'bg-white'}
          `}>
            {emojiMessage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiNFTMinterEnhanced;
