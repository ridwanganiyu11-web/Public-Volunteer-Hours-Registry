# VolunChain — Public Volunteer Hours Registry

> **Every Hour Counts. Every Contribution Matters.**

**VolunChain** is a blockchain-powered volunteer hours registry built on **Botchain Testnet (Chain ID: 968)**. It enables charities, NGOs, schools, and community groups to create volunteer activities and permanently record completed volunteer hours on-chain, while allowing volunteers and the public to verify contributions, scan QR codes, and download Volunteer Achievement Certificates for free.

---

## Botchain Testnet Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Native Token** | `BOT` |
| **Total Supply** | `150 Million` |
| **Block Explorer** | https://scan.bohr.life/ |
| **Deployed Contract (`VolunteerHoursRegistry.sol`)** | [`0xa00c2081a1e6a5bec9302fc85b11a5f5bd9aa56c`](https://scan.bohr.life/address/0xa00c2081a1e6a5bec9302fc85b11a5f5bd9aa56c) |

---

## Tech Stack

- **Wallet & Web3 Stack**: `@reown/appkit`, `@reown/appkit-adapter-wagmi`, `wagmi@2.x`, `viem`, `@tanstack/react-query`
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router, `qrcode.react`, `lucide-react`
- **Smart Contract**: Solidity `^0.8.20` (`contracts/VolunteerHoursRegistry.sol`) + Hardhat (`hardhat.config.cjs`, `scripts/deploy.cjs`)

---

## Smart Contract (`contracts/VolunteerHoursRegistry.sol`)

### Key Functions
- `registerOrganization(string name, string description)` — Register an organization wallet.
- `createActivity(string name, string description, string location)` — Create a volunteer activity under the caller's registered organization.
- `recordVolunteerHours(uint256 activityId, address volunteer, string volunteerName, uint256 hoursCompleted, string dateRecorded)` — Record completed hours for a volunteer. **Enforces Option A access control**: only the organization wallet that created `activityId` can record hours for it.
- `getVolunteerHours(address volunteer)` — View a volunteer's cumulative verified hours.
- `getVolunteerRecords(address volunteer)` — View a volunteer's complete contribution history.
- `getActivity(uint256 activityId)` / `getRecord(uint256 recordId)` — Public read functions (no wallet or gas required).

---

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Connect to Live Contract or Use Interactive Sandbox**:
   - Out of the box, VolunChain runs with an interactive Botchain sandbox pre-loaded with sample organizations (*Clean Our Community*, *Youth Learning Foundation*, *EcoCanopy Initiative*) and sample records (48 hours across 8 activities).
   - Once you deploy `contracts/VolunteerHoursRegistry.sol` to Botchain Testnet (Chain ID `968`), click **Contract Config** in the top bar and paste your deployed contract address to switch to live on-chain reads and writes.

