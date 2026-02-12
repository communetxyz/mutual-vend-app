import { createConfig, http } from "wagmi"
import { sepolia } from "wagmi/chains"
import { metaMask, walletConnect, injected, coinbaseWallet } from "wagmi/connectors"

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    metaMask({
      dappMetadata: {
        name: "Mutual Vend",
        url: "https://mutualvend.com",
      },
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "549077143e5bfa40a6c5f280e0b0d13e",
      metadata: {
        name: "Mutual Vend",
        description: "Decentralized Vending Machine Network",
        url: "https://mutualvend.com",
        icons: ["https://mutualvend.com/icon.png"],
      },
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: "Mutual Vend",
      appLogoUrl: "https://mutualvend.com/icon.png",
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/Rr57Q41YGfkxYkx0kZp3EOQs86HatGGE"),
  },
  ssr: true,
})

// Contract addresses on Sepolia (Updated)
export const VENDING_MACHINE_ADDRESS = "0xffBe0620a4BFE0594ce6e9ce8b52C69Df04301eA" as `0x${string}`
export const VOTE_TOKEN_ADDRESS = "0xe93d2AD6Cd912939e72f3131c342E8018E395E11" as `0x${string}`
export const MOCK_USDC_ADDRESS = "0x1cF3abD8278F0453657AAD78208D0601bB186a62" as `0x${string}`

// Legacy addresses (for reference)
export const LOTTERY_ADDRESS = "0x02d163F84d473778bd648aFd612C6dA6Cb82dcd2" as `0x${string}`
export const ZK_VERIFICATION_ADDRESS = "0x3A2b9486C14e7CCF58CE195F8827d388758d2F9A" as `0x${string}`
export const CROWDFUNDING_ADDRESS = "0x424608c87ea32708c9156a21c72E18Ef49515F6b" as `0x${string}`

export const CHAIN_ID = 11155111 // Sepolia
export const NETWORK_NAME = "Sepolia"
