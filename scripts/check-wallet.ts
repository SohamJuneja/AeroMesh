import { createPublicClient, http, formatEther } from 'viem';
import { somniaTestnet } from '../lib/simulation';

const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

async function checkWallet() {
  const client = createPublicClient({
    chain: somniaTestnet,
    transport: http()
  });

  console.log('🔍 Checking wallet:', WALLET_ADDRESS);
  console.log('🔗 Explorer:', `https://shannon-explorer.somnia.network/address/${WALLET_ADDRESS}?tab=txs`);
  console.log('');

  // Get balance
  const balance = await client.getBalance({ address: WALLET_ADDRESS });
  console.log('💰 Balance:', formatEther(balance), 'STT');

  // Get transaction count (nonce)
  const txCount = await client.getTransactionCount({ address: WALLET_ADDRESS });
  console.log('📊 Transaction count (nonce):', txCount);

  console.log('');
  console.log('✅ Wallet is ready to publish drone events!');
}

checkWallet().catch(console.error);
