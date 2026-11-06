import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter, queryClient, BOTCHAIN_METADATA } from './config/web3';
import { VolunChainProvider } from './context/VolunChainContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { OrganizationDashboard } from './pages/OrganizationDashboard';
import { VerificationPage } from './pages/VerificationPage';
import { OrganizationProfilePage } from './pages/OrganizationProfilePage';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <VolunChainProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/volunteer" element={<VolunteerDashboard />} />
                  <Route path="/volunteer/:address" element={<VolunteerDashboard />} />
                  <Route path="/organization" element={<OrganizationDashboard />} />
                  <Route path="/verify/:recordId" element={<VerificationPage />} />
                  <Route path="/org/:address" element={<OrganizationProfilePage />} />
                </Routes>
              </main>

              {/* Footer */}
              <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-xs text-slate-400 print:hidden">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white">VolunChain</span> — Every Hour Counts.
                      Every Contribution Matters.
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <span>
                      Network: <strong className="text-slate-200">{BOTCHAIN_METADATA.name}</strong>{' '}
                      (Chain ID: {BOTCHAIN_METADATA.chainId})
                    </span>
                    <span>
                      Token: <strong className="text-emerald-400">{BOTCHAIN_METADATA.nativeToken}</strong>
                    </span>
                    <a
                      href={BOTCHAIN_METADATA.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                    >
                      Explorer <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </VolunChainProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

