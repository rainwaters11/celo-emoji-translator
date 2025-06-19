"use client";

import React, { useState } from 'react';
import { useIPFSUpload } from '../hooks/useIPFSUpload';
import { useEmojiIPFSMinter } from '../contexts/useEmojiIPFSMinter';

interface SimpleIPFSMinterProps {
  originalText: string;
  emojiMessage: string;
  isDarkMode: boolean;
}

const SimpleIPFSMinter: React.FC<SimpleIPFSMinterProps> = ({
  originalText,
  emojiMessage,
  isDarkMode
}) => {
  const { address, isConnected, mintNFTWithIPFS, isMinting, mintTxHash, error } = useEmojiIPFSMinter();
  const { uploadToIPFS, uploading, uploadProgress, uploadError } = useIPFSUpload();
  
  const [step, setStep] = useState<'ready' | 'uploading' | 'minting' | 'success'>('ready');
  const [ipfsUrl, setIpfsUrl] = useState<string>('');

  const handleMintNFT = async () => {
    if (!isConnected || !address || !originalText || !emojiMessage) {
      alert('Please connect your wallet and enter some text to translate');
      return;
    }

    try {
      setStep('uploading');
      
      // Upload to IPFS first
      const ipfsMetadataUrl = await uploadToIPFS(
        originalText,
        emojiMessage,
        address,
        isDarkMode
      );
      
      setIpfsUrl(ipfsMetadataUrl);
      setStep('minting');
      
      // Mint NFT with IPFS URL
      await mintNFTWithIPFS(originalText, emojiMessage, ipfsMetadataUrl);
      
      setStep('success');
      
    } catch (error) {
      console.error('Minting failed:', error);
      setStep('ready');
    }
  };

  const canMint = () => {
    return isConnected && 
           address && 
           originalText.trim() && 
           emojiMessage.trim() && 
           !uploading && 
           !isMinting &&
           step === 'ready';
  };

  const getStepDescription = () => {
    switch (step) {
      case 'uploading':
        return `Uploading to IPFS... ${uploadProgress}%`;
      case 'minting':
        return 'Minting NFT on Celo blockchain...';
      case 'success':
        return 'NFT minted successfully!';
      default:
        return 'Ready to mint';
    }
  };

  if (!isConnected) {
    return (
      <div className={`mt-6 p-4 rounded-lg border ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-600 text-gray-300' 
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <p className="text-center">Connect your wallet to mint NFTs</p>
      </div>
    );
  }

  return (
    <div className={`mt-6 p-6 rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-600' 
        : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        🎨 Mint Your Emoji Translation as NFT
      </h3>
      
      {/* Status */}
      <div className="mb-4">
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Status: {getStepDescription()}
        </div>
        
        {/* Progress bar */}
        {(uploading || isMinting) && (
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: uploading ? `${uploadProgress}%` : isMinting ? '100%' : '0%' 
              }}
            />
          </div>
        )}
      </div>

      {/* Preview */}
      <div className={`mb-4 p-4 rounded-lg border ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="text-sm font-medium mb-2">NFT Preview:</div>
        <div className="text-xs mb-1">Original: "{originalText}"</div>
        <div className="text-lg">Emoji: {emojiMessage}</div>
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMintNFT}
        disabled={!canMint()}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
          canMint()
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {step === 'uploading' && '🔄 Uploading to IPFS...'}
        {step === 'minting' && '⛓️ Minting NFT...'}
        {step === 'success' && '✅ Minted Successfully!'}
        {step === 'ready' && '🎨 Mint as NFT'}
      </button>

      {/* Error Display */}
      {(uploadError || error) && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="text-red-700 text-sm">
            Error: {uploadError || (error?.message || String(error))}
          </div>
        </div>
      )}

      {/* Success Display */}
      {step === 'success' && mintTxHash && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <div className="text-green-700 text-sm">
            <div className="font-medium">NFT Minted Successfully! 🎉</div>
            <div className="mt-2">
              <div>Transaction: <code className="text-xs">{mintTxHash}</code></div>
              {ipfsUrl && (
                <div className="mt-1">
                  IPFS: <a 
                    href={ipfsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View Metadata
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleIPFSMinter;
