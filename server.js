import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { SecretVaultWrapper } from "secretvaults";
import { orgConfig } from "./orgConfig.js";

const app = express();
const port = 3000;
const SCHEMA_ID = "3f35a54a-3ea3-4910-a7f5-b36248dc659f";

app.use(cors());
app.use(bodyParser.json());

app.post("/upload", async (req, res) => {
  const fitbitData = req.body;

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

    res.status(200).json({ message: "Data uploaded successfully", newIds });
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", error.message);
    res.status(500).json({ error: "Failed to upload data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
