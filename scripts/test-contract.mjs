import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createPublicClient, http, defineChain } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const artifact = JSON.parse(fs.readFileSync('artifacts/VolunteerHoursRegistry.json', 'utf8'));
const abi = artifact.abi;
const contractAddress =
  process.env.VITE_CONTRACT_ADDRESS || '0xa00c2081a1e6a5bec9302fc85b11a5f5bd9aa56c';

const botchainTestnet = defineChain({
  id: 968,
  name: 'Botchain Testnet',
  nativeCurrency: { decimals: 18, name: 'BOT', symbol: 'BOT' },
  rpcUrls: {
    default: { http: [process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'] },
  },
});

const publicClient = createPublicClient({
  chain: botchainTestnet,
  transport: http(process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'),
});

async function runTests() {
  console.log('=========================================================');
  console.log('VolunChain Automated Contract Test Suite (Botchain 968)');
  console.log(`Target Contract: ${contractAddress}`);
  console.log('=========================================================\n');

  // Test 1: Verify organizations list
  console.log('Test 1: getAllOrganizations() returns registered organizations...');
  const orgs = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getAllOrganizations',
  });
  assert.ok(orgs.length >= 1, 'Expected at least 1 registered organization');
  assert.equal(orgs[0].name, 'Clean Our Community');
  assert.equal(orgs[0].isRegistered, true);
  console.log(`  ✓ Passed (${orgs.length} organization(s) registered: "${orgs[0].name}")\n`);

  // Test 2: Verify activities list and getActivity(1)
  console.log('Test 2: getAllActivities() & getActivity(1) return created activities...');
  const activities = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getAllActivities',
  });
  assert.ok(activities.length >= 2, 'Expected at least 2 activities');
  const act1 = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getActivity',
    args: [1n],
  });
  assert.equal(act1.name, 'Community Cleanup');
  assert.equal(act1.organizationName, 'Clean Our Community');
  console.log(`  ✓ Passed (Activity #1: "${act1.name}" by ${act1.organizationName})\n`);

  // Test 3: Verify volunteer records & total hours calculation
  const volunteerWallet = orgs[0].wallet;
  console.log(`Test 3: getVolunteerHours() & getVolunteerRecords() for ${volunteerWallet}...`);
  const totalHours = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getVolunteerHours',
    args: [volunteerWallet],
  });
  const volunteerRecords = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getVolunteerRecords',
    args: [volunteerWallet],
  });
  assert.ok(totalHours >= 8n, `Expected at least 8 total hours, got ${totalHours}`);
  assert.ok(volunteerRecords.length >= 2, 'Expected at least 2 verified records');
  console.log(
    `  ✓ Passed (Total Hours: ${totalHours.toString()} hrs across ${volunteerRecords.length} records)\n`
  );

  // Test 4: Option A Security Check — Unauthorized wallet cannot record hours
  console.log(
    'Test 4: Access Control (Option A) — Random wallet cannot record hours for Activity #1...'
  );
  const randomAccount = privateKeyToAccount(generatePrivateKey());
  let revertedAsExpected = false;
  try {
    await publicClient.simulateContract({
      account: randomAccount.address,
      address: contractAddress,
      abi,
      functionName: 'recordVolunteerHours',
      args: [1n, randomAccount.address, 'Unauthorized User', 100n, '2026-11-06'],
    });
  } catch (err) {
    revertedAsExpected = true;
  }
  assert.equal(
    revertedAsExpected,
    true,
    'Expected recordVolunteerHours from random wallet to revert'
  );
  console.log('  ✓ Passed (Unauthorized wallet call reverted as expected)\n');

  console.log('=========================================================');
  console.log('✓ ALL 4 SMART CONTRACT TESTS PASSED ON BOTCHAIN TESTNET!');
  console.log('=========================================================');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
