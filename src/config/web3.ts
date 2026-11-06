import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { defineChain } from 'viem';
import { QueryClient } from '@tanstack/react-query';

/**
 * Botchain Testnet definition
 * Chain ID: 968
 * RPC: https://rpc.bohr.life
 * Native Token: BOT (Total Supply: 150 Million)
 * Explorer: https://scan.bohr.life/
 */
export const botchainTestnet = defineChain({
  id: 968,
  name: 'Botchain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BOT',
    symbol: 'BOT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bohr.life'],
    },
    public: {
      http: ['https://rpc.bohr.life'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Botchain Explorer',
      url: 'https://scan.bohr.life/',
    },
  },
  testnet: true,
});

export const BOTCHAIN_METADATA = {
  chainId: 968,
  name: 'Botchain Testnet',
  rpcUrl: 'https://rpc.bohr.life',
  nativeToken: 'BOT',
  totalSupply: '150 Million',
  explorerUrl: 'https://scan.bohr.life/',
};

// Reown AppKit project ID (uses env variable or public fallback ID for local dev/testing)
export const projectId =
  import.meta.env.VITE_REOWN_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694';

export const networks = [botchainTestnet] as [typeof botchainTestnet];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

export const queryClient = new QueryClient();

// Initialize Reown AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: botchainTestnet,
  projectId,
  metadata: {
    name: 'VolunChain — Public Volunteer Hours Registry',
    description: 'Every Hour Counts. Every Contribution Matters. Blockchain-verified volunteer hours on Botchain Testnet.',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://volunchain.org',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
  },
  features: {
    analytics: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#10b981',
    '--w3m-border-radius-master': '2px',
  },
});

