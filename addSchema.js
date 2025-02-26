import { SecretVaultWrapper } from "secretvaults";
import { orgConfig } from "./orgConfig.js";
import schema from "./schema.json" assert { type: "json" };

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();

    // Create a new collection schema using the Fitbit Data Schema
    const newSchema = await org.createSchema(schema, "Fitbit Data Schema");
    console.log("📚 New Schema:", newSchema);
  } catch (error) {
    console.error("❌ Failed to create Fitbit Data Schema:", error.message);
    process.exit(1);
  }
}

main();
