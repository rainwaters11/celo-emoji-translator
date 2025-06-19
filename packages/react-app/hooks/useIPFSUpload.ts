import { useState } from 'react';
import { NFTStorage, File } from 'nft.storage';

// Get API key from environment - you'll need to get this from https://nft.storage
const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQzN0Y0M0I2ZDNEOTY3NDE4MDYyNDhGNkJFYzMwN0REOGU3RTUzZWQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MjUzNTQxNjI4OSwibmFtZSI6ImNlbG8tZW1vamktbmZ0In0.3YzQhR5uNOplKKU8kz5fHkZSTbJGAD8QXxLSxX8M5YA';

export interface EmojiNFTMetadata {
  name: string;
  description: string;
  image: File; // Changed to File for nft.storage
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  emoji_data: {
    original_text: string;
    emoji_translation: string;
    creator_address: string;
    creation_date: string;
  };
}

export const useIPFSUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Generate canvas image from emoji translation
  const generateEmojiCanvas = async (
    originalText: string,
    emojiMessage: string,
    isDarkMode: boolean = false
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Set canvas size
      canvas.width = 800;
      canvas.height = 800;
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (isDarkMode) {
        gradient.addColorStop(0, '#1f2937'); // gray-800
        gradient.addColorStop(1, '#111827'); // gray-900
      } else {
        gradient.addColorStop(0, '#10b981'); // green-500
        gradient.addColorStop(1, '#059669'); // green-600
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // White content area
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.roundRect(50, 50, canvas.width - 100, canvas.height - 100, 25);
      ctx.fill();
      
      // Title
      ctx.fillStyle = isDarkMode ? '#10b981' : '#059669';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Celo Emoji NFT', canvas.width / 2, 150);
      
      // Original text
      ctx.fillStyle = '#374151';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('Original Text:', canvas.width / 2, 220);
      
      // Text background
      ctx.fillStyle = '#f3f4f6';
      ctx.roundRect(100, 240, canvas.width - 200, 80, 10);
      ctx.fill();
      
      // Original text content
      ctx.fillStyle = '#1f2937';
      ctx.font = '28px monospace';
      const truncatedText = originalText.length > 50 ? originalText.substring(0, 47) + '...' : originalText;
      ctx.fillText(`"${truncatedText}"`, canvas.width / 2, 290);
      
      // Emoji translation label
      ctx.fillStyle = '#374151';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('Emoji Translation:', canvas.width / 2, 380);
      
      // Emoji content area
      ctx.fillStyle = '#ffffff';
      ctx.roundRect(100, 400, canvas.width - 200, 280, 10);
      ctx.fill();
      
      // Emoji text
      ctx.font = '72px Arial, sans-serif';
      ctx.textAlign = 'center';
      const lines = emojiMessage.match(/.{1,10}/g) || [emojiMessage];
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 480 + (index * 80));
      });
      
      // Footer
      ctx.fillStyle = '#6b7280';
      ctx.font = '18px monospace';
      ctx.fillText('Minted on Celo Blockchain', canvas.width / 2, 750);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png', 0.9);
    });
  };

  // Upload to IPFS using nft.storage
  const uploadToIPFS = async (
    originalText: string,
    emojiMessage: string,
    creatorAddress: string,
    isDarkMode: boolean = false
  ): Promise<string> => {
    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      if (!NFT_STORAGE_TOKEN) {
        throw new Error('NFT Storage API key not configured');
      }

      const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      
      setUploadProgress(25);
      
      // Generate image
      const imageBlob = await generateEmojiCanvas(originalText, emojiMessage, isDarkMode);
      const imageFile = new File([imageBlob], 'emoji-nft.png', { type: 'image/png' });
      
      setUploadProgress(50);
      
      // Create metadata
      const metadata: EmojiNFTMetadata = {
        name: `Celo Emoji #${Date.now()}`,
        description: `A unique emoji translation created on Celo blockchain. Original text: "${originalText}" transformed into: "${emojiMessage}"`,
        image: imageFile,
        attributes: [
          {
            trait_type: 'Original Text',
            value: originalText,
          },
          {
            trait_type: 'Emoji Translation',
            value: emojiMessage,
          },
          {
            trait_type: 'Text Length',
            value: originalText.length,
          },
          {
            trait_type: 'Emoji Count',
            value: emojiMessage.length,
          },
          {
            trait_type: 'Theme',
            value: isDarkMode ? 'Dark' : 'Light',
          },
        ],
        emoji_data: {
          original_text: originalText,
          emoji_translation: emojiMessage,
          creator_address: creatorAddress,
          creation_date: new Date().toISOString(),
        },
      };
      
      setUploadProgress(75);
      
      // Upload to IPFS
      const token = await client.store(metadata);
      
      setUploadProgress(100);
      
      // Return the IPFS URL
      const ipfsUrl = `https://${token.ipnft}.ipfs.nftstorage.link/metadata.json`;
      
      return ipfsUrl;
      
    } catch (error) {
      console.error('IPFS upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // Upload image only (for preview purposes)
  const uploadImageOnly = async (
    originalText: string,
    emojiMessage: string,
    isDarkMode: boolean = false
  ): Promise<string> => {
    try {
      if (!NFT_STORAGE_TOKEN) {
        throw new Error('NFT Storage API key not configured');
      }

      const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      
      // Generate image
      const imageBlob = await generateEmojiCanvas(originalText, emojiMessage, isDarkMode);
      
      // Upload just the image
      const imageCid = await client.storeBlob(imageBlob);
      
      return `https://${imageCid}.ipfs.nftstorage.link`;
      
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  // Helper to check if we can upload
  const canUpload = (): boolean => {
    return !!NFT_STORAGE_TOKEN && !uploading;
  };

  return {
    uploadToIPFS,
    uploadImageOnly,
    uploading,
    uploadProgress,
    uploadError,
    canUpload,
    generateEmojiCanvas,
  };
};
