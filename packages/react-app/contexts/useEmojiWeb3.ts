import { useState } from "react";
import StableTokenABI from "./cusd-abi.json";
import MinipayNFTABI from "./minipay-nft.json";
import EmojiNFTABI from "./emoji-nft-abi.json";
import {
    createPublicClient,
    createWalletClient,
    custom,
    getContract,
    http,
    parseEther,
    stringToHex,
    formatEther,
} from "viem";
import { celoAlfajores } from "viem/chains";

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});

const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Testnet
const MINIPAY_NFT_CONTRACT = "0xE8F4699baba6C86DA9729b1B0a1DA1Bd4136eFeF"; // Testnet

// This will be updated after deployment
const EMOJI_NFT_CONTRACT = "0x0000000000000000000000000000000000000000"; // TO BE UPDATED AFTER DEPLOYMENT

export const useEmojiWeb3 = () => {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isMinting, setIsMinting] = useState(false);

    const getUserAddress = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            setIsConnecting(true);
            try {
                let walletClient = createWalletClient({
                    transport: custom(window.ethereum),
                    chain: celoAlfajores,
                });

                let [address] = await walletClient.getAddresses();
                setAddress(address);
                return address;
            } catch (error) {
                console.error("Error getting user address:", error);
                throw error;
            } finally {
                setIsConnecting(false);
            }
        } else {
            throw new Error("Web3 wallet not found");
        }
    };

    const connectWallet = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                return await getUserAddress();
            } catch (error) {
                console.error("Error connecting wallet:", error);
                throw error;
            }
        } else {
            throw new Error("Please install a Web3 wallet like MetaMask or Valora");
        }
    };

    const getBalance = async (walletAddress?: string) => {
        const targetAddress = walletAddress || address;
        if (!targetAddress) throw new Error("No address provided");

        const balance = await publicClient.getBalance({
            address: targetAddress as `0x${string}`,
        });

        return formatEther(balance);
    };

    const sendCUSD = async (to: string, amount: string) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const amountInWei = parseEther(amount);

        const tx = await walletClient.writeContract({
            address: cUSDTokenAddress,
            abi: StableTokenABI.abi,
            functionName: "transfer",
            account: address,
            args: [to, amountInWei],
        });

        let receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    };

    const mintEmojiNFT = async (originalText: string, emojiMessage: string) => {
        if (!address) {
            throw new Error("Please connect your wallet first");
        }

        if (EMOJI_NFT_CONTRACT === "0x0000000000000000000000000000000000000000") {
            throw new Error("EmojiNFT contract not deployed yet. Please deploy the contract first.");
        }

        setIsMinting(true);
        try {
            let walletClient = createWalletClient({
                transport: custom(window.ethereum),
                chain: celoAlfajores,
            });

            // Get the mint price from the contract
            const emojiNFTContract = getContract({
                abi: EmojiNFTABI,
                address: EMOJI_NFT_CONTRACT as `0x${string}`,
                client: publicClient,
            });

            const mintPrice = (await emojiNFTContract.read.mintPrice()) as bigint;

            const tx = await walletClient.writeContract({
                address: EMOJI_NFT_CONTRACT as `0x${string}`,
                abi: EmojiNFTABI,
                functionName: "mintEmojiNFT",
                account: address as `0x${string}`,
                args: [address, originalText, emojiMessage],
                value: mintPrice,
            });

            const receipt = await publicClient.waitForTransactionReceipt({
                hash: tx,
            });

            return receipt;
        } catch (error) {
            console.error("Error minting Emoji NFT:", error);
            throw error;
        } finally {
            setIsMinting(false);
        }
    };

    const getEmojiNFTs = async (walletAddress?: string) => {
        const targetAddress = walletAddress || address;
        if (!targetAddress) throw new Error("No address provided");

        if (EMOJI_NFT_CONTRACT === "0x0000000000000000000000000000000000000000") {
            return [];
        }

        try {
            const emojiNFTContract = getContract({
                abi: EmojiNFTABI,
                address: EMOJI_NFT_CONTRACT as `0x${string}`,
                client: publicClient,
            });

            const nftIds: any = await emojiNFTContract.read.getNFTsByAddress([
                targetAddress,
            ]);

            let nfts: any[] = [];

            for (let i = 0; i < nftIds.length; i++) {
                try {
                    const tokenId = nftIds[i];
                    const tokenURI: string = (await emojiNFTContract.read.tokenURI([
                        tokenId,
                    ])) as string;
                    const originalText: string = (await emojiNFTContract.read.getOriginalText([
                        tokenId,
                    ])) as string;
                    const emojiMessage: string = (await emojiNFTContract.read.getEmojiMessage([
                        tokenId,
                    ])) as string;
                    const mintTimestamp: bigint = (await emojiNFTContract.read.getMintTimestamp([
                        tokenId,
                    ])) as bigint;

                    nfts.push({
                        tokenId: tokenId.toString(),
                        tokenURI,
                        originalText,
                        emojiMessage,
                        mintTimestamp: Number(mintTimestamp),
                        mintDate: new Date(Number(mintTimestamp) * 1000),
                    });
                } catch (error) {
                    console.error(`Error fetching NFT ${nftIds[i]}:`, error);
                }
            }

            return nfts;
        } catch (error) {
            console.error("Error fetching Emoji NFTs:", error);
            return [];
        }
    };

    const getContractInfo = async () => {
        if (EMOJI_NFT_CONTRACT === "0x0000000000000000000000000000000000000000") {
            return null;
        }

        try {
            const emojiNFTContract = getContract({
                abi: EmojiNFTABI,
                address: EMOJI_NFT_CONTRACT as `0x${string}`,
                client: publicClient,
            });

            const mintPrice = (await emojiNFTContract.read.mintPrice()) as bigint;
            const maxSupply = (await emojiNFTContract.read.maxSupply()) as bigint;
            const totalSupply = (await emojiNFTContract.read.getTotalSupply()) as bigint;

            return {
                contractAddress: EMOJI_NFT_CONTRACT,
                mintPrice: formatEther(mintPrice),
                maxSupply: Number(maxSupply),
                totalSupply: Number(totalSupply),
                remainingSupply: Number(maxSupply) - Number(totalSupply),
            };
        } catch (error) {
            console.error("Error fetching contract info:", error);
            return null;
        }
    };

    const mintMinipayNFT = async () => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: MINIPAY_NFT_CONTRACT,
            abi: MinipayNFTABI.abi,
            functionName: "safeMint",
            account: address,
            args: [
                address,
                "https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/sections/2023/hero-top/products/minipay/minipay__desktop@2x.a17626ddb042.webp",
            ],
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    };

    const getNFTs = async () => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const minipayNFTContract = getContract({
            abi: MinipayNFTABI.abi,
            address: MINIPAY_NFT_CONTRACT,
            client: publicClient,
        });

        const [address] = await walletClient.getAddresses();
        const nfts: any = await minipayNFTContract.read.getNFTsByAddress([
            address,
        ]);

        let tokenURIs: string[] = [];

        for (let i = 0; i < nfts.length; i++) {
            const tokenURI: string = (await minipayNFTContract.read.tokenURI([
                nfts[i],
            ])) as string;
            tokenURIs.push(tokenURI);
        }
        return tokenURIs;
    };

    const signTransaction = async () => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const res = await walletClient.signMessage({
            account: address,
            message: stringToHex("Hello from Celo Emoji Translator!"),
        });

        return res;
    };

    return {
        address,
        isConnecting,
        isMinting,
        connectWallet,
        getUserAddress,
        getBalance,
        sendCUSD,
        mintEmojiNFT,
        getEmojiNFTs,
        getContractInfo,
        mintMinipayNFT,
        getNFTs,
        signTransaction,
    };
};
