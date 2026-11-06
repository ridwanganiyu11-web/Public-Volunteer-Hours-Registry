import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import {
  Building2,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Share2,
  FileCheck2,
  Wallet,
  ShieldAlert,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import {
  useVolunChain,
  DEMO_ORG_CLEAN_WALLET,
  DEMO_ORG_YOUTH_WALLET,
  DEMO_ORG_GREEN_WALLET,
  DEMO_VOLUNTEER_WALLET,
  VolunteerRecord,
} from '../context/VolunChainContext';
import { CertificateModal } from '../components/CertificateModal';
import { QRModal } from '../components/QRModal';

export const OrganizationDashboard: React.FC = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const { open } = useAppKit();
  const {
    organizations,
    activities,
    records,
    activeOrgWallet,
    setDemoOrgWallet,
    registerOrganization,
    createActivity,
    recordVolunteerHours,
  } = useVolunChain();

  // Registration Form State
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');

  // Create Activity Form State
  const [actName, setActName] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actLocation, setActLocation] = useState('');

  // Record Hours Form State
  const [selectedActivityId, setSelectedActivityId] = useState<number>(0);
  const [volunteerAddress, setVolunteerAddress] = useState(DEMO_VOLUNTEER_WALLET);
  const [volunteerName, setVolunteerName] = useState('Alex Rivera');
  const [hoursCompleted, setHoursCompleted] = useState('5');
  const [dateRecorded, setDateRecorded] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Feedback Banner
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
    recordId?: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCertificate, setSelectedCertificate] = useState<VolunteerRecord | null>(null);
  const [qrModalData, setQrModalData] = useState<{
    title: string;
    subtitle: string;
    url: string;
  } | null>(null);

  const currentOrg = organizations.find(
    (o) => o.wallet.toLowerCase() === activeOrgWallet.toLowerCase()
  );

  // Option A: Only activities created by this organization can have hours recorded by this organization
  const myActivities = activities.filter(
    (a) => a.organization.toLowerCase() === activeOrgWallet.toLowerCase()
  );

  const myRecords = records.filter(
    (r) => r.organization.toLowerCase() === activeOrgWallet.toLowerCase()
  );

  const effectiveActivityId =
    selectedActivityId && myActivities.some((a) => a.id === selectedActivityId)
      ? selectedActivityId
      : myActivities[0]?.id || 0;

  const handleRegisterOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    if (!orgName.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter an organization name.' });
      return;
    }
    setSubmitting(true);
    try {
      await registerOrganization(orgName.trim(), orgDesc.trim());
      setStatusMsg({
        type: 'success',
        text: `Organization "${orgName.trim()}" registered on VolunChain!`,
      });
      setOrgName('');
      setOrgDesc('');
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.shortMessage || err?.message || 'Failed to register organization.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    if (!actName.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter an activity title.' });
      return;
    }
    setSubmitting(true);
    try {
      const newId = await createActivity(
        actName.trim(),
        actDesc.trim() || 'Community volunteer activity',
        actLocation.trim() || 'Community Center'
      );
      setSelectedActivityId(newId);
      setStatusMsg({
        type: 'success',
        text: `Volunteer activity "${actName.trim()}" (Activity #${newId}) created!`,
      });
      setActName('');
      setActDesc('');
      setActLocation('');
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.shortMessage || err?.message || 'Failed to create activity.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    const hrs = Number(hoursCompleted);
    if (!effectiveActivityId) {
      setStatusMsg({
        type: 'error',
        text: 'Please create or select one of your organization activities first.',
      });
      return;
    }
    if (!volunteerAddress.trim().startsWith('0x') || volunteerAddress.trim().length < 10) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter a valid volunteer wallet address (0x...).',
      });
      return;
    }
    if (!hrs || hrs <= 0) {
      setStatusMsg({
        type: 'error',
        text: 'Completed volunteer hours must be greater than 0.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const recordId = await recordVolunteerHours(
        effectiveActivityId,
        volunteerAddress.trim(),
        volunteerName.trim() || 'Verified Volunteer',
        hrs,
        dateRecorded
      );
      setStatusMsg({
        type: 'success',
        text: `Recorded ${hrs} volunteer hours for ${volunteerName || volunteerAddress} on Botchain!`,
        recordId,
      });
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.shortMessage || err?.message || 'Failed to record volunteer hours.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Active Org Selector */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Organization Portal • Option A Security
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {currentOrg ? currentOrg.name : 'Unregistered Organization Wallet'}
          </h1>
          <p className="text-xs font-mono text-slate-400 break-all">
            Active Organization Wallet: <span className="text-emerald-300">{activeOrgWallet}</span>
          </p>
        </div>

        {/* Switch Demo Org or Connect Wallet */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {isConnected
              ? 'Connected via Wallet'
              : 'Test as Registered Organization (or Connect Wallet):'}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isConnected && (
              <>
                <button
                  onClick={() => setDemoOrgWallet(DEMO_ORG_CLEAN_WALLET)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    activeOrgWallet.toLowerCase() === DEMO_ORG_CLEAN_WALLET.toLowerCase()
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Clean Our Community
                </button>
                <button
                  onClick={() => setDemoOrgWallet(DEMO_ORG_YOUTH_WALLET)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    activeOrgWallet.toLowerCase() === DEMO_ORG_YOUTH_WALLET.toLowerCase()
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Youth Learning Foundation
                </button>
                <button
                  onClick={() => setDemoOrgWallet(DEMO_ORG_GREEN_WALLET)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    activeOrgWallet.toLowerCase() === DEMO_ORG_GREEN_WALLET.toLowerCase()
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  EcoCanopy Initiative
                </button>
              </>
            )}
            <button
              onClick={() => open()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
            >
              <Wallet className="w-3.5 h-3.5" />
              {isConnected && connectedAddress ? 'Wallet Settings' : 'Connect Org Wallet'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Notification */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5 text-sm font-medium">
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          {statusMsg.recordId && (
            <Link
              to={`/verify/${statusMsg.recordId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shrink-0"
            >
              Open Public Verification Link #{statusMsg.recordId}{' '}
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* 3 Action Columns: 1. Register Org, 2. Create Activity, 3. Record Volunteer Hours */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Step 1: Register / Update Organization */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 text-emerald-400">
                1. registerOrganization()
              </span>
              {currentOrg && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                </span>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                {currentOrg ? 'Update Organization Profile' : 'Register Organization'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Register your charity, NGO, school, or community group on Botchain Testnet.
              </p>
            </div>

            <form id="register-org-form" onSubmit={handleRegisterOrg} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder={currentOrg?.name || 'e.g., Clean Our Community'}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mission / Description
                </label>
                <textarea
                  rows={3}
                  value={orgDesc}
                  onChange={(e) => setOrgDesc(e.target.value)}
                  placeholder={
                    currentOrg?.description ||
                    'Brief description of your volunteer initiatives and community mission...'
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
              >
                {currentOrg ? 'Update Organization Name' : 'Register Organization on Botchain'}
              </button>
            </form>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
            Currently active as:{' '}
            <strong className="text-emerald-300">
              {currentOrg ? currentOrg.name : 'Unregistered Wallet'}
            </strong>
          </div>
        </div>

        {/* Step 2: Create Volunteer Activity */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 text-teal-400">
                2. createActivity()
              </span>
              <span className="text-xs text-slate-400">{myActivities.length} active</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Create Volunteer Activity</h2>
              <p className="text-xs text-slate-400 mt-1">
                Create an official event or campaign that volunteers can participate in.
              </p>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Activity Name *
                </label>
                <input
                  type="text"
                  value={actName}
                  onChange={(e) => setActName(e.target.value)}
                  placeholder="e.g., Community Cleanup"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Activity Description
                </label>
                <textarea
                  rows={2}
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  placeholder="What did volunteers do during this exercise?"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={actLocation}
                  onChange={(e) => setActLocation(e.target.value)}
                  placeholder="e.g., Central Riverside Park"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !currentOrg}
                className="w-full py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-500/30 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition disabled:opacity-40"
              >
                <PlusCircle className="w-4 h-4" /> Create Activity
              </button>
            </form>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
            Only registered organizations can create activities.
          </div>
        </div>

        {/* Step 3: Record Volunteer Hours */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-900 border border-emerald-500/30 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                3. recordVolunteerHours()
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">Pays BOT Gas</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Record Completed Hours</h2>
              <p className="text-xs text-slate-300 mt-1">
                Confirm a volunteer&apos;s completed hours and mint a permanent record on Botchain.
              </p>
            </div>

            <form onSubmit={handleRecordHours} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Select Your Organization&apos;s Activity *
                </label>
                <select
                  value={effectiveActivityId}
                  onChange={(e) => setSelectedActivityId(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {myActivities.map((act) => (
                    <option key={act.id} value={act.id}>
                      #{act.id} — {act.name} ({act.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Volunteer Wallet Address *
                </label>
                <input
                  type="text"
                  value={volunteerAddress}
                  onChange={(e) => setVolunteerAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Volunteer Name
                  </label>
                  <input
                    type="text"
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Completed Hours *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={hoursCompleted}
                    onChange={(e) => setHoursCompleted(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Date Recorded
                </label>
                <input
                  type="date"
                  value={dateRecorded}
                  onChange={(e) => setDateRecorded(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || myActivities.length === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition disabled:opacity-40"
              >
                Confirm & Record Volunteer Hours on Botchain
              </button>
            </form>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/20 flex items-start gap-2 text-[11px] text-slate-300">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Smart Contract Rule:</strong> Only the organization wallet that created an
              activity can record hours for it.
            </span>
          </div>
        </div>
      </div>

      {/* Organization's Created Activities & Recorded Contributions */}
      <div className="grid lg:grid-cols-12 gap-8 pt-4">
        {/* Created Activities */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-400" />
            {currentOrg?.name || 'Organization'}&apos;s Activities ({myActivities.length})
          </h2>

          <div className="space-y-3">
            {myActivities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                    Activity #{act.id}
                  </span>
                  <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {act.location}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{act.name}</h3>
                <p className="text-xs text-slate-400">{act.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmed Volunteer Records */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Confirmed Volunteer Records ({myRecords.length})
          </h2>

          <div className="space-y-3">
            {myRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Record #{rec.id}
                    </span>
                    <h3 className="font-bold text-white text-sm">{rec.activityName}</h3>
                    <span className="text-xs font-bold text-emerald-400">
                      • {rec.hoursCompleted} hrs
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Volunteer: {rec.volunteerName} ({rec.volunteer.slice(0, 8)}...
                    {rec.volunteer.slice(-6)}) • {rec.dateRecorded}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedCertificate(rec)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> Certificate
                  </button>
                  <button
                    onClick={() =>
                      setQrModalData({
                        title: `Share Verification Link — Record #${rec.id}`,
                        subtitle: `Public verification link for ${rec.volunteerName}'s ${rec.hoursCompleted} volunteer hours.`,
                        url: `${window.location.origin}/verify/${rec.id}`,
                      })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium"
                  >
                    <Share2 className="w-3.5 h-3.5 text-teal-400" /> Share Link
                  </button>
                  <Link
                    to={`/verify/${rec.id}`}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold"
                  >
                    Verify
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
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

