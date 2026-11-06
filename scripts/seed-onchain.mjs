import fs from 'fs';
import { createWalletClient, createPublicClient, http, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const artifact = JSON.parse(fs.readFileSync('artifacts/VolunteerHoursRegistry.json', 'utf8'));
const abi = artifact.abi;
const contractAddress = process.env.VITE_CONTRACT_ADDRESS;
const rawKey = (process.env.DEPLOYER_PRIVATE_KEY || '').trim();
const formattedKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;

const botchainTestnet = defineChain({
  id: 968,
  name: 'Botchain Testnet',
  nativeCurrency: { decimals: 18, name: 'BOT', symbol: 'BOT' },
  rpcUrls: {
    default: { http: [process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'] },
  },
});

async function seedAndVerify() {
  const account = privateKeyToAccount(formattedKey);
  const publicClient = createPublicClient({
    chain: botchainTestnet,
    transport: http(process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'),
  });
  const walletClient = createWalletClient({
    account,
    chain: botchainTestnet,
    transport: http(process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'),
  });

  console.log(`Seeding live contract ${contractAddress} on Botchain Testnet (Chain ID 968)...`);

  // 1. Register Organization
  console.log('1. Calling registerOrganization("Clean Our Community", ...)...');
  const tx1 = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: 'registerOrganization',
    args: [
      'Clean Our Community',
      'Neighborhood sanitation, coastal plastic recovery, and urban park restoration on Botchain.',
    ],
  });
  await publicClient.waitForTransactionReceipt({ hash: tx1 });
  console.log(`   ✓ Organization registered (tx: ${tx1})`);

  // 2. Create Activity #1
  console.log('2. Calling createActivity("Community Cleanup", ...)...');
  const tx2 = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: 'createActivity',
    args: [
      'Community Cleanup',
      'Weekend district street & riverside waste collection and sorting exercise.',
      'Central Riverside Park',
    ],
  });
  await publicClient.waitForTransactionReceipt({ hash: tx2 });
  console.log(`   ✓ Activity #1 created (tx: ${tx2})`);

  // 3. Create Activity #2
  console.log('3. Calling createActivity("Free Education Support", ...)...');
  const tx3 = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: 'createActivity',
    args: [
      'Free Education Support',
      'After-school STEM mentoring, literacy workshops, and free education support for children.',
      'Community Library Hub',
    ],
  });
  await publicClient.waitForTransactionReceipt({ hash: tx3 });
  console.log(`   ✓ Activity #2 created (tx: ${tx3})`);

  // 4. Record Volunteer Hours for deployer address & sample volunteer address
  console.log('4. Calling recordVolunteerHours for Activity #1 (5 hours)...');
  const tx4 = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: 'recordVolunteerHours',
    args: [1n, account.address, 'Alex Rivera', 5n, '2026-11-06'],
  });
  await publicClient.waitForTransactionReceipt({ hash: tx4 });
  console.log(`   ✓ Recorded 5 volunteer hours (tx: ${tx4})`);

  console.log('5. Calling recordVolunteerHours for Activity #2 (3 hours)...');
  const tx5 = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: 'recordVolunteerHours',
    args: [2n, account.address, 'Alex Rivera', 3n, '2026-11-06'],
  });
  await publicClient.waitForTransactionReceipt({ hash: tx5 });
  console.log(`   ✓ Recorded 3 volunteer hours (tx: ${tx5})`);

  // 5. Verify on-chain reads
  const totalHours = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getVolunteerHours',
    args: [account.address],
  });
  const records = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getVolunteerRecords',
    args: [account.address],
  });

  console.log('---------------------------------------------------------');
  console.log(`✓ On-Chain Verification Complete!`);
  console.log(`  Volunteer (${account.address}) Total Hours: ${totalHours.toString()} hrs`);
  console.log(`  Total Records on Contract: ${records.length}`);
  console.log('---------------------------------------------------------');
}

seedAndVerify().catch((err) => {
  console.error('Seeding failed:', err.message || err);
  process.exit(1);
});

