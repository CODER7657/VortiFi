# VortiFi

**VortiFi** is a decentralized voting application built on Ethereum, designed to facilitate secure and transparent elections for Rotaract club positions. It combines a Solidity smart contract backend with a React frontend, allowing admins to manage candidates and voters while enabling users to cast votes via unique tokens.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Smart Contract Setup](#smart-contract-setup)
  - [Contract Deployment](#contract-deployment)
  - [Ignition Modules](#ignition-modules)
- [Frontend Configuration](#frontend-configuration)
  - [Contract Connection Setup](#contract-connection-setup)
  - [Environment Configuration](#environment-configuration)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Smart Contract Overview](#smart-contract-overview)
  - [RotaractVoting.sol](#rotaractvotingsol)
  - [Key Functions](#key-functions)
- [Frontend Components](#frontend-components)
  - [App.js — Routing & Authentication](#appjs--routing--authentication)
  - [AdminDashboard.js — Admin Interface](#admindashboardjs--admin-interface)
  - [VotingPage.js — Voting Interface](#votingpagejs--voting-interface)
- [Usage](#usage)
  - [For Administrators](#for-administrators)
  - [For Voters](#for-voters)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Project Overview

VortiFi uses blockchain technology to provide a **secure, auditable voting platform**. The system relies on **token-based authentication** where voters receive unique tokens from the admin and cast their votes on-chain. Each token can be used only once, guaranteeing election integrity.

The frontend is built with React and connects to the Ethereum smart contract using ethers.js. Admins manage elections through a dedicated dashboard, and voters can securely submit their votes via a simple voting page.

## Architecture

The project follows a modular architecture:

```
VortiFi/
├── contracts/           # Solidity smart contracts
│   └── RotaractVoting.sol
├── ignition/           # Hardhat Ignition deployment modules
│   └── modules/
│       └── RotaractVoting.js
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── config.js   # Contract configuration
│   │   ├── App.js      # Main application component
│   │   ├── AdminDashboard.js
│   │   └── VotingPage.js
│   └── public/
├── scripts/           # Deployment and utility scripts
├── test/             # Contract tests
└── hardhat.config.js # Hardhat configuration
```

## Smart Contract Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or compatible wallet
- Access to an Ethereum network (testnet recommended for development)

### Contract Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Hardhat:**
   Update `hardhat.config.js` with your network settings:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("@nomicfoundation/hardhat-ignition-ethers");
   
   /** @type import('hardhat/config').HardhatUserConfig */
   module.exports = {
     solidity: "0.8.19",
     networks: {
       sepolia: {
         url: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
         accounts: ["YOUR_PRIVATE_KEY"]
       }
     }
   };
   ```

3. **Compile contracts:**
   ```bash
   npx hardhat compile
   ```

### Ignition Modules

The project uses Hardhat Ignition for deployment. The deployment module is located in `ignition/modules/RotaractVoting.js`:

```javascript
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RotaractVotingModule", (m) => {
  const rotaractVoting = m.contract("RotaractVoting");
  return { rotaractVoting };
});
```

**Deploy using Ignition:**
```bash
# Deploy to local network
npx hardhat ignition deploy ./ignition/modules/RotaractVoting.js --network localhost

# Deploy to testnet (e.g., Sepolia)
npx hardhat ignition deploy ./ignition/modules/RotaractVoting.js --network sepolia
```

## Frontend Configuration

### Contract Connection Setup

After deploying the contract, update the frontend configuration in `frontend/src/config.js`:

```javascript
import { ethers } from 'ethers';
import RotaractVotingABI from './RotaractVoting.json';

// Update this with your deployed contract address
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";

export const CONTRACT_ABI = RotaractVotingABI.abi;

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia testnet
  networkName: "Sepolia",
  rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
};

// Contract instance helper
export const getContractInstance = (provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
```

### Environment Configuration

Create a `.env` file in the frontend directory:

```env
REACT_APP_CONTRACT_ADDRESS=0xYourDeployedContractAddress
REACT_APP_NETWORK_ID=11155111
REACT_APP_NETWORK_NAME=Sepolia
```

## Installation & Setup

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CODER7657/VortiFi.git
   cd VortiFi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests:**
   ```bash
   npx hardhat test
   ```

4. **Start local blockchain:**
   ```bash
   npx hardhat node
   ```

5. **Deploy contracts:**
   ```bash
   npx hardhat ignition deploy ./ignition/modules/RotaractVoting.js --network localhost
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Update contract configuration:**
   - Copy the deployed contract address from the deployment output
   - Update `CONTRACT_ADDRESS` in `src/config.js`

4. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Smart Contract Overview

### RotaractVoting.sol

This contract powers the voting logic on the Ethereum blockchain.

#### Features

- **Admin-Controlled Access**: Only the admin (deployer) can add or remove candidates and issue voter tokens
- **Candidate Management**: Add candidates by name and position; deactivate candidates to preserve vote history
- **Secure Voting**: Issue unique, single-use voter tokens; tokens are hashed and verified on-chain
- **Voting Records**: Votes are stored with voter IDs and candidate choices. Admin can audit all votes
- **Public Results**: Anyone can view active candidates and their vote counts; results can be filtered by position

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `addCandidate(name, position)` | Admin only | Add a new candidate |
| `removeCandidate(id)` | Admin only | Deactivate a candidate |
| `addVoterToken(token, voterId)` | Admin only | Issue a unique voting token |
| `vote(token, candidateId)` | Public | Cast a vote; verified and one-time use only |
| `getAllVotes()` | Admin only | View all votes |
| `getResults()` | Public | View active candidates and vote counts |
| `getResultsByPosition(position)` | Public | Filter candidates by position |

## Frontend Components

### App.js — Routing & Authentication

- **Routing**: Manages navigation between Voting Page, Admin Login, and Admin Dashboard
- **Authentication**: Maintains admin state and session management
- **Web3 Integration**: Handles wallet connections and network switching

### AdminDashboard.js — Admin Interface

- **Candidate Management**: Add and deactivate candidates
- **Token Management**: Generate and issue hashed voter tokens
- **Results Monitoring**: View live results and voter activity
- **Access Control**: Restricted to admin wallet address only

### VotingPage.js — Voting Interface

- **Public Access**: No wallet connection required for voting
- **Token Validation**: Voters enter unique tokens received from admin
- **Candidate Selection**: Display active candidates with position filtering
- **Vote Submission**: Token is hashed and validated before casting vote

## Usage

### For Administrators

1. **Connect Admin Wallet**: Use the wallet that deployed the contract
2. **Access Admin Dashboard**: Navigate to `/admin` and authenticate
3. **Add Candidates**: Enter candidate name and position
4. **Generate Tokens**: Create unique tokens for eligible voters
5. **Monitor Results**: Track votes in real-time
6. **Audit Votes**: Review all voting activity

### For Voters

1. **Receive Token**: Get unique voting token from administrator
2. **Visit Voting Page**: Go to the main application URL
3. **Enter Token**: Input your unique voting token
4. **Select Candidate**: Choose from available candidates
5. **Submit Vote**: Confirm your selection (token becomes invalid after use)

## Security Notes

- **Token Confidentiality**: Voting tokens must be kept secret and shared only with eligible voters
- **Private Key Security**: Never expose private keys in frontend code or commit them to version control
- **Production Deployment**: 
  - Use environment variables for sensitive configuration
  - Implement proper wallet integration (MetaMask/WalletConnect)
  - Consider using a more secure token distribution method
  - Add rate limiting and additional validation
- **Smart Contract Security**: 
  - Contract has been designed with access controls
  - Consider professional audit for production use
  - Test thoroughly on testnets before mainnet deployment

## Troubleshooting

### Common Issues

1. **Contract not found**: Ensure the contract address in `config.js` matches the deployed address
2. **Network mismatch**: Verify wallet is connected to the correct network
3. **Transaction failures**: Check gas limits and ensure sufficient balance
4. **Token issues**: Verify token hasn't been used already

### Debug Mode

Enable debug mode by setting `DEBUG=true` in your environment to see detailed logs.

## Contributing

Contributions, issues, and feature requests are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Solidity best practices for smart contract development
- Use ESLint and Prettier for JavaScript formatting
- Write tests for new features
- Update documentation as needed

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: This is a demonstration project. For production use, implement additional security measures, conduct thorough testing, and consider professional smart contract auditing.
