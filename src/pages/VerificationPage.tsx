import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Calendar,
  FileCheck2,
  Copy,
  Check,
  ExternalLink,
  Info,
  Search,
} from 'lucide-react';
import { useVolunChain } from '../context/VolunChainContext';
import { BOTCHAIN_METADATA } from '../config/web3';
import { CertificateModal } from '../components/CertificateModal';

export const VerificationPage: React.FC = () => {
  const { recordId } = useParams<{ recordId?: string }>();
  const navigate = useNavigate();
  const { records, activities } = useVolunChain();
  const [lookupId, setLookupId] = useState(recordId || '1');
  const [copied, setCopied] = useState(false);
  const [showCert, setShowCert] = useState(false);

  const numericId = Number(recordId || 1);
  const record = records.find((r) => r.id === numericId);
  const activity = record ? activities.find((a) => a.id === record.activityId) : undefined;

  const verificationUrl = `${window.location.origin}/verify/${numericId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupId.trim()) {
      navigate(`/verify/${lookupId.trim()}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Record Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-white">
            Public Blockchain Record Verification (No Wallet Required)
          </span>
        </div>

        <form onSubmit={handleSwitchRecord} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min="1"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Record ID"
              className="w-32 pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            Verify ID
          </button>
        </form>
      </div>

      {!record ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">
            Record #{numericId} Not Found on VolunChain
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No volunteer contribution record with ID #{numericId} exists yet. Try inspecting Record
            #1 through #{records.length}.
          </p>
          <Link
            to="/verify/1"
            className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            View Sample Record #1
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Verification Proof Card */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Verified Contribution Record #{record.id}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
                  {record.activityName}
                </h1>
                {activity && <p className="text-xs text-slate-400">{activity.description}</p>}
              </div>

              <div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <div className="text-2xl font-extrabold text-emerald-400">
                  {record.hoursCompleted} hrs
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-300">
                  Confirmed Hours
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> Volunteer
                </div>
                <div className="font-bold text-white text-sm">{record.volunteerName}</div>
                <Link
                  to={`/volunteer/${record.volunteer}`}
                  className="text-[11px] font-mono text-emerald-400 hover:underline break-all block"
                >
                  {record.volunteer}
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-400" /> Confirming Organization
                </div>
                <div className="font-bold text-white text-sm">{record.organizationName}</div>
                <Link
                  to={`/org/${record.organization}`}
                  className="text-[11px] font-mono text-teal-400 hover:underline break-all block"
                >
                  {record.organization}
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date Recorded
                </div>
                <div className="font-bold text-white text-sm">{record.dateRecorded}</div>
                <div className="text-[11px] text-slate-500">
                  Unix Timestamp: {record.timestamp}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Blockchain Network
                </div>
                <div className="font-bold text-white text-sm">
                  {BOTCHAIN_METADATA.name} (Chain ID {BOTCHAIN_METADATA.chainId})
                </div>
                <a
                  href={BOTCHAIN_METADATA.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  Explorer: scan.bohr.life <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {record.txHash && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-medium">Blockchain Record Reference:</span>
                <div className="font-mono text-slate-200 break-all text-[11px]">
                  {record.txHash}
                </div>
              </div>
            )}

            {/* Transparency & Limitation Note (from Spec Section 8) */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200/90">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Verification Transparency Note:</strong> This blockchain record cryptographically
                proves that the organization wallet{' '}
                <code className="text-amber-100">{record.organization.slice(0, 10)}...</code> (
                <strong>{record.organizationName}</strong>) confirmed and submitted{' '}
                <strong>{record.hoursCompleted} volunteer hours</strong> for this activity on
                VolunChain.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowCert(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/20"
              >
                <FileCheck2 className="w-4 h-4" />
                Generate Volunteer Achievement Certificate
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-300" />
                )}
                {copied ? 'Verification Link Copied!' : 'Copy Public Verification Link'}
              </button>
            </div>
          </div>

          {/* Right Column: QR Verification Card */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-between text-center space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Instant QR Verification
              </span>
              <h3 className="text-base font-bold text-white">Scan to Verify Contribution</h3>
              <p className="text-xs text-slate-400">
                Anyone can scan this QR code to verify Record #{record.id} without connecting a
                wallet.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <QRCodeSVG
                value={verificationUrl}
                size={190}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="H"
              />
            </div>

            <div className="w-full space-y-2 text-left text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 font-medium">Public URL:</div>
              <div className="font-mono text-[11px] text-emerald-300 break-all">
                {verificationUrl}
              </div>
            </div>
          </div>
        </div>
      )}

      <CertificateModal
        record={showCert && record ? record : null}
        onClose={() => setShowCert(false)}
      />
    </div>
  );
};

