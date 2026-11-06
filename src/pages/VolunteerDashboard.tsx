import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import {
  Award,
  Clock,
  Building2,
  CheckCircle2,
  QrCode,
  FileCheck2,
  Share2,
  Wallet,
  Search,
  Calendar,
  ExternalLink,
  Layers,
} from 'lucide-react';
import {
  useVolunChain,
  DEMO_VOLUNTEER_WALLET,
  VolunteerRecord,
} from '../context/VolunChainContext';
import { CertificateModal } from '../components/CertificateModal';
import { QRModal } from '../components/QRModal';

export const VolunteerDashboard: React.FC = () => {
  const { address: paramAddress } = useParams<{ address?: string }>();
  const { address: connectedAddress, isConnected } = useAccount();
  const { open } = useAppKit();
  const { records } = useVolunChain();

  const [customLookup, setCustomLookup] = useState('');
  const [activeWallet, setActiveWallet] = useState<string>(
    paramAddress || connectedAddress || DEMO_VOLUNTEER_WALLET
  );
  const [selectedCertificate, setSelectedCertificate] = useState<VolunteerRecord | null>(null);
  const [qrModalData, setQrModalData] = useState<{
    title: string;
    subtitle: string;
    url: string;
  } | null>(null);

  const displayedWallet = paramAddress || activeWallet;

  const volunteerRecords = records.filter(
    (r) => r.volunteer.toLowerCase() === displayedWallet.toLowerCase()
  );

  const totalHours = volunteerRecords.reduce((sum, r) => sum + r.hoursCompleted, 0);
  const uniqueActivities = new Set(volunteerRecords.map((r) => r.activityId)).size;
  const uniqueOrganizations = new Set(
    volunteerRecords.map((r) => r.organization.toLowerCase())
  ).size;
  const verifiedCount = volunteerRecords.length;

  const volunteerName =
    volunteerRecords.find((r) => r.volunteerName)?.volunteerName || 'Community Volunteer';

  const profileShareUrl = `${window.location.origin}/volunteer/${displayedWallet}`;

  const handleWalletSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLookup.trim()) {
      setActiveWallet(customLookup.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Wallet Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Volunteer Dashboard
            </span>
            {displayedWallet.toLowerCase() === DEMO_VOLUNTEER_WALLET.toLowerCase() && (
              <span className="text-xs text-slate-400">
                (Sample Volunteer Profile — {volunteerName})
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {volunteerName}&apos;s Contribution History
          </h1>
          <p className="text-xs font-mono text-slate-400 break-all">
            Wallet: <span className="text-emerald-300">{displayedWallet}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isConnected && connectedAddress && (
            <button
              onClick={() => setActiveWallet(connectedAddress)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                displayedWallet.toLowerCase() === connectedAddress.toLowerCase()
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              My Connected Wallet
            </button>
          )}

          <button
            onClick={() => setActiveWallet(DEMO_VOLUNTEER_WALLET)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              displayedWallet.toLowerCase() === DEMO_VOLUNTEER_WALLET.toLowerCase()
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Sample Volunteer (48 hrs)
          </button>

          <button
            onClick={() =>
              setQrModalData({
                title: 'Share Public Volunteer Profile',
                subtitle: `Anyone can scan this QR code or open the link to view ${volunteerName}'s verified volunteer hours without connecting a wallet.`,
                url: profileShareUrl,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            Share Profile & QR
          </button>

          {!isConnected && (
            <button
              onClick={() => open()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
            >
              <Wallet className="w-3.5 h-3.5" /> Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Inspect Any Volunteer Wallet Bar */}
      <form
        onSubmit={handleWalletSearch}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customLookup}
            onChange={(e) => setCustomLookup(e.target.value)}
            placeholder="Inspect any volunteer wallet address (0x...) — No wallet connection required"
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold transition"
        >
          Lookup Volunteer
        </button>
      </form>

      {/* 4 KPI Stat Cards (Matching Spec: Total hours 48, Activities 8, Organizations 3, Verified records 8) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total hours</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-extrabold text-white">{totalHours}</div>
          <p className="text-[11px] text-emerald-400 font-medium">
            Cumulative verified volunteer hours
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Activities</span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-4xl font-extrabold text-white">{uniqueActivities}</div>
          <p className="text-[11px] text-slate-400">Community projects participated in</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Organizations</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-extrabold text-white">{uniqueOrganizations}</div>
          <p className="text-[11px] text-slate-400">Confirming charities & NGOs</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Verified records</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-extrabold text-emerald-400">{verifiedCount}</div>
          <p className="text-[11px] text-slate-400">Permanent Botchain records</p>
        </div>
      </div>

      {/* Recent Contributions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent contributions</h2>
          <span className="text-xs text-slate-400">
            Showing {volunteerRecords.length} verified blockchain{' '}
            {volunteerRecords.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {volunteerRecords.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              No Volunteer Hours Recorded Yet for This Wallet
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Once a registered organization confirms and submits your completed volunteer hours on
              the Organization Portal, your permanent records and certificates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {volunteerRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 hover:border-emerald-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Record #{rec.id}
                    </span>
                    <h3 className="text-lg font-bold text-white">{rec.activityName}</h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <Link
                      to={`/org/${rec.organization}`}
                      className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 hover:underline"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      {rec.organizationName}
                    </Link>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> {rec.dateRecorded}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      Issuer: {rec.organization.slice(0, 8)}...{rec.organization.slice(-6)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 md:justify-end">
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-extrabold text-sm mr-2">
                    {rec.hoursCompleted} volunteer {rec.hoursCompleted === 1 ? 'hour' : 'hours'}
                  </div>

                  <button
                    onClick={() => setSelectedCertificate(rec)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Certificate
                  </button>

                  <button
                    onClick={() =>
                      setQrModalData({
                        title: `Verification QR — Record #${rec.id}`,
                        subtitle: `${rec.activityName} (${rec.hoursCompleted} volunteer hours) confirmed by ${rec.organizationName}`,
                        url: `${window.location.origin}/verify/${rec.id}`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                  >
                    <QrCode className="w-4 h-4 text-teal-400" />
                    QR Code
                  </button>

                  <Link
                    to={`/verify/${rec.id}`}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs border border-slate-700 transition"
                  >
                    Verify Link <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CertificateModal
        record={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      {qrModalData && (
        <QRModal
          title={qrModalData.title}
          subtitle={qrModalData.subtitle}
          url={qrModalData.url}
          onClose={() => setQrModalData(null)}
        />
      )}
    </div>
  );
};

