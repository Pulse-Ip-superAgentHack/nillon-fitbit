import { SecretVaultWrapper } from "secretvaults";
import { orgConfig } from "../orgConfig.js";

const SCHEMA_ID = "2e6ece0d-0842-4dfb-849f-3e0aa8c009a3";

const fitbitData = [
  {
    user_id: "xxx-xxx-xxx-xxx",
    firstName: "Xong",
    lastName: "Xi",
    steps: 10000,
    restingHeartRate: 70,
    calories: 2000,
  },
];

async function main() {
  try {
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      SCHEMA_ID
    );
    await collection.init();

    // Write the Fitbit data records to the nodes
    const dataWritten = await collection.writeToNodes(fitbitData);
    console.log("dataWritten", dataWritten);

    // Extract newly created record IDs (assuming dataWritten contains a nested created property)
    const newIds = [
      ...new Set(dataWritten.map((item) => item.data.created).flat()),
    ];
    console.log("created ids:", newIds);

    // Read all records from the collection
    const dataRead = await collection.readFromNodes({});
    console.log("📚 total records:", dataRead.length);
    console.log("📚 Read new records:", dataRead.slice(0, fitbitData.length));
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", error.message);
    process.exit(1);
  }
}

main();
