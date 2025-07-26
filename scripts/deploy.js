const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Voting = await hre.ethers.getContractFactory("RotaractVoting");
  const voting = await Voting.deploy(); // No .deployed() needed

  console.log("Contract deployed to:", voting.target); // For ethers v6
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
