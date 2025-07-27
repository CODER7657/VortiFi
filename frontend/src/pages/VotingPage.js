import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../config";

const VotingPage = () => {
  const [token, setToken] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [contract, setContract] = useState(null);

  
  const adminPrivateKey =
    "HERE YOUR ADMIN ACCOUNT PRIVATE KEY"; 
  const provider = new ethers.JsonRpcProvider("HERE LOCAL IP I HAVE USED HARDHAT LOCAL SEVER THATS WHY");
  const signer = new ethers.Wallet(adminPrivateKey, provider);

  useEffect(() => {
    const setup = async () => {
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);

      const total = await contractInstance.candidatesCount();
      const temp = [];

      for (let i = 1; i <= total; i++) {
        const c = await contractInstance.candidates(i);
        if (c.active) {
          temp.push(c);
        }
      }

      setCandidates(temp);
    };

    setup();
  }, []);

  const handleVote = async () => {
    if (!token.trim() || selected === null) {
      alert("Please enter token and select a candidate.");
      return;
    }

    try {
      const hash = ethers.keccak256(ethers.toUtf8Bytes(token.trim()));
      const tx = await contract.vote(hash, selected);
      await tx.wait();

      setMessage("✅ Vote submitted successfully!");
      setToken("");
      setSelected(null);
    } catch (err) {
      console.error("Voting failed:", err);
      setMessage("❌ Vote failed: " + (err.reason || "Unknown error"));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🗳️ Vote </h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Enter your token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <div style={styles.candidateList}>
          {candidates.map((c) => (
            <label key={c.id} style={styles.candidate}>
              <input
                type="radio"
                name="candidate"
                value={c.id}
                checked={selected === Number(c.id)}
                onChange={() => setSelected(Number(c.id))}
              />
              {c.name} ({c.position})
            </label>
          ))}
        </div>

        <button style={styles.button} onClick={handleVote}>
          ✅ Submit Vote
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "90%",
    maxWidth: "400px",
  },
  title: {
    marginBottom: "1rem",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  candidateList: {
    marginBottom: "1rem",
  },
  candidate: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default VotingPage;
