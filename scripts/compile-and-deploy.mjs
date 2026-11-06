import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { createWalletClient, createPublicClient, http, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const contractPath = path.resolve('contracts/VolunteerHoursRegistry.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'VolunteerHoursRegistry.sol': {
      content: source,
    },
  },
  settings: {
    evmVersion: 'paris',
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

console.log('Compiling contracts/VolunteerHoursRegistry.sol (EVM target: paris)...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const fatalErrors = output.errors.filter((e) => e.severity === 'error');
  output.errors.forEach((err) => console.log(err.formattedMessage));
  if (fatalErrors.length > 0) {
    process.exit(1);
  }
}

const contractFile = output.contracts['VolunteerHoursRegistry.sol']['VolunteerHoursRegistry'];
const abi = contractFile.abi;
const bytecode = `0x${contractFile.evm.bytecode.object}`;

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync(
  'artifacts/VolunteerHoursRegistry.json',
  JSON.stringify({ abi, bytecode }, null, 2)
);
console.log('✓ Compiled VolunteerHoursRegistry.sol successfully! Artifact saved to artifacts/VolunteerHoursRegistry.json');

const rawKey = (process.env.DEPLOYER_PRIVATE_KEY || '').trim();
if (!rawKey || rawKey === '0x_your_wallet_private_key_here') {
  console.log('ℹ DEPLOYER_PRIVATE_KEY is not set in .env yet. Skipping live Botchain Testnet deployment.');
  process.exit(0);
}

const formattedKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;

const botchainTestnet = defineChain({
  id: 968,
  name: 'Botchain Testnet',
  nativeCurrency: { decimals: 18, name: 'BOT', symbol: 'BOT' },
  rpcUrls: {
    default: { http: [process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'] },
  },
  blockExplorers: {
    default: { name: 'Botchain Explorer', url: 'https://scan.bohr.life/' },
  },
});

async function deploy() {
  const account = privateKeyToAccount(formattedKey);
  console.log(`Deploying from account: ${account.address} to Botchain Testnet (Chain ID 968)...`);

  const publicClient = createPublicClient({
    chain: botchainTestnet,
    transport: http(process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'),
  });

  const walletClient = createWalletClient({
    account,
    chain: botchainTestnet,
    transport: http(process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'),
  });

  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [],
  });

  console.log(`Transaction broadcasted: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('---------------------------------------------------------');
  console.log(`✓ VolunteerHoursRegistry deployed to: ${receipt.contractAddress}`);
  console.log(`Explorer: https://scan.bohr.life/address/${receipt.contractAddress}`);
  console.log('---------------------------------------------------------');

  if (receipt.contractAddress && fs.existsSync('.env')) {
    let envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('VITE_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /VITE_CONTRACT_ADDRESS=.*/,
        `VITE_CONTRACT_ADDRESS=${receipt.contractAddress}`
      );
    } else {
      envContent += `\nVITE_CONTRACT_ADDRESS=${receipt.contractAddress}\n`;
    }
    fs.writeFileSync('.env', envContent);
    console.log('✓ Updated VITE_CONTRACT_ADDRESS in .env');
  }
}

deploy().catch((err) => {
  console.error('Deployment failed:', err.message || err);
  process.exit(1);
});
