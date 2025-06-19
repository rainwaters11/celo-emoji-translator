import React, { useState, useEffect } from 'react';
import { useEmojiWeb3Enhanced } from '../contexts/useEmojiWeb3Enhanced';
import { useIPFSUpload } from '../hooks/useIPFSUpload';

interface EmojiNFTMinterWithIPFSProps {
  isDarkMode: boolean;
  originalText: string;
  emojiMessage: string;
  onMintSuccess?: () => void;
}

const EmojiNFTMinterWithIPFS: React.FC<EmojiNFTMinterWithIPFSProps> = ({ 
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
    error: mintError 
  } = useEmojiWeb3Enhanced();

  const {
    uploadToIPFS,
    uploadImageOnly,
    uploading,
    uploadProgress,
    uploadError,
    canUpload
  } = useIPFSUpload();

  const [mintingStep, setMintingStep] = useState<'idle' | 'uploading' | 'minting' | 'success'>('idle');
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Generate preview image when text changes
  useEffect(() => {
    if (originalText && emojiMessage && canUpload()) {
      uploadImageOnly(originalText, emojiMessage, isDarkMode)
        .then(setPreviewImage)
        .catch(console.error);
    }
  }, [originalText, emojiMessage, isDarkMode, canUpload, uploadImageOnly]);

  // Handle successful mint
  useEffect(() => {
    if (isMintSuccess) {
      setMintingStep('success');
      if (onMintSuccess) {
        onMintSuccess();
      }
    }
  }, [isMintSuccess, onMintSuccess]);

  // Handle minting process
  const handleMintWithIPFS = async () => {
    if (!isConnected || !address) return;
    if (!originalText.trim() || !emojiMessage.trim()) return;

    try {
      setMintingStep('uploading');
      
      // Upload to IPFS
      console.log('Uploading to IPFS...');
      const tokenURI = await uploadToIPFS(originalText, emojiMessage, address, isDarkMode);
      setIpfsUrl(tokenURI);
      
      setMintingStep('minting');
      
      // Prepare and execute mint with IPFS URI
      prepareMint(originalText, emojiMessage);
      executeMint();
      
    } catch (error) {
      console.error('Minting process error:', error);
      setMintingStep('idle');
    }
  };

  const buttonClasses = `
    w-full font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 text-lg
    transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4
    ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white focus:ring-purple-500/50' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white focus:ring-purple-500/50'}
  `;

  const disabledButtonClasses = `
    w-full font-bold py-3 px-6 rounded-full shadow-lg text-lg opacity-50 cursor-not-allowed
    ${isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-400 text-gray-600'}
  `;

  // Show API key not configured
  if (!canUpload()) {
    return (
      <div className="mt-6">
        <button disabled className={disabledButtonClasses}>
          🔑 IPFS Not Configured
        </button>
        <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          NFT Storage API key not configured
        </p>
      </div>
    );
  }

  // Show contract not deployed message
  if (!contractInfo.isDeployed) {
    return (
      <div className="mt-6">
        <button disabled className={disabledButtonClasses}>
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
        <button disabled className={disabledButtonClasses}>
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
        <button disabled className={disabledButtonClasses}>
          🎨 Create Message to Mint NFT
        </button>
        <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Type a message and see the emoji translation to mint it as an NFT
        </p>
      </div>
    );
  }

  const isProcessing = mintingStep !== 'idle' && mintingStep !== 'success';

  return (
    <div className="mt-6">
      <button
        onClick={handleMintWithIPFS}
        disabled={isProcessing}
        className={isProcessing ? disabledButtonClasses : buttonClasses}
      >
        {mintingStep === 'uploading' ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Uploading to IPFS... ({uploadProgress}%)
          </span>
        ) : mintingStep === 'minting' ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Minting NFT...
          </span>
        ) : (
          `🚀 Mint NFT with IPFS (${contractInfo.mintPrice} CELO)`
        )}
      </button>

      <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Upload to IPFS and mint as NFT on Celo blockchain
      </p>

      {/* Progress Steps */}
      {isProcessing && (
        <div className={`
          mt-4 p-3 rounded-lg text-sm
          ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}
        `}>
          <div className="flex items-center space-x-2 mb-2">
            <span className={mintingStep === 'uploading' ? 'text-blue-500' : 'text-green-500'}>
              {mintingStep === 'uploading' ? '⏳' : '✅'}
            </span>
            <span>Upload to IPFS</span>
            {mintingStep === 'uploading' && <span>({uploadProgress}%)</span>}
          </div>
          <div className="flex items-center space-x-2">
            <span className={
              mintingStep === 'minting' ? 'text-blue-500' : 
              isMintSuccess ? 'text-green-500' : 'text-gray-400'
            }>
              {mintingStep === 'minting' ? '⏳' : isMintSuccess ? '✅' : '⏸️'}
            </span>
            <span>Mint NFT on blockchain</span>
          </div>
        </div>
      )}

      {/* Contract Stats */}
      <div className={`
        mt-3 p-2 rounded text-xs text-center
        ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}
      `}>
        Total Supply: {contractInfo.totalSupply} / {contractInfo.maxSupply} NFTs minted
      </div>

      {/* Error Messages */}
      {(uploadError || mintError) && (
        <div className={`
          mt-4 p-3 rounded-lg text-sm text-center
          ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800'}
        `}>
          <p className="font-medium">❌ Process Failed</p>
          <p className="text-xs mt-1">
            {uploadError || (mintError && (mintError as any).message) || 'Unknown error occurred'}
          </p>
        </div>
      )}

      {/* Success Message */}
      {mintingStep === 'success' && (
        <div className={`
          mt-4 p-3 rounded-lg text-sm text-center
          ${isDarkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-800'}
        `}>
          <p className="font-medium">🎉 NFT Minted Successfully!</p>
          <p className="text-xs mt-1">Your emoji NFT is now stored on IPFS and minted on Celo</p>
          <div className="flex flex-col space-y-1 mt-2">
            {ipfsUrl && (
              <a
                href={ipfsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline hover:no-underline"
              >
                View Metadata on IPFS ↗️
              </a>
            )}
            {mintTxHash && (
              <a
                href={`https://alfajores.celoscan.io/tx/${mintTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline hover:no-underline"
              >
                View Transaction on Celoscan ↗️
              </a>
            )}
          </div>
        </div>
      )}

      {/* Preview Card with IPFS Image */}
      <div className={`
        mt-4 p-4 rounded-lg border-2 text-center
        ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'}
      `}>
        <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
          NFT Preview with IPFS Storage
        </h4>
        
        {/* Preview Image */}
        {previewImage && (
          <div className="mb-3">
            <img 
              src={previewImage} 
              alt="NFT Preview" 
              className="mx-auto rounded-lg max-w-full h-32 object-cover"
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Generated Image Preview
            </p>
          </div>
        )}
        
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

        <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          📦 Stored on IPFS • 🔗 Minted on Celo
        </div>
      </div>
    </div>
  );
};

export default EmojiNFTMinterWithIPFS;
