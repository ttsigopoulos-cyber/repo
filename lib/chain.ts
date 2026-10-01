import "server-only";
import { createPublicClient, createWalletClient, http, isAddress, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { registryAbi } from "./abi";
import { appChain, CONTRACT_ADDRESS } from "./chainConfig";

// The relayer writes on behalf of participants, who need no wallet and pay no gas.
// Locally this is Hardhat account #1 (see README). Never put a real wallet key here.
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const RELAYER_KEY = process.env.RELAYER_PRIVATE_KEY as Hex | undefined;

export function chainConfigured(): boolean {
  return !!RELAYER_KEY && isAddress(CONTRACT_ADDRESS);
}

const publicClient = createPublicClient({ chain: appChain, transport: http(RPC_URL) });

function walletClient() {
  if (!RELAYER_KEY) throw new Error("RELAYER_PRIVATE_KEY fehlt");
  return createWalletClient({ account: privateKeyToAccount(RELAYER_KEY), chain: appChain, transport: http(RPC_URL) });
}

async function confirm(hash: Hex, label: string) {
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error(`Transaktion ${label} fehlgeschlagen`);
  return { txHash: hash, blockNumber: Number(receipt.blockNumber) };
}

export async function recordConsentOnChain(id: Hex, consentHash: Hex) {
  const hash = await walletClient().writeContract({
    address: CONTRACT_ADDRESS,
    abi: registryAbi,
    functionName: "recordConsent",
    args: [id, consentHash],
  });
  return confirm(hash, "recordConsent");
}

export async function sealOnChain(id: Hex, transcriptHash: Hex) {
  const hash = await walletClient().writeContract({
    address: CONTRACT_ADDRESS,
    abi: registryAbi,
    functionName: "sealInterview",
    args: [id, transcriptHash],
  });
  return confirm(hash, "sealInterview");
}

export async function withdrawOnChain(id: Hex) {
  const hash = await walletClient().writeContract({
    address: CONTRACT_ADDRESS,
    abi: registryAbi,
    functionName: "markWithdrawn",
    args: [id],
  });
  return confirm(hash, "markWithdrawn");
}

export async function readInterview(id: Hex) {
  const r = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: registryAbi,
    functionName: "getInterview",
    args: [id],
  });
  return {
    consentHash: r.consentHash,
    consentAt: Number(r.consentAt),
    transcriptHash: r.transcriptHash,
    sealedAt: Number(r.sealedAt),
    withdrawn: r.withdrawn,
  };
}

export async function reportAnchoredAt(reportHash: Hex): Promise<number> {
  const t = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: registryAbi,
    functionName: "reportAnchoredAt",
    args: [reportHash],
  });
  return Number(t);
}

export async function chainStats() {
  const [consents, sealed] = await Promise.all([
    publicClient.readContract({ address: CONTRACT_ADDRESS, abi: registryAbi, functionName: "consentCount" }),
    publicClient.readContract({ address: CONTRACT_ADDRESS, abi: registryAbi, functionName: "sealedCount" }),
  ]);
  return { consentCount: Number(consents), sealedCount: Number(sealed) };
}
