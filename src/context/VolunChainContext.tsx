import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import { isAddress } from 'viem';
import { VOLUNTEER_HOURS_REGISTRY_ABI } from '../contracts/VolunteerHoursRegistryABI';
import { botchainTestnet } from '../config/web3';

export interface Organization {
  wallet: string;
  name: string;
  description: string;
  registeredAt: number;
  isRegistered: boolean;
}

export interface Activity {
  id: number;
  organization: string;
  organizationName: string;
  name: string;
  description: string;
  location: string;
  createdAt: number;
}

export interface VolunteerRecord {
  id: number;
  activityId: number;
  organization: string;
  organizationName: string;
  activityName: string;
  volunteer: string;
  volunteerName: string;
  hoursCompleted: number;
  dateRecorded: string;
  timestamp: number;
  txHash?: string;
}

export const DEMO_VOLUNTEER_WALLET = '0x5E889b72A1464489e7df124280Ee4A5c11b039B3';
export const DEMO_ORG_CLEAN_WALLET = '0x5E889b72A1464489e7df124280Ee4A5c11b039B3';
export const DEMO_ORG_YOUTH_WALLET = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
export const DEMO_ORG_GREEN_WALLET = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65';
export const DEFAULT_DEPLOYED_CONTRACT = '0xa00c2081a1e6a5bec9302fc85b11a5f5bd9aa56c';

const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    wallet: DEMO_ORG_CLEAN_WALLET,
    name: 'Clean Our Community',
    description: 'Neighborhood sanitation, coastal plastic recovery, and urban park restoration.',
    registeredAt: 1728000000,
    isRegistered: true,
  },
  {
    wallet: DEMO_ORG_YOUTH_WALLET,
    name: 'Youth Learning Foundation',
    description: 'After-school STEM mentoring, literacy workshops, and free education support for children.',
    registeredAt: 1728500000,
    isRegistered: true,
  },
  {
    wallet: DEMO_ORG_GREEN_WALLET,
    name: 'EcoCanopy Initiative',
    description: 'Community reforestation, tree planting campaigns, and climate resilience education.',
    registeredAt: 1729000000,
    isRegistered: true,
  },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 1,
    organization: DEMO_ORG_CLEAN_WALLET,
    organizationName: 'Clean Our Community',
    name: 'Community Cleanup',
    description: 'Weekend district street & riverside waste collection and sorting exercise.',
    location: 'Central Riverside Park',
    createdAt: 1730000000,
  },
  {
    id: 2,
    organization: DEMO_ORG_YOUTH_WALLET,
    organizationName: 'Youth Learning Foundation',
    name: 'Free Education Support',
    description: 'Tutoring primary and secondary students in mathematics and reading comprehension.',
    location: 'Community Library Hub',
    createdAt: 1730100000,
  },
  {
    id: 3,
    organization: DEMO_ORG_GREEN_WALLET,
    organizationName: 'EcoCanopy Initiative',
    name: 'Urban Tree Planting Campaign',
    description: 'Planting 250 native saplings along the eastern greenway corridor.',
    location: 'Eastern Greenway Belt',
    createdAt: 1730200000,
  },
  {
    id: 4,
    organization: DEMO_ORG_CLEAN_WALLET,
    organizationName: 'Clean Our Community',
    name: 'Harbor Shoreline Plastic Recovery',
    description: 'Removing marine litter and cataloging recyclable plastics along the shoreline.',
    location: 'North Bay Shoreline',
    createdAt: 1730300000,
  },
  {
    id: 5,
    organization: DEMO_ORG_YOUTH_WALLET,
    organizationName: 'Youth Learning Foundation',
    name: 'Coding & Digital Skills Bootcamp',
    description: 'Hands-on computer literacy and beginner programming workshop for teens.',
    location: 'Youth Innovation Lab',
    createdAt: 1730400000,
  },
  {
    id: 6,
    organization: DEMO_ORG_GREEN_WALLET,
    organizationName: 'EcoCanopy Initiative',
    name: 'Community Compost & Urban Garden Setup',
    description: 'Building raised vegetable beds and training residents on organic composting.',
    location: 'Westside Community Garden',
    createdAt: 1730500000,
  },
  {
    id: 7,
    organization: DEMO_ORG_CLEAN_WALLET,
    organizationName: 'Clean Our Community',
    name: 'Neighborhood Recycling Drive',
    description: 'Door-to-door e-waste and household recyclable collection campaign.',
    location: 'Oakwood Civic Square',
    createdAt: 1730600000,
  },
  {
    id: 8,
    organization: DEMO_ORG_YOUTH_WALLET,
    organizationName: 'Youth Learning Foundation',
    name: 'Weekend Science Fair Mentoring',
    description: 'Guiding student teams on renewable energy and biology science fair projects.',
    location: 'City High Gymnasium',
    createdAt: 1730700000,
  },
];

// Total hours for DEMO_VOLUNTEER_WALLET = 5 + 3 + 8 + 6 + 7 + 6 + 5 + 8 = 48 hours across 8 activities & 3 organizations
const INITIAL_RECORDS: VolunteerRecord[] = [
  {
    id: 1,
    activityId: 1,
    organization: DEMO_ORG_CLEAN_WALLET,
    organizationName: 'Clean Our Community',
    activityName: 'Community Cleanup',
    volunteer: DEMO_VOLUNTEER_WALLET,
    volunteerName: 'Alex Rivera',
    hoursCompleted: 5,
    dateRecorded: '2026-11-05',
    timestamp: 1730800000,
    txHash: '0x8a9d41e3c72059f0249d130a4e8f77e12c09b31854a02c7d9182f641c09e12a4',
  },
  {
    id: 2,
    activityId: 2,
    organization: DEMO_ORG_YOUTH_WALLET,
    organizationName: 'Youth Learning Foundation',
    activityName: 'Free Education Support',
    volunteer: DEMO_VOLUNTEER_WALLET,
    volunteerName: 'Alex Rivera',
    hoursCompleted: 3,
    dateRecorded: '2026-11-03',
    timestamp: 1730650000,
    txHash: '0x4f12b9a8d6e35c10772e941b8a5c309e7d21f4820a6c3158e9b4a712d53c8801',
  },
  {
    id: 3,
    activityId: 3,
    organization: DEMO_ORG_GREEN_WALLET,
    organizationName: 'EcoCanopy Initiative',
    activityName: 'Urban Tree Planting Campaign',
    volunteer: DEMO_VOLUNTEER_WALLET,
    volunteerName: 'Alex Rivera',
    hoursCompleted: 8,
    dateRecorded: '2026-10-29',
    timestamp: 1730220000,
    txHash: '0x2c77e19b304f8a6d512098c4b73e1092a6d45f8c3012b7e94a15d608c3b29f10',
  },
  {
    id: 4,
    activityId: 4,
    organization: DEMO_ORG_CLEAN_WALLET,
    organizationName: 'Clean Our Community',
    activityName: 'Harbor Shoreline Plastic Recovery',
    volunteer: DEMO_VOLUNTEER_WALLET,
    volunteerName: 'Alex Rivera',
    hoursCompleted: 6,
    dateRecorded: '2026-10-24',
    timestamp: 1729790000,
    txHash: '0x9e31a45c8b207f6d19304e82c7b15a90d6e43f1280c5b9a73e14d602f8a17c55',
  },
  {
    id: 5,
    activityId: 5,
    organization: DEMO_ORG_YOUTH_WALLET,
    organizationName: 'Youth Learning Foundation',
    activityName: 'Coding & Digital Skills Bootcamp',
    volunteer: DEMO_VOLUNTEER_WALLET,
    volunteerName: 'Alex Rivera',
    hoursCompleted: 7,
    dateRecorded: '2026-10-18',
    timestamp: 1729270000,
    txHash: '0x6b20d84f19a37c5e28401b93d7e26a10c5f48b2190d6e3a84c15f702b9d34e11',
  },
  {
    id: 6,
    activityId: 6,
    organization: DEMO_ORG_GREEN_WALLET,
    organizationName: 'EcoCanopy Initiative',
    activityName: 'Community Compost & Urban Garden Setup',
    volunteer: DEMO_VOLUNTEER_WALLET,
    volunteerName: 'Alex Rivera',
    hoursCompleted: 6,
    dateRecorded: '2026-10-12',
    timestamp: 1728750000,
    txHash: '0x1d84c92a7f306b5e49102c83e6a17b90f4d52c3180e7a2b95d16f803c4e25a99',
  },
  {
    id: 7,
    activityId: 7,
    organization: DEMO_ORG_CLEAN_WALLET,
    organizationName: 'Clean Our Community',
    activityName: 'Neighborhood Recycling Drive',
    volunteer: DEMO_VOLUNTEER_WALLET,
    volunteerName: 'Alex Rivera',
    hoursCompleted: 5,
    dateRecorded: '2026-10-06',
    timestamp: 1728230000,
    txHash: '0x5a73e18b9c402d6f38201a94c8b25d10e6f39a4270b8c1d96e24f501a3b78d22',
  },
  {
    id: 8,
    activityId: 8,
    organization: DEMO_ORG_YOUTH_WALLET,
    organizationName: 'Youth Learning Foundation',
    activityName: 'Weekend Science Fair Mentoring',
    volunteer: DEMO_VOLUNTEER_WALLET,
    volunteerName: 'Alex Rivera',
    hoursCompleted: 8,
    dateRecorded: '2026-09-28',
    timestamp: 1727540000,
    txHash: '0x7c92f31a8d504e6b29103c75d9a16e20f7b48c5360a9d2e87f35a602b4c89e44',
  },
];

interface VolunChainContextType {
  organizations: Organization[];
  activities: Activity[];
  records: VolunteerRecord[];
  contractAddress: string;
  setContractAddress: (addr: string) => void;
  isLiveContract: boolean;
  isLoading: boolean;
  activeOrgWallet: string;
  setDemoOrgWallet: (addr: string) => void;
  registerOrganization: (name: string, description: string) => Promise<void>;
  createActivity: (name: string, description: string, location: string) => Promise<number>;
  recordVolunteerHours: (
    activityId: number,
    volunteer: string,
    volunteerName: string,
    hoursCompleted: number,
    dateRecorded: string
  ) => Promise<number>;
  refreshOnChainData: () => Promise<void>;
  resetDemoData: () => void;
}

const VolunChainContext = createContext<VolunChainContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ORGS: 'volunchain_orgs_v1',
  ACTS: 'volunchain_activities_v1',
  RECS: 'volunchain_records_v1',
  CONTRACT: 'volunchain_contract_addr_v1',
};

export const VolunChainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address: connectedAddress } = useAccount();
  const publicClient = usePublicClient({ chainId: botchainTestnet.id });
  const { writeContractAsync } = useWriteContract();

  const [contractAddress, setContractAddressState] = useState<string>(() => {
    return (
      localStorage.getItem(STORAGE_KEYS.CONTRACT) ??
      import.meta.env.VITE_CONTRACT_ADDRESS ??
      DEFAULT_DEPLOYED_CONTRACT
    );
  });

  const [demoOrgWallet, setDemoOrgWallet] = useState<string>(DEMO_ORG_CLEAN_WALLET);
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORGS);
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZATIONS;
  });
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTS);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });
  const [records, setRecords] = useState<VolunteerRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECS);
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isLiveContract = Boolean(contractAddress && isAddress(contractAddress));
  const activeOrgWallet = connectedAddress || demoOrgWallet;

  const setContractAddress = (addr: string) => {
    const trimmed = addr.trim();
    setContractAddressState(trimmed);
    localStorage.setItem(STORAGE_KEYS.CONTRACT, trimmed);
  };

  useEffect(() => {
    if (!isLiveContract) {
      localStorage.setItem(STORAGE_KEYS.ORGS, JSON.stringify(organizations));
      localStorage.setItem(STORAGE_KEYS.ACTS, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.RECS, JSON.stringify(records));
    }
  }, [organizations, activities, records, isLiveContract]);

  const refreshOnChainData = useCallback(async () => {
    if (!isLiveContract || !publicClient) return;
    setIsLoading(true);
    try {
      const target = contractAddress as `0x${string}`;
      const [rawOrgs, rawActs, rawRecs] = await Promise.all([
        publicClient.readContract({
          address: target,
          abi: VOLUNTEER_HOURS_REGISTRY_ABI,
          functionName: 'getAllOrganizations',
        }),
        publicClient.readContract({
          address: target,
          abi: VOLUNTEER_HOURS_REGISTRY_ABI,
          functionName: 'getAllActivities',
        }),
        publicClient.readContract({
          address: target,
          abi: VOLUNTEER_HOURS_REGISTRY_ABI,
          functionName: 'getAllRecords',
        }),
      ]);

      setOrganizations(
        rawOrgs.map((o) => ({
          wallet: o.wallet,
          name: o.name,
          description: o.description,
          registeredAt: Number(o.registeredAt),
          isRegistered: o.isRegistered,
        }))
      );

      setActivities(
        rawActs.map((a) => ({
          id: Number(a.id),
          organization: a.organization,
          organizationName: a.organizationName,
          name: a.name,
          description: a.description,
          location: a.location,
          createdAt: Number(a.createdAt),
        }))
      );

      setRecords(
        rawRecs.map((r) => ({
          id: Number(r.id),
          activityId: Number(r.activityId),
          organization: r.organization,
          organizationName: r.organizationName,
          activityName: r.activityName,
          volunteer: r.volunteer,
          volunteerName: r.volunteerName,
          hoursCompleted: Number(r.hoursCompleted),
          dateRecorded: r.dateRecorded,
          timestamp: Number(r.timestamp),
        }))
      );
    } catch (err) {
      console.error('Failed to read from Botchain Testnet contract:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLiveContract, publicClient, contractAddress]);

  useEffect(() => {
    if (isLiveContract) {
      refreshOnChainData();
    }
  }, [isLiveContract, refreshOnChainData]);

  const registerOrganization = async (name: string, description: string) => {
    if (isLiveContract) {
      const hash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: VOLUNTEER_HOURS_REGISTRY_ABI,
        functionName: 'registerOrganization',
        args: [name, description],
        chainId: botchainTestnet.id,
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refreshOnChainData();
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    setOrganizations((prev) => {
      const existingIndex = prev.findIndex(
        (o) => o.wallet.toLowerCase() === activeOrgWallet.toLowerCase()
      );
      const updated: Organization = {
        wallet: activeOrgWallet,
        name,
        description,
        registeredAt: existingIndex >= 0 ? prev[existingIndex].registeredAt : now,
        isRegistered: true,
      };
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const createActivity = async (
    name: string,
    description: string,
    location: string
  ): Promise<number> => {
    const org = organizations.find(
      (o) => o.wallet.toLowerCase() === activeOrgWallet.toLowerCase()
    );
    if (!org) {
      throw new Error('Only a registered organization can create a volunteer activity.');
    }

    if (isLiveContract) {
      const hash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: VOLUNTEER_HOURS_REGISTRY_ABI,
        functionName: 'createActivity',
        args: [name, description, location],
        chainId: botchainTestnet.id,
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refreshOnChainData();
      return activities.length + 1;
    }

    const nextId = activities.reduce((max, a) => Math.max(max, a.id), 0) + 1;
    const newAct: Activity = {
      id: nextId,
      organization: org.wallet,
      organizationName: org.name,
      name,
      description,
      location,
      createdAt: Math.floor(Date.now() / 1000),
    };
    setActivities((prev) => [newAct, ...prev]);
    return nextId;
  };

  const recordVolunteerHours = async (
    activityId: number,
    volunteer: string,
    volunteerName: string,
    hoursCompleted: number,
    dateRecorded: string
  ): Promise<number> => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) {
      throw new Error('Selected activity was not found.');
    }
    if (activity.organization.toLowerCase() !== activeOrgWallet.toLowerCase()) {
      throw new Error(
        'Access Denied: Only the organization that created this activity can record volunteer hours for it.'
      );
    }

    if (isLiveContract) {
      const hash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: VOLUNTEER_HOURS_REGISTRY_ABI,
        functionName: 'recordVolunteerHours',
        args: [
          BigInt(activityId),
          volunteer as `0x${string}`,
          volunteerName,
          BigInt(hoursCompleted),
          dateRecorded,
        ],
        chainId: botchainTestnet.id,
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refreshOnChainData();
      return records.length + 1;
    }

    const nextId = records.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newRecord: VolunteerRecord = {
      id: nextId,
      activityId: activity.id,
      organization: activity.organization,
      organizationName: activity.organizationName,
      activityName: activity.name,
      volunteer,
      volunteerName: volunteerName.trim() || 'Verified Volunteer',
      hoursCompleted,
      dateRecorded,
      timestamp: Math.floor(Date.now() / 1000),
      txHash: `0x${randomHex}`,
    };

    setRecords((prev) => [newRecord, ...prev]);
    return nextId;
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.ORGS);
    localStorage.removeItem(STORAGE_KEYS.ACTS);
    localStorage.removeItem(STORAGE_KEYS.RECS);
    setOrganizations(INITIAL_ORGANIZATIONS);
    setActivities(INITIAL_ACTIVITIES);
    setRecords(INITIAL_RECORDS);
  };

  return (
    <VolunChainContext.Provider
      value={{
        organizations,
        activities,
        records,
        contractAddress,
        setContractAddress,
        isLiveContract,
        isLoading,
        activeOrgWallet,
        setDemoOrgWallet,
        registerOrganization,
        createActivity,
        recordVolunteerHours,
        refreshOnChainData,
        resetDemoData,
      }}
    >
      {children}
    </VolunChainContext.Provider>
  );
};

export const useVolunChain = () => {
  const ctx = useContext(VolunChainContext);
  if (!ctx) throw new Error('useVolunChain must be used inside VolunChainProvider');
  return ctx;
};

