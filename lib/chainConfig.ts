import { defineChain, type Address } from "viem";

// Public values only (safe for the browser).
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 31337);
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as Address;
export const EXPLORER_TX_URL = process.env.NEXT_PUBLIC_EXPLORER_TX_URL || ""; // e.g. https://sepolia.etherscan.io/tx/

export const appChain = defineChain({
  id: CHAIN_ID,
  name: CHAIN_ID === 31337 ? "Hardhat Local" : `Chain ${CHAIN_ID}`,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  // Only used as a fallback label; the server uses RPC_URL, the browser uses MetaMask.
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
});

export const txLink = (hash?: string | null) => (hash && EXPLORER_TX_URL ? `${EXPLORER_TX_URL}${hash}` : null);
