import { useState } from "react";
import { 
    useAccount, 
    useWriteContract,
    useReadContract,
    useBalance,
    useWaitForTransactionReceipt,
    useSimulateContract
} from 'wagmi';
import { formatEther, parseEther } from "viem";

// ABI for the EmojiNFTWithIPFS contract
const EmojiNFTWithIPFS_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string", "name": "originalText", "type": "string"},
      {"internalType": "string", "name": "emojiMessage", "type": "string"},
      {"internalType": "string", "name": "ipfsURI", "type": "string"}
    ],
    "name": "mintEmojiNFTWithIPFS",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "getNFTsByAddress",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// This will be updated after deployment - replace with your actual IPFS contract address
const EMOJI_NFT_IPFS_CONTRACT = "0x0000000000000000000000000000000000000000" as `0x${string}`;

export const useEmojiIPFSMinter = () => {
    const [mintingData, setMintingData] = useState<{
        originalText: string;
        emojiMessage: string;
        ipfsURI: string;
    } | null>(null);
    
    // Wagmi hooks
    const { address, isConnected, isConnecting } = useAccount();
    
    // Get CELO balance
    const { data: balance } = useBalance({
        address: address,
    });

    // Get contract info
    const { data: mintPrice } = useReadContract({
        address: EMOJI_NFT_IPFS_CONTRACT,
        abi: EmojiNFTWithIPFS_ABI,
        functionName: 'mintPrice',
        query: {
            enabled: EMOJI_NFT_IPFS_CONTRACT !== "0x0000000000000000000000000000000000000000",
        }
    });

    const { data: totalSupply } = useReadContract({
        address: EMOJI_NFT_IPFS_CONTRACT,
        abi: EmojiNFTWithIPFS_ABI,
        functionName: 'getTotalSupply',
        query: {
            enabled: EMOJI_NFT_IPFS_CONTRACT !== "0x0000000000000000000000000000000000000000",
        }
    });

    const { data: maxSupply } = useReadContract({
        address: EMOJI_NFT_IPFS_CONTRACT,
        abi: EmojiNFTWithIPFS_ABI,
        functionName: 'maxSupply',
        query: {
            enabled: EMOJI_NFT_IPFS_CONTRACT !== "0x0000000000000000000000000000000000000000",
        }
    });

    // Get user's NFTs
    const { data: userNFTIds } = useReadContract({
        address: EMOJI_NFT_IPFS_CONTRACT,
        abi: EmojiNFTWithIPFS_ABI,
        functionName: 'getNFTsByAddress',
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && EMOJI_NFT_IPFS_CONTRACT !== "0x0000000000000000000000000000000000000000",
        }
    });

    // Simulate mint transaction
    const { data: simulateData, error: simulateError } = useSimulateContract({
        address: EMOJI_NFT_IPFS_CONTRACT,
        abi: EmojiNFTWithIPFS_ABI,
        functionName: 'mintEmojiNFTWithIPFS',
        args: address && mintingData ? [
            address, 
            mintingData.originalText, 
            mintingData.emojiMessage,
            mintingData.ipfsURI
        ] : undefined,
        value: mintPrice as bigint,
        query: {
            enabled: Boolean(
                address && 
                mintingData && 
                mintPrice &&
                EMOJI_NFT_IPFS_CONTRACT !== "0x0000000000000000000000000000000000000000"
            ),
        }
    });

    // Execute mint transaction
    const { 
        data: mintTxHash, 
        writeContract, 
        isPending: isMintLoading,
        error: mintError 
    } = useWriteContract();

    // Wait for transaction confirmation
    const { 
        isLoading: isWaitingForTransaction, 
        isSuccess: isMintSuccess,
        error: transactionError 
    } = useWaitForTransactionReceipt({
        hash: mintTxHash,
    });

    // Mint NFT with IPFS URI
    const mintNFTWithIPFS = async (
        originalText: string, 
        emojiMessage: string, 
        ipfsURI: string
    ): Promise<void> => {
        if (!address || !writeContract) {
            throw new Error('Wallet not connected');
        }

        // Set minting data for simulation
        setMintingData({ originalText, emojiMessage, ipfsURI });
        
        // Wait a bit for the simulation to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Execute the transaction
        if (simulateData?.request) {
            writeContract(simulateData.request);
        } else {
            // Fallback direct call
            writeContract({
                address: EMOJI_NFT_IPFS_CONTRACT,
                abi: EmojiNFTWithIPFS_ABI,
                functionName: 'mintEmojiNFTWithIPFS',
                args: [address, originalText, emojiMessage, ipfsURI],
                value: mintPrice as bigint || parseEther('0.001'),
            });
        }
    };

    // Contract info object
    const contractInfo = {
        contractAddress: EMOJI_NFT_IPFS_CONTRACT,
        mintPrice: mintPrice ? formatEther(mintPrice as bigint) : "0.001",
        totalSupply: totalSupply ? Number(totalSupply) : 0,
        maxSupply: maxSupply ? Number(maxSupply) : 10000,
        remainingSupply: maxSupply && totalSupply ? Number(maxSupply) - Number(totalSupply) : 10000,
        isDeployed: EMOJI_NFT_IPFS_CONTRACT !== "0x0000000000000000000000000000000000000000",
    };

    // Combined loading state
    const isMinting = isMintLoading || isWaitingForTransaction;

    // Combined error state
    const error = simulateError || mintError || transactionError;

    return {
        // Wallet info
        address,
        isConnected,
        isConnecting,
        balance: balance ? formatEther(balance.value) : "0",
        
        // Contract info
        contractInfo,
        
        // NFT data
        userNFTIds: userNFTIds as readonly bigint[] | undefined,
        
        // Minting
        mintNFTWithIPFS,
        isMinting,
        isMintSuccess,
        mintTxHash,
        
        // Errors
        error,
    };
};
