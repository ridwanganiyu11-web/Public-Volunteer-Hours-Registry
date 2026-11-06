import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  QrCode,
  FileCheck2,
  ExternalLink,
  MapPin,
  Users,
  Sparkles,
} from 'lucide-react';
import { useVolunChain, VolunteerRecord } from '../context/VolunChainContext';
import { BOTCHAIN_METADATA } from '../config/web3';
import { CertificateModal } from '../components/CertificateModal';
import { QRModal } from '../components/QRModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { organizations, activities, records } = useVolunChain();
  const [searchInput, setSearchInput] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<VolunteerRecord | null>(null);
  const [qrModalData, setQrModalData] = useState<{
    title: string;
    subtitle: string;
    url: string;
  } | null>(null);

  const totalHoursRecorded = records.reduce((sum, r) => sum + r.hoursCompleted, 0);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    if (/^\d+$/.test(q)) {
      navigate(`/verify/${q}`);
    } else if (q.startsWith('0x')) {
      navigate(`/volunteer/${q}`);
    } else {
      navigate(`/verify/1`);
    }
  };

  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-14 border-b border-slate-800/80 bg-gradient-to-b from-emerald-950/25 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Public Volunteer Hours Registry • Powered by {BOTCHAIN_METADATA.name}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Every Hour Counts.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Every Contribution Matters.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                <strong>VolunChain</strong> is a blockchain-powered registry that allows charities,
                NGOs, schools, and community groups to permanently record completed volunteer hours
                on <strong>Botchain Testnet (Chain ID 968)</strong> — giving volunteers tamper-proof
                histories, shareable QR codes, and downloadable achievement certificates.
              </p>

              {/* Public Lookup Bar */}
              <form
                onSubmit={handleLookup}
                className="flex flex-col sm:flex-row gap-2.5 max-w-xl pt-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter Volunteer Wallet (0x...) or Record ID (e.g. 1)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition shrink-0"
                >
                  Verify Record <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/volunteer"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-sm inline-flex items-center gap-2 transition"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  Open Volunteer Dashboard
                </Link>
                <Link
                  to="/organization"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-sm inline-flex items-center gap-2 transition"
                >
                  <Building2 className="w-4 h-4" />
                  Organization Portal (Record Hours)
                </Link>
              </div>
            </div>

            {/* Right Column: Live Stats + Botchain Network Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                      On-Chain Registry Overview
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      VolunChain Live Metrics
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="text-xs text-slate-400">Total Verified Hours</div>
                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                      {totalHoursRecorded} hrs
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="text-xs text-slate-400">Verified Records</div>
                    <div className="text-2xl font-extrabold text-white mt-1">{records.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="text-xs text-slate-400">Volunteer Activities</div>
                    <div className="text-2xl font-extrabold text-teal-300 mt-1">
                      {activities.length}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="text-xs text-slate-400">Organizations</div>
                    <div className="text-2xl font-extrabold text-cyan-300 mt-1">
                      {organizations.length}
                    </div>
                  </div>
                </div>

                {/* Botchain Network Specs */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/50 to-slate-950 border border-emerald-500/20 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-emerald-300">
                    <span>Target Network Specification</span>
                    <a
                      href={BOTCHAIN_METADATA.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 underline hover:text-white"
                    >
                      scan.bohr.life <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-500">Chain ID:</span>{' '}
                      <strong className="text-white">{BOTCHAIN_METADATA.chainId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Native Token:</span>{' '}
                      <strong className="text-white">{BOTCHAIN_METADATA.nativeToken}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Total Supply:</span>{' '}
                      <strong className="text-white">{BOTCHAIN_METADATA.totalSupply}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">RPC:</span>{' '}
                      <code className="text-emerald-300">{BOTCHAIN_METADATA.rpcUrl}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How VolunChain Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Step-by-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              How VolunChain Works
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Volunteers never pay gas just to receive or view a record. Organizations pay testnet{' '}
            <strong>BOT</strong> gas when recording hours on-chain.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Organization Registers & Creates Activity',
              desc: 'An organization (e.g., Clean Our Community) connects its wallet and creates a volunteer activity on VolunChain.',
              badge: 'Org Wallet • BOT Gas',
            },
            {
              step: '02',
              title: 'Volunteer Participates in Community Work',
              desc: 'Volunteers contribute their time—cleaning a park, tutoring students, or planting trees in their community.',
              badge: 'Real-World Impact',
            },
            {
              step: '03',
              title: 'Organization Confirms & Records Hours',
              desc: 'Only the organization that created the activity can record completed hours for a volunteer wallet on Botchain.',
              badge: 'Option A Access Control',
            },
            {
              step: '04',
              title: 'Public Verification & Certificate',
              desc: 'Anyone can open the public verification link or scan the QR code to verify the contribution for free—no wallet needed.',
              badge: 'Free Public Read',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Step {item.step}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{item.badge}</span>
                </div>
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Verified Contributions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Blockchain Feed
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Recent Verified Volunteer Contributions
            </h2>
          </div>
          <Link
            to="/volunteer"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
          >
            View All in Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {records.slice(0, 6).map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-base">{rec.activityName}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Confirmed by{' '}
                    <Link
                      to={`/org/${rec.organization}`}
                      className="text-emerald-400 hover:underline"
                    >
                      {rec.organizationName}
                    </Link>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-extrabold text-sm">
                    <Clock className="w-3.5 h-3.5" /> {rec.hoursCompleted} volunteer{' '}
                    {rec.hoursCompleted === 1 ? 'hour' : 'hours'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="space-x-3">
                  <span>
                    Volunteer:{' '}
                    <Link
                      to={`/volunteer/${rec.volunteer}`}
                      className="text-slate-200 font-mono hover:text-emerald-300"
                    >
                      {rec.volunteerName} ({shortAddr(rec.volunteer)})
                    </Link>
                  </span>
                  <span>• {rec.dateRecorded}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCertificate(rec)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> Certificate
                  </button>
                  <button
                    onClick={() =>
                      setQrModalData({
                        title: `Verify Record #${rec.id} — ${rec.activityName}`,
                        subtitle: `${rec.hoursCompleted} volunteer hours confirmed by ${rec.organizationName}`,
                        url: `${window.location.origin}/verify/${rec.id}`,
                      })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
                  >
                    <QrCode className="w-3.5 h-3.5 text-teal-400" /> QR
                  </button>
                  <Link
                    to={`/verify/${rec.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold transition"
                  >
                    Verify #{rec.id}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer Activities & Registered Organizations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8">
        {/* Activities List */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Community Initiatives
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">Recent Volunteer Activities</h2>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Activity #{act.id}
                    </span>
                    <h3 className="font-bold text-white text-sm">{act.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400">{act.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                      <Building2 className="w-3 h-3" /> {act.organizationName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {act.location}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/org/${act.organization}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 shrink-0 self-start sm:self-center"
                >
                  View Org
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Organizations */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified Issuers
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">Registered Organizations</h2>
          </div>

          <div className="space-y-3">
            {organizations.map((org) => {
              const orgActs = activities.filter(
                (a) => a.organization.toLowerCase() === org.wallet.toLowerCase()
              );
              const orgRecs = records.filter(
                (r) => r.organization.toLowerCase() === org.wallet.toLowerCase()
              );
              return (
                <div
                  key={org.wallet}
                  className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                        {org.name}
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {shortAddr(org.wallet)}
                      </p>
                    </div>
                    <Link
                      to={`/org/${org.wallet}`}
                      className="text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      Profile →
                    </Link>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{org.description}</p>
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-teal-400" /> {orgActs.length} Activities
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> {orgRecs.length} Records
                      Confirmed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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

