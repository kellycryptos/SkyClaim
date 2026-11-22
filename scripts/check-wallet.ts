import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { ethers } from "ethers";

const rawKey = process.env.PRIVATE_KEY || process.env.AGENT_PRIVATE_KEY;

if (!rawKey) {
  console.log("STATUS: NO_KEY_IN_ENV");
  process.exit(0);
}

const cleanKey = rawKey.trim().replace(/['"]/g, "");
const formattedKey = cleanKey.startsWith("0x") ? cleanKey : "0x" + cleanKey;

try {
  const wallet = new ethers.Wallet(formattedKey);
  console.log("STATUS: WALLET_VALID");
  console.log("Public Address:           ", wallet.address);

  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const usdcContract = new ethers.Contract(
    usdcAddress,
    ["function balanceOf(address) view returns (uint256)"],
    provider
  );

  async function check() {
    try {
      const [ethBal, usdcBal] = await Promise.all([
        provider.getBalance(wallet.address),
        usdcContract.balanceOf(wallet.address),
      ]);
      console.log("Base Sepolia ETH Balance: ", ethers.formatEther(ethBal), "ETH");
      console.log("Base Sepolia USDC Balance:", (Number(usdcBal) / 1e6).toFixed(2), "USDC");
    } catch (e: any) {
      console.log("RPC query note:           ", e.message);
    }
  }

  check();
} catch (e: any) {
  console.log("STATUS: INVALID_KEY_FORMAT -", e.message);
}
