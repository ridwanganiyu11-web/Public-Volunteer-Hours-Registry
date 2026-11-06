import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Award, Printer, X, ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react';
import { VolunteerRecord } from '../context/VolunChainContext';
import { BOTCHAIN_METADATA } from '../config/web3';

interface CertificateModalProps {
  record: VolunteerRecord | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const verificationUrl = `${window.location.origin}/verify/${record.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              Volunteer Achievement Certificate — Record #{record.id}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-10 bg-slate-900">
          <div
            id="printable-certificate"
            className="relative bg-white text-slate-900 rounded-xl p-8 sm:p-12 border-[10px] border-double border-emerald-700 shadow-xl"
          >
            {/* Corner Decorative Accents */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-emerald-700/20 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                    VolunChain Registry
                  </h2>
                  <p className="text-xs font-medium text-emerald-700">
                    Every Hour Counts. Every Contribution Matters.
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified on {BOTCHAIN_METADATA.name}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Chain ID: {BOTCHAIN_METADATA.chainId} • Record #{record.id}
                </p>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="py-8 text-center space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
                Certificate of Volunteer Achievement
              </p>

              <p className="text-sm text-slate-600 italic font-serif">
                This permanent blockchain certificate is proudly presented to
              </p>

              <div className="py-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-wide">
                  {record.volunteerName || 'Verified Community Volunteer'}
                </h1>
                <p className="text-xs font-mono text-slate-500 mt-1.5 break-all">
                  Volunteer Wallet: {record.volunteer}
                </p>
              </div>

              <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                in recognition of completing{' '}
                <strong className="text-emerald-800 font-extrabold text-base">
                  {record.hoursCompleted} Volunteer {record.hoursCompleted === 1 ? 'Hour' : 'Hours'}
                </strong>{' '}
                for the activity
              </p>

              <div className="inline-block px-6 py-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="text-xl font-bold text-emerald-950">{record.activityName}</div>
                <div className="text-xs text-emerald-700 font-medium mt-0.5">
                  Confirmed by: <strong>{record.organizationName}</strong>
                </div>
              </div>
            </div>

            {/* Footer with Metadata + QR Code */}
            <div className="pt-6 border-t-2 border-emerald-700/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-xs text-slate-600 flex-1">
                <div>
                  <span className="font-bold text-slate-800">Confirming Organization:</span>{' '}
                  {record.organizationName}
                </div>
                <div className="font-mono text-[11px] text-slate-500 break-all">
                  Org Wallet: {record.organization}
                </div>
                <div>
                  <span className="font-bold text-slate-800">Date Recorded:</span>{' '}
                  {record.dateRecorded}
                </div>
                <div className="font-mono text-[11px] text-slate-500 break-all">
                  Blockchain Reference: Record #{record.id}{' '}
                  {record.txHash ? `(${record.txHash.slice(0, 18)}...)` : ''}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Public Verification Link:{' '}
                  <a
                    href={verificationUrl}
                    className="text-emerald-700 underline inline-flex items-center gap-0.5"
                  >
                    {verificationUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <QRCodeSVG
                  value={verificationUrl}
                  size={96}
                  bgColor="#ffffff"
                  fgColor="#064e3b"
                  level="M"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1.5">
                  Scan to Verify
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

