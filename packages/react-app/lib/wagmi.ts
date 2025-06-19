import { http, createConfig } from 'wagmi'
import { celoAlfajores, celo } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = 'your-walletconnect-project-id' // Get from https://cloud.walletconnect.com

export const config = createConfig({
  chains: [celoAlfajores, celo],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
    safe(),
  ],
  transports: {
    [celoAlfajores.id]: http(),
    [celo.id]: http(),
  },
})
