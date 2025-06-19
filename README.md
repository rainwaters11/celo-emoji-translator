# ✨ Celo Emoji Translator

A fun, mobile-first dApp built for the Celo ecosystem that transforms your text messages into quirky, Celo-themed emoji sequences—and now lets you **mint your translations as NFTs on Celo** and **share them inside Farcaster**!

---

## ✨ About the Project

The **Celo Emoji Translator** is a playful decentralized application (dApp) built with Celo’s mobile-first philosophy in mind, specifically optimized for **MiniPay**. It allows users to type any message and instantly see it “translated” into a vibrant string of emojis inspired by the Celo blockchain’s eco-friendly and community-forward ethos — think 🌳, 💰, ✨, and 📱.

---


### ✅ **NFT Minting on Celo (Alfajores Testnet)**
Turn your emoji creations into unique digital collectibles using smart contracts deployed to the Celo blockchain.

- Uploads emoji images + metadata to IPFS via NFT.Storage
- On-chain minting via ERC-721 contract using Wagmi + Viem
- Fully integrated with Celo wallets like Valora and Celo Wallet

###  **Farcaster MiniApp Integration**
Your emoji minting app is now discoverable and embeddable inside Farcaster (Warpcast).

- 📁 `.well-known/farcaster.json` configured
- 🧹 Shareable inside Warpcast like a native experience
- 🌐 Hosted on Vercel for instant sharing

---

## Core Features

- **Real-time Emoji Translation** – See your text transformed instantly
- **Celo-Themed Emojis** – Special mappings for Celo terms like `celo` and `minipay`
- **Mobile-First Design** – Tailored for MiniPay and Celo mobile apps using Tailwind CSS
- **Copy to Clipboard** – Easily share your emoji creations
- **Mint as NFT** – Turn your favorite translations into on-chain artwork
- **Farcaster-Ready** – App is optimized for social casting and MiniApp discovery

---

## 🛠Technologies Used

- **React** – Dynamic frontend
- **Next.js** – Framework via Celo Composer
- **Tailwind CSS** – Utility-first responsive design
- **Celo Composer** – Project scaffolding
- **Wagmi + Viem** – Wallet integration and smart contract interaction
- **Hardhat** – Smart contract development
- **NFT.Storage** – IPFS image + metadata storage
- **Farcaster MiniApp** – `.well-known` meta setup

---

## Getting Started (Local Development)

Want to remix this or contribute to the emoji fun? Here's how to run it locally.

### Prerequisites

- Node.js (v20+)
- Git (v2.38+)
- VS Code (or your preferred editor)

---

###  Installation

Clone the repo:
```bash
git clone https://github.com/rainwaters11/celo-emoji-translator.git
cd celo-emoji-translator
```

Navigate to the React app (this is a monorepo):
```bash
cd packages/react-app
```

Rename the environment file:
```bash
mv .env.template .env
# On Windows:
# rename .env.template .env
```

Install dependencies:
```bash
npm install
# or
yarn install
```

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Your app will be accessible at:
```
http://localhost:3000
```
(or `http://localhost:5173` depending on Vite setup)

---

## 📱 Deployment + Farcaster

Once deployed to Vercel:
- Visit: `https://your-app.vercel.app/.well-known/farcaster.json`
- Validate with the [Farcaster MiniApp Validator](https://farcaster-miniapp.vercel.app)
- Share the Vercel link in a Warpcast post to embed the app natively!



Built with ❤️ by [@mistyrain11](https://github.com/rainwaters11)
