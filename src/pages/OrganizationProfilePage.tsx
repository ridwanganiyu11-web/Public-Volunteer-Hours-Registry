import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  MapPin,
  Clock,
  Award,
  FileCheck2,
  ArrowLeft,
} from 'lucide-react';
import { useVolunChain, VolunteerRecord } from '../context/VolunChainContext';
import { CertificateModal } from '../components/CertificateModal';

export const OrganizationProfilePage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const { organizations, activities, records } = useVolunChain();
  const [selectedCertificate, setSelectedCertificate] = useState<VolunteerRecord | null>(null);

  const org = organizations.find(
    (o) => o.wallet.toLowerCase() === (address || '').toLowerCase()
  );
  const orgActivities = activities.filter(
    (a) => a.organization.toLowerCase() === (address || '').toLowerCase()
  );
  const orgRecords = records.filter(
    (r) => r.organization.toLowerCase() === (address || '').toLowerCase()
  );
  const totalOrgHours = orgRecords.reduce((sum, r) => sum + r.hoursCompleted, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Registry Explorer
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Organization Profile
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {org ? org.name : 'Organization Profile'}
          </h1>
          {org && <p className="text-sm text-slate-300 max-w-2xl">{org.description}</p>}
          <p className="text-xs font-mono text-slate-400 break-all">
            Organization Wallet: <span className="text-emerald-300">{address}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xl font-extrabold text-emerald-400">{totalOrgHours}</div>
            <div className="text-[11px] text-slate-400">Hours Confirmed</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xl font-extrabold text-white">{orgActivities.length}</div>
            <div className="text-[11px] text-slate-400">Activities</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xl font-extrabold text-teal-300">{orgRecords.length}</div>
            <div className="text-[11px] text-slate-400">Records</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Activities Hosted */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-400" /> Volunteer Activities Hosted
          </h2>
          <div className="space-y-3">
            {orgActivities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                    Activity #{act.id}
                  </span>
                  <span className="text-slate-400 inline-flex items-center gap-1">
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
            <Award className="w-5 h-5 text-emerald-400" /> Confirmed Volunteer Hours
          </h2>
          <div className="space-y-3">
            {orgRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Record #{rec.id}
                    </span>
                    <h3 className="font-bold text-white text-sm">{rec.activityName}</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Volunteer:{' '}
                    <Link
                      to={`/volunteer/${rec.volunteer}`}
                      className="text-emerald-400 hover:underline font-mono"
                    >
                      {rec.volunteerName} ({rec.volunteer.slice(0, 8)}...)
                    </Link>{' '}
                    • {rec.dateRecorded}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {rec.hoursCompleted} hrs
                  </span>
                  <button
                    onClick={() => setSelectedCertificate(rec)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> Certificate
                  </button>
                  <Link
                    to={`/verify/${rec.id}`}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold"
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
    </div>
  );
};

