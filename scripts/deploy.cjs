const hre = require("hardhat");

async function main() {
  console.log("Deploying VolunteerHoursRegistry to Botchain Testnet (Chain ID: 968)...");

  const Registry = await hre.ethers.getContractFactory("VolunteerHoursRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("---------------------------------------------------------");
  console.log("VolunteerHoursRegistry deployed to:", address);
  console.log("Explorer URL: https://scan.bohr.life/address/" + address);
  console.log("---------------------------------------------------------");
  console.log("Paste this address into the Contract Settings bar in the VolunChain UI or set VITE_CONTRACT_ADDRESS in .env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

