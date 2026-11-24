import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { ethers } from "ethers";

async function checkEvm() {
  console.log("===========================================================================");
  console.log("  [1/2] EVM WALLET CHECK (BASE SEPOLIA · EIP-155:84532)");
  console.log("===========================================================================");

  const rawKey = process.env.AGENT_PRIVATE_KEY || process.env.PRIVATE_KEY;
  if (!rawKey) {
    console.log("  ⚠ No EVM private key found in .env (AGENT_PRIVATE_KEY or PRIVATE_KEY).");
    console.log("    To configure:");
    console.log("    1. Generate an EVM key or export from MetaMask / Coinbase Wallet.");
    console.log("    2. Add to .env: AGENT_PRIVATE_KEY=0x...");
    return;
  }

  const cleanKey = rawKey.trim().replace(/['"]/g, "");
  const formattedKey = cleanKey.startsWith("0x") ? cleanKey : "0x" + cleanKey;

  try {
    const wallet = new ethers.Wallet(formattedKey);
    console.log("  ✓ Status:                 CONFIGURED & VALID");
    console.log("  ✓ EVM Public Address:     " + wallet.address);

    const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
    const usdcContract = new ethers.Contract(
      usdcAddress,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );

    try {
      const [ethBal, usdcBal] = await Promise.all([
        provider.getBalance(wallet.address),
        usdcContract.balanceOf(wallet.address),
      ]);
      const ethFormatted = ethers.formatEther(ethBal);
      const usdcFormatted = (Number(usdcBal) / 1e6).toFixed(2);

      console.log(`  ✓ Base Sepolia ETH:       ${ethFormatted} ETH`);
      console.log(`  ✓ Base Sepolia USDC:      ${usdcFormatted} USDC (Contract: ${usdcAddress})`);

      if (Number(usdcBal) === 0) {
        console.log("\n  ℹ HOW TO FUND BASE SEPOLIA USDC:");
        console.log(`    1. Open Circle Testnet Faucet: https://faucet.circle.com/`);
        console.log(`    2. Select 'Base Sepolia' in the Network dropdown.`);
        console.log(`    3. Paste your EVM address: ${wallet.address}`);
        console.log(`    4. Click 'Send 10 USDC'.`);
      }
      if (Number(ethBal) === 0) {
        console.log("\n  ℹ HOW TO FUND BASE SEPOLIA ETH (GAS):");
        console.log(`    1. Superchain Faucet: https://console.optimism.io/faucet`);
        console.log(`    2. QuickNode Faucet: https://faucet.quicknode.com/base/sepolia`);
        console.log(`    3. Paste your address: ${wallet.address}`);
        console.log(`    Note: Telegraph x402 on Base is gasless (facilitator pays gas), but ~0.005 ETH is good practice.`);
      }
    } catch (rpcErr: any) {
      console.log("  ⚠ Base Sepolia RPC notice: " + rpcErr.message);
    }
  } catch (err: any) {
    console.log("  ✕ Invalid EVM key format: " + err.message);
  }
}

async function checkSolana() {
  console.log("\n===========================================================================");
  console.log("  [2/2] SOLANA WALLET CHECK (SOLANA DEVNET · CAIP-2: solana:EtWTRABZaYq...)");
  console.log("===========================================================================");

  const solKey = process.env.SOLANA_PRIVATE_KEY?.trim();
  if (!solKey) {
    console.log("  ⚠ No Solana private key found in .env (SOLANA_PRIVATE_KEY).");
    console.log("    To configure:");
    console.log("    1. Generate a Solana keypair or export base58 private key from Phantom/Solflare.");
    console.log("    2. Add to .env: SOLANA_PRIVATE_KEY=<base58_key_or_byte_array>");
    console.log("\n    Quick keypair generator:");
    console.log("    npx tsx -e \"import { createKeyPairSignerFromBytes } from '@solana/kit'; import { base58 } from '@scure/base'; (async () => { const key = crypto.getRandomValues(new Uint8Array(32)); console.log('SOLANA_PRIVATE_KEY=' + base58.encode(key)); })()\"");
    return;
  }

  try {
    const { base58 } = await import("@scure/base");
    const { createKeyPairSignerFromBytes } = await import("@solana/kit");

    let bytes: Uint8Array;
    if (solKey.startsWith("[")) {
      bytes = new Uint8Array(JSON.parse(solKey));
    } else {
      bytes = base58.decode(solKey);
    }

    const signer = await createKeyPairSignerFromBytes(bytes);
    const solanaAddress = signer.address;
    console.log("  ✓ Status:                 CONFIGURED & VALID");
    console.log("  ✓ Solana Public Address:  " + solanaAddress);

    // Query Devnet RPC for SOL balance
    const rpcUrl = "https://api.devnet.solana.com";
    try {
      const solRes = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [solanaAddress],
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (solRes.ok) {
        const solData = await solRes.json();
        const lamports = solData.result?.value ?? 0;
        const solBal = (lamports / 1e9).toFixed(4);
        console.log(`  ✓ Solana Devnet SOL:      ${solBal} SOL`);

        if (lamports === 0) {
          console.log("\n  ℹ HOW TO FUND SOLANA DEVNET SOL (AIRDROP):");
          console.log(`    • Web Faucet:          https://faucet.solana.com/`);
          console.log(`    • QuickNode Faucet:    https://faucet.quicknode.com/solana/devnet`);
          console.log(`    • CLI Command:         solana airdrop 1 ${solanaAddress} --url devnet`);
          console.log(`    • Paste address:       ${solanaAddress}`);
        }
      }
    } catch (e: any) {
      console.log("  ⚠ Solana SOL balance query note: " + e.message);
    }

    // Query Devnet RPC for Circle USDC balance (SPL token 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU)
    const usdcMint = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    try {
      const tokenRes = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "getTokenAccountsByOwner",
          params: [
            solanaAddress,
            { mint: usdcMint },
            { encoding: "jsonParsed" },
          ],
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const accounts = tokenData.result?.value || [];
        let totalUsdc = 0;
        for (const acc of accounts) {
          totalUsdc += Number(acc.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || "0");
        }
        console.log(`  ✓ Solana Devnet USDC:     ${totalUsdc.toFixed(2)} USDC (Mint: ${usdcMint})`);

        if (totalUsdc === 0) {
          console.log("\n  ℹ HOW TO FUND SOLANA DEVNET USDC:");
          console.log(`    1. Open Circle Testnet Faucet: https://faucet.circle.com/`);
          console.log(`    2. Select 'Solana Devnet' in the Network dropdown.`);
          console.log(`    3. Paste your Solana address: ${solanaAddress}`);
          console.log(`    4. Click 'Send 10 USDC'.`);
          console.log(`    Note: The Telegraph node sponsors caller fee-payer for x402, so you only need Devnet USDC!`);
        }
      }
    } catch (e: any) {
      console.log("  ⚠ Solana USDC balance query note: " + e.message);
    }
  } catch (err: any) {
    console.log("  ✕ Invalid Solana key format: " + err.message);
  }
}

async function main() {
  await checkEvm();
  await checkSolana();
  console.log("\n===========================================================================");
  console.log("  All wallet checks completed.");
  console.log("===========================================================================\n");
}

main().catch(console.error);
