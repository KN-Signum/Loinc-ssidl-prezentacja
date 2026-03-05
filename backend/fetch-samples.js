
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const TOKEN_URL = process.env.TOKEN_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const FHIR_BASE_URL = "http://apps.tukan.online:8091/fhir";

async function fetchAndSaveSamples() {
  console.log('1. Authenticating...');
  let accessToken;
  try {
    const authParams = new URLSearchParams();
    authParams.append('client_id', CLIENT_ID);
    authParams.append('client_secret', CLIENT_SECRET);
    authParams.append('grant_type', 'client_credentials');

    const authResponse = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: authParams.toString(),
    });

    if (!authResponse.ok) {
        throw new Error(`Authentication failed: ${authResponse.status} ${authResponse.statusText}`);
    }

    const tokenData = await authResponse.json();
    accessToken = tokenData.access_token;
    console.log('   Authentication successful.');
  } catch (error) {
    console.error('   Auth Error:', error.message);
    process.exit(1);
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/fhir+json"
  };

  const outputDir = path.resolve('/app/fhir-samples'); 
  if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
  }

  const resources = ['StructureDefinition', 'ValueSet', 'CodeSystem', 'ConceptMap'];

  for (const resourceType of resources) {
      console.log(`Fetching sample for: ${resourceType}`);
      
      try {
          // Fetch just 1 to keep it manageable as a "sample"
          const url = `${FHIR_BASE_URL}/${resourceType}?_count=1`;
          console.log(`   GET ${url}`);
          const response = await fetch(url, { headers });
          
          if (!response.ok) {
              console.error(`   Failed to fetch ${resourceType}: ${response.status}`);
              continue;
          }

          const bundle = await response.json();
          let sampleData = bundle;

          // If it's a bundle with entries, maybe save the first entry as the sample, 
          // or save the whole bundle? The user asked for "StructureDefinition", singular.
          // Let's save the first entry if available, otherwise the bundle.
          if (bundle.resourceType === 'Bundle' && bundle.entry && bundle.entry.length > 0) {
              sampleData = bundle.entry[0].resource;
              console.log(`   Found entry ${sampleData.id}`);
          } else {
              console.log(`   No entries found, saving bundle as is.`);
          }

          const fileName = `${resourceType}.json`;
          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, JSON.stringify(sampleData, null, 2));
          console.log(`   Saved to ${fileName}`);

      } catch (error) {
          console.error(`Error processing ${resourceType}:`, error.message);
      }
  }
}

fetchAndSaveSamples();
