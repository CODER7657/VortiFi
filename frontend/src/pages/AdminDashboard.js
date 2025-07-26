import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../config";

const AdminDashboard = () => {
  const [candidateName, setCandidateName] = useState("");
  const [position, setPosition] = useState("");
  const [voterId, setVoterId] = useState("");
  const [voterToken, setVoterToken] = useState("");
  const [results, setResults] = useState([]);
  const [votes, setVotes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const setup = async () => {
      try {
        const signer = await provider.getSigner();
        const instance = new ethers.Contract(contractAddress, contractABI, signer);
        const currentUser = await signer.getAddress();
        const contractAdmin = await instance.admin();

        if (currentUser.toLowerCase() !== contractAdmin.toLowerCase()) {
          alert("❌ Access Denied: You are not the Admin.");
          return;
        }

        setIsAdmin(true);
        setContract(instance);
        await fetchResults(instance);
        const allVotes = await fetchVotes(instance);
        setVotes(allVotes);
      } catch (err) {
        console.error("Setup failed:", err);
      }
    };

    setup();
  }, []);

  const handleAddCandidate = async () => {
    if (!candidateName.trim() || !position.trim()) return alert("Enter both name and position");

    try {
      const tx = await contract.addCandidate(candidateName.trim(), position.trim());
      await tx.wait();
      alert("✅ Candidate added!");
      setCandidateName("");
      setPosition("");
      fetchResults(contract);
    } catch (err) {
      console.error(err);
      alert("❌ Error adding candidate");
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      const tx = await contract.removeCandidate(id);
      await tx.wait();
      alert("🗑️ Candidate removed!");
      fetchResults(contract);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove candidate");
    }
  };

  const handleAddVoterToken = async () => {
    if (!voterToken.trim() || !voterId.trim()) return alert("Fill both fields");

    try {
      const tokenHash = ethers.keccak256(ethers.toUtf8Bytes(voterToken.trim()));
      const tx = await contract.addVoterToken(tokenHash, voterId.trim());
      await tx.wait();
      alert(`✅ Token added for ${voterId}`);
      setVoterToken("");
      setVoterId("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add voter token");
    }
  };

  const fetchResults = async (contractRef) => {
    try {
      const total = await contractRef.candidatesCount();
      const temp = [];

      for (let i = 1; i <= total; i++) {
        const candidate = await contractRef.candidates(i);
        if (candidate.active) temp.push(candidate);
      }
      setResults(temp);
    } catch (err) {
      console.error("Fetching results failed", err);
    }
  };

  const fetchVotes = async (contractRef) => {
    try {
      const voteList = await contractRef.getAllVotes();
      const total = await contractRef.candidatesCount();

      const candidateMap = {};
      const activeIds = new Set();

      for (let i = 1; i <= total; i++) {
        const c = await contractRef.candidates(i);
        if (c.active) {
          candidateMap[c.id.toString()] = c.name;
          activeIds.add(c.id.toString());
        }
      }

      const mappedVotes = voteList
        .filter((v) => activeIds.has(v.candidateId.toString()))
        .map((v) => ({
          voterId: v.voterId,
          candidateName: candidateMap[v.candidateId.toString()],
        }));

      return mappedVotes;
    } catch (err) {
      console.error("❌ Failed to fetch vote data:", err);
      return [];
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>🔒 You are not authorized to view this page.</h2>
        <p>Please connect the admin wallet.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Add Candidate */}
      <div style={styles.section}>
        <h2>➕ Add Candidate</h2>
        <input style={styles.input} type="text" placeholder="Candidate Name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
        <input style={styles.input} type="text" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
        <button style={styles.button} onClick={handleAddCandidate}>Add Candidate</button>
      </div>

      {/* Add Voter Token */}
      <div style={styles.section}>
        <h2>🔐 Add Voter Token</h2>
        <input style={styles.input} type="text" placeholder="Token/ID/Hash" value={voterToken} onChange={(e) => setVoterToken(e.target.value)} />
        <input style={styles.input} type="text" placeholder="Voter Name" value={voterId} onChange={(e) => setVoterId(e.target.value)} />
        <button style={styles.button} onClick={handleAddVoterToken}>Add Token</button>
      </div>

      {/* Live Results */}
      <div style={styles.section}>
        <h2>📊 Live Results</h2>
        {results.length === 0 ? (
          <p>No candidates yet.</p>
        ) : (
          <table style={styles.resultTable}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Position</th>
                <th style={styles.th}>Votes</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((c) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.td}>{c.id.toString()}</td>
                  <td style={styles.td}>{c.name}</td>
                  <td style={styles.td}>{c.position}</td>
                  <td style={styles.td}>{c.voteCount.toString()}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleDeleteCandidate(c.id)} style={{ ...styles.button, backgroundColor: "#dc3545" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Voter Activity */}
      <div style={styles.section}>
        <h2>🧾 Voter Activity</h2>
        {votes.length === 0 ? (
          <p>No votes yet.</p>
        ) : (
          <table style={styles.resultTable}>
            <thead>
              <tr>
                <th style={styles.th}>Voter ID</th>
                <th style={styles.th}>Voted For</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{vote.voterId}</td>
                  <td style={styles.td}>{vote.candidateName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "2rem",
    maxWidth: "900px",
    margin: "0 auto",
  },
  section: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    marginBottom: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "0.5rem 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  resultTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    backgroundColor: "#fefefe",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    borderBottom: "2px solid #dee2e6",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#333",
    borderBottom: "1px solid #eee",
  },
  tr: {
    transition: "background 0.2s ease-in-out",
  },
};

export default AdminDashboard;
