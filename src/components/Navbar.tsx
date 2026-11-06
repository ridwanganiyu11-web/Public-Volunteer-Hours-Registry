import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import {
  ShieldCheck,
  Award,
  Building2,
  UserCheck,
  Search,
  Wallet,
  Settings,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useVolunChain } from '../context/VolunChainContext';
import { BOTCHAIN_METADATA } from '../config/web3';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { contractAddress, setContractAddress, isLiveContract, resetDemoData } = useVolunChain();
  const [showSettings, setShowSettings] = useState(false);
  const [tempContract, setTempContract] = useState(contractAddress);

  const navItems = [
    { path: '/', label: 'Home & Explore', icon: Search },
    { path: '/volunteer', label: 'Volunteer Dashboard', icon: Award },
    { path: '/organization', label: 'Organization Portal', icon: Building2 },
    { path: '/verify/1', label: 'Public Verification', icon: UserCheck },
  ];

  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    setContractAddress(tempContract);
    setShowSettings(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Top Botchain Testnet Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-b border-emerald-500/20 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {BOTCHAIN_METADATA.name} (Chain ID: {BOTCHAIN_METADATA.chainId})
            </span>
            <span className="hidden md:inline text-slate-400">
              Token: <strong className="text-slate-200">{BOTCHAIN_METADATA.nativeToken}</strong> • Supply: {BOTCHAIN_METADATA.totalSupply} • RPC: <code className="text-emerald-300">{BOTCHAIN_METADATA.rpcUrl}</code>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-slate-400">
              {isLiveContract ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live Contract: {shortAddr(contractAddress)}
                </span>
              ) : (
                <span className="text-amber-300/90 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Botchain Sandbox + Live Wallet Ready
                </span>
              )}
            </span>
            <button
              onClick={() => {
                setTempContract(contractAddress);
                setShowSettings(!showSettings);
              }}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white underline decoration-slate-600 underline-offset-2"
            >
              <Settings className="w-3.5 h-3.5" /> Contract Config
            </button>
            <a
              href={BOTCHAIN_METADATA.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Explorer <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Contract Settings Drawer */}
      {showSettings && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
          <form
            onSubmit={handleSaveContract}
            className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Deployed <code className="text-emerald-400">VolunteerHoursRegistry.sol</code> Address on Botchain Testnet (Chain ID 968)
              </label>
              <input
                type="text"
                value={tempContract}
                onChange={(e) => setTempContract(e.target.value)}
                placeholder="0x... (Leave blank to use pre-loaded interactive Botchain sandbox records)"
                className="w-full px-3 py-1.5 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-4">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                Save Mode
              </button>
              <button
                type="button"
                onClick={resetDemoData}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Reset Sample Data
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white">
                Volun<span className="text-emerald-400">Chain</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                BOT 968
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Every Hour Counts. Every Contribution Matters.
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path.split('/1')[0]);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => open()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition"
          >
            <Wallet className="w-4 h-4" />
            {isConnected && address ? shortAddr(address) : 'Connect Wallet'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/80 px-4 py-2 gap-2 bg-slate-950">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path.split('/1')[0]);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

