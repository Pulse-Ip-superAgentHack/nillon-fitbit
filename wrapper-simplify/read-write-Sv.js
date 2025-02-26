import { SecretVaultWrapper } from "secretvaults";
import { orgConfig } from "../orgConfig.js";

const SCHEMA_ID = "117ecab7-d8b1-45fb-b8d2-51bbcbbb9a40";

const fitbitData = [
  {
    user_id: "xxx-xxx-xxx-xxx",
    firstName: "Xong",
    lastName: "Xi",
    // Provide the age using the encryption placeholder. This will be converted to an encrypted "%share" value.
    age: { "%allot": 30 },
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

    // Write the Fitbit data records to the nodes.
    // The age field will be encrypted automatically during this process.
    const dataWritten = await collection.writeToNodes(fitbitData);
    console.log("dataWritten", dataWritten);

    // Extract newly created record IDs (assuming dataWritten contains a nested 'created' property).
    const newIds = [
      ...new Set(dataWritten.map((item) => item.data.created).flat()),
    ];
    console.log("created ids:", newIds);

    // Read all records from the collection.
    // The system automatically decrypts fields like 'age' so you see the original value.
    const dataRead = await collection.readFromNodes({});
    console.log("📚 total records:", dataRead.length);
    console.log("📚 Read new records:", dataRead.slice(0, fitbitData.length));
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", error.message);
    process.exit(1);
  }
}

main();
