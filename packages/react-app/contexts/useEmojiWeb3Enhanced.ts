import { useState } from "react";
import { 
    useAccount, 
    useWriteContract,
    useReadContract,
    useBalance,
    useWaitForTransactionReceipt,
    useSimulateContract
} from 'wagmi';
import EmojiNFTABI from "./emoji-nft-abi.json";
import { formatEther } from "viem";

// This will be updated after deployment - replace with your actual contract address
const EMOJI_NFT_CONTRACT = "0x0000000000000000000000000000000000000000" as `0x${string}`;

interface EmojiNFT {
  tokenId: string;
  tokenURI: string;
  originalText: string;
  emojiMessage: string;
  mintTimestamp: number;
  mintDate: Date;
}

export const useEmojiWeb3Enhanced = () => {
    const [mintingText, setMintingText] = useState<string>("");
    const [mintingEmoji, setMintingEmoji] = useState<string>("");
    
    // Wagmi hooks
    const { address, isConnected, isConnecting } = useAccount();
    
    // Get CELO balance
    const { data: balance } = useBalance({
        address: address,
    });

    // Get contract info
    const { data: mintPrice } = useReadContract({
        address: EMOJI_NFT_CONTRACT,
        abi: EmojiNFTABI,
        functionName: 'mintPrice',
        query: {
            enabled: EMOJI_NFT_CONTRACT !== "0x0000000000000000000000000000000000000000",
        }
    });

    const { data: totalSupply } = useReadContract({
        address: EMOJI_NFT_CONTRACT,
        abi: EmojiNFTABI,
        functionName: 'getTotalSupply',
        query: {
            enabled: EMOJI_NFT_CONTRACT !== "0x0000000000000000000000000000000000000000",
        }
    });

    const { data: maxSupply } = useReadContract({
        address: EMOJI_NFT_CONTRACT,
        abi: EmojiNFTABI,
        functionName: 'maxSupply',
        query: {
            enabled: EMOJI_NFT_CONTRACT !== "0x0000000000000000000000000000000000000000",
        }
    });

    // Get user's NFTs
    const { data: userNFTIds } = useReadContract({
        address: EMOJI_NFT_CONTRACT,
        abi: EmojiNFTABI,
        functionName: 'getNFTsByAddress',
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && EMOJI_NFT_CONTRACT !== "0x0000000000000000000000000000000000000000",
        }
    });

    // Simulate mint transaction
    const { data: simulateData, error: simulateError } = useSimulateContract({
        address: EMOJI_NFT_CONTRACT,
        abi: EmojiNFTABI,
        functionName: 'mintEmojiNFT',
        args: address && mintingText && mintingEmoji ? [address, mintingText, mintingEmoji] : undefined,
        value: mintPrice as bigint,
        query: {
            enabled: Boolean(
                address && 
                mintingText && 
                mintingEmoji && 
                mintPrice &&
                EMOJI_NFT_CONTRACT !== "0x0000000000000000000000000000000000000000"
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

    // Prepare mint function
    const prepareMint = (originalText: string, emojiMessage: string) => {
        setMintingText(originalText);
        setMintingEmoji(emojiMessage);
    };

    // Execute mint
    const executeMint = () => {
        if (writeContract && simulateData?.request) {
            writeContract(simulateData.request);
        }
    };

    // Get detailed NFT information
    const getNFTDetails = async (tokenIds: readonly bigint[]): Promise<EmojiNFT[]> => {
        if (!tokenIds || tokenIds.length === 0) return [];
        
        // Note: This would need to be implemented with multiple contract reads
        // For now, return basic structure
        return tokenIds.map((tokenId) => ({
            tokenId: tokenId.toString(),
            tokenURI: "", // Would need contract call
            originalText: "", // Would need contract call
            emojiMessage: "", // Would need contract call
            mintTimestamp: 0, // Would need contract call
            mintDate: new Date(), // Would need contract call
        }));
    };

    // Contract info object
    const contractInfo = {
        contractAddress: EMOJI_NFT_CONTRACT,
        mintPrice: mintPrice ? formatEther(mintPrice as bigint) : "0.001",
        totalSupply: totalSupply ? Number(totalSupply) : 0,
        maxSupply: maxSupply ? Number(maxSupply) : 10000,
        remainingSupply: maxSupply && totalSupply ? Number(maxSupply) - Number(totalSupply) : 10000,
        isDeployed: EMOJI_NFT_CONTRACT !== "0x0000000000000000000000000000000000000000",
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
        prepareMint,
        executeMint,
        isMinting,
        isMintSuccess,
        mintTxHash,
        
        // Errors
        error,
        
        // Utilities
        getNFTDetails,
    };
};
