<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>VortiFi Project Documentation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #f8f9fa;
      color: #333;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    pre, code {
      background-color: #eee;
      padding: 4px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    pre {
      display: block;
      padding: 10px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .note {
      background: #fff3cd;
      padding: 10px;
      border-left: 5px solid #ffeeba;
      margin: 10px 0;
    }
  </style>
</head>
<body>

<h1>VortiFi</h1>

<p><strong>VortiFi</strong> is a decentralized voting application built on Ethereum, designed to facilitate secure and transparent elections for Rotaract club positions. It combines a Solidity smart contract backend with a React frontend, allowing admins to manage candidates and voters while enabling users to cast votes via unique tokens.</p>

<hr/>

<h2>Table of Contents</h2>
<ul>
  <li><a href="#project-overview">Project Overview</a></li>
  <li><a href="#smart-contract-overview">Smart Contract Overview</a></li>
  <li><a href="#frontend-overview">Frontend Overview</a></li>
  <ul>
    <li><a href="#configjs--contract-connection"><code>config.js</code> — Contract Connection</a></li>
    <li><a href="#appjs--routing--authentication"><code>App.js</code> — Routing & Authentication</a></li>
    <li><a href="#admin-dashboard-admindashboardjs">Admin Dashboard</a></li>
    <li><a href="#voting-page-votingpagejs">Voting Page</a></li>
  </ul>
  <li><a href="#installation--setup">Installation &amp; Setup</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#security-notes">Security Notes</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
</ul>

<hr/>

<h2 id="project-overview">Project Overview</h2>
<p>VortiFi uses blockchain technology to provide a <strong>secure, auditable voting platform</strong>. The system relies on a <strong>token-based authentication</strong> where voters receive unique tokens from the admin and cast their votes on-chain. Each token can be used only once, guaranteeing election integrity.</p>
<p>The frontend is built with React and connects to the Ethereum smart contract using ethers.js. Admins manage elections through a dedicated dashboard, and voters can securely submit their votes via a simple voting page.</p>

<h2 id="smart-contract-overview">Smart Contract Overview</h2>
<h3>Contract: <code>RotaractVoting.sol</code></h3>
<p>This contract powers the voting logic on the Ethereum blockchain.</p>

<h4>Features</h4>
<ul>
  <li><strong>Admin-Controlled Access</strong>: Only the admin (deployer) can add or remove candidates and issue voter tokens.</li>
  <li><strong>Candidate Management</strong>: Add candidates by name and position; deactivate candidates to preserve vote history.</li>
  <li><strong>Secure Voting</strong>: Issue unique, single-use voter tokens; tokens are hashed and verified on-chain.</li>
  <li><strong>Voting Records</strong>: Votes are stored with voter IDs and candidate choices. Admin can audit all votes.</li>
  <li><strong>Public Results</strong>: Anyone can view active candidates and their vote counts; results can be filtered by position.</li>
</ul>

<h4>Key Functions</h4>
<table>
<tr><th>Function</th><th>Access</th><th>Description</th></tr>
<tr><td><code>addCandidate(name, position)</code></td><td>Admin only</td><td>Add a new candidate</td></tr>
<tr><td><code>removeCandidate(id)</code></td><td>Admin only</td><td>Deactivate a candidate</td></tr>
<tr><td><code>addVoterToken(token, voterId)</code></td><td>Admin only</td><td>Issue a unique voting token</td></tr>
<tr><td><code>vote(token, candidateId)</code></td><td>Public</td><td>Cast a vote; verified and one-time use only</td></tr>
<tr><td><code>getAllVotes()</code></td><td>Admin only</td><td>View all votes</td></tr>
<tr><td><code>getResults()</code></td><td>Public</td><td>View active candidates and vote counts</td></tr>
<tr><td><code>getResultsByPosition(position)</code></td><td>Public</td><td>Filter candidates by position</td></tr>
</table>

<h2 id="frontend-overview">Frontend Overview</h2>

<h3 id="configjs--contract-connection"><code>config.js</code> — Contract Connection</h3>
<ul>
  <li>Holds the deployed contract address and ABI.</li>
  <li>Update <code>contractAddress</code> with the deployed address.</li>
</ul>

<h3 id="appjs--routing--authentication"><code>App.js</code> — Routing & Authentication</h3>
<ul>
  <li>Routes: Voting Page, Admin Login, Admin Dashboard.</li>
  <li>Maintains admin state & session expiry.</li>
</ul>

<h3 id="admin-dashboard-admindashboardjs">Admin Dashboard (<code>AdminDashboard.js</code>)</h3>
<ul>
  <li>Add, deactivate candidates.</li>
  <li>Issue hashed voter tokens.</li>
  <li>View live results and voter activity.</li>
  <li>Accessible only to admin wallet address.</li>
</ul>

<h3 id="voting-page-votingpagejs">Voting Page (<code>VotingPage.js</code>)</h3>
<ul>
  <li>Public interface for voting.</li>
  <li>Voter enters token & selects candidate.</li>
  <li>Token is hashed before submission.</li>
  <li><em>Security Note:</em> Replace hardcoded private key with user wallet signing in production.</li>
</ul>

<h2 id="installation--setup">Installation & Setup</h2>
<pre><code>git clone https://github.com/CODER7657/VortiFi.git
cd VortiFi
npm install
</code></pre>
<p>Deploy the contract, update <code>config.js</code> with address, then:</p>
<pre><code>npm start
</code></pre>

<h2 id="usage">Usage</h2>
<h4>Admin</h4>
<ul>
  <li>Login with admin wallet.</li>
  <li>Add candidates, issue tokens, track results.</li>
</ul>
<h4>Voter</h4>
<ul>
  <li>Enter unique token, select candidate, submit vote.</li>
</ul>

<h2 id="security-notes">Security Notes</h2>
<ul>
  <li>Tokens must be kept confidential.</li>
  <li>Never expose private keys in frontend code.</li>
  <li>Use MetaMask/WalletConnect for signing in production.</li>
</ul>

<h2 id="contributing">Contributing</h2>
<p>Contributions, issues, and feature requests are welcome. Submit pull requests or open issues.</p>

<h2 id="license">License</h2>
<p>Specify your license here, e.g., MIT.</p>

</body>
</html>
