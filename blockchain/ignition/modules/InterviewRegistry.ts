import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Deploys the registry with Hardhat account #0 as owner (the researcher's
// MetaMask account) and account #1 as the server-side relayer that records
// consent and seals interviews for participants who have no wallet.
export default buildModule("InterviewRegistryModule", (m) => {
  const relayer = m.getAccount(1);
  const registry = m.contract("InterviewRegistry", [relayer]);
  return { registry };
});
