import React, { useState, useEffect, useCallback } from 'react';
import { useEmojiWeb3 } from '../contexts/useEmojiWeb3';

interface EmojiNFT {
  tokenId: string;
  tokenURI: string;
  originalText: string;
  emojiMessage: string;
  mintTimestamp: number;
  mintDate: Date;
}

interface EmojiNFTGalleryProps {
  isDarkMode: boolean;
}

const EmojiNFTGallery: React.FC<EmojiNFTGalleryProps> = ({ isDarkMode }) => {
  const { address, getEmojiNFTs } = useEmojiWeb3();
  const [nfts, setNfts] = useState<EmojiNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNFTs = useCallback(async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    try {
      const userNFTs = await getEmojiNFTs();
      setNfts(userNFTs);
    } catch (err) {
      setError('Failed to load your NFTs');
      console.error('Error loading NFTs:', err);
    } finally {
      setLoading(false);
    }
  }, [address, getEmojiNFTs]);

  useEffect(() => {
    if (address) {
      loadNFTs();
    }
  }, [address, loadNFTs]);

  const containerClasses = `
    mt-8 p-6 rounded-lg border-2
    ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-green-300'}
  `;

  const cardClasses = `
    p-4 rounded-lg border shadow-md transition-transform hover:scale-105
    ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'}
  `;

  if (!address) {
    return (
      <div className={containerClasses}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-lime-400' : 'text-green-800'}`}>
          Your Emoji NFT Collection
        </h3>
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Connect your wallet to view your NFT collection
        </p>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-lime-400' : 'text-green-800'}`}>
          Your Emoji NFT Collection ({nfts.length})
        </h3>
        <button
          onClick={loadNFTs}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
          `}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading your NFTs...
          </p>
        </div>
      )}

      {error && (
        <div className={`
          p-4 rounded-lg text-center
          ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800'}
        `}>
          {error}
        </div>
      )}

      {!loading && !error && nfts.length === 0 && (
        <div className="text-center py-8">        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          You haven&apos;t minted any Emoji NFTs yet!
        </p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Create an emoji translation and mint it as an NFT to get started.
          </p>
        </div>
      )}

      {!loading && !error && nfts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className={cardClasses}>
              <div className="mb-3">
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-green-100 text-green-800'}
                `}>
                  #{nft.tokenId}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Original Text:
                </h4>
                <p className={`
                  text-sm p-2 rounded font-mono
                  ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'}
                `}>
                  &quot;{nft.originalText}&quot;
                </p>
              </div>

              <div className="mb-4">
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Emoji Translation:
                </h4>
                <div className={`
                  text-2xl p-3 rounded text-center
                  ${isDarkMode ? 'bg-gray-600' : 'bg-white'}
                `}>
                  {nft.emojiMessage}
                </div>
              </div>

              <div className="text-xs text-center">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Minted on {nft.mintDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiNFTGallery;
