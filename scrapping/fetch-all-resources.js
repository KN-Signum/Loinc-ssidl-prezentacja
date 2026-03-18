/**
 * FHIR Resource Scraper – port 8092 knowledge base
 *
 * Fetches every resource of each listed type from the FHIR server,
 * follows FHIR pagination (Bundle.link[rel=next]), and saves each
 * individual resource as  resources/<ResourceType>/<id>.json
 *
 * Credentials are read from ../backend/.env so there is no need to
 * duplicate secrets.
 *
 * Usage:
 *   npm install          # first time only
 *   node fetch-all-resources.js
 *   # or:
 *   npm run fetch
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load credentials from the backend .env (one level up)
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const TOKEN_URL    = process.env.TOKEN_URL;
const CLIENT_ID    = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const FHIR_BASE_URL = process.env.FHIR_BASE_URL ?? 'http://apps.tukan.online:8092/fhir';

// All resource types reported by the server's CapabilityStatement
const RESOURCE_TYPES = [
  'StructureDefinition',
  'ValueSet',
  'CodeSystem',
  'ActivityDefinition',
  'Bundle',
  'CapabilityStatement',
  'Citation',
  'ConceptMap',
  'ConditionDefinition',
  'Group',
  'HealthcareService',
  'ImplementationGuide',
  'List',
  'Location',
  'NamingSystem',
  'ObservationDefinition',
  'OperationDefinition',
  'Organization',
  'Patient',
  'SearchParameter',
  'SpecimenDefinition',
];

const OUTPUT_DIR = path.resolve(__dirname, 'resources');
const PAGE_SIZE  = 50; // resources per request

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
async function fetchAccessToken() {
  const params = new URLSearchParams();
  params.append('client_id',     CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type',    'client_credentials');

  const res = await fetch(TOKEN_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.access_token;
}

// ---------------------------------------------------------------------------
// FHIR helpers
// ---------------------------------------------------------------------------

/** Follow Bundle.link[rel=next] until exhausted. Yields each Bundle page. */
async function* paginateBundle(firstUrl, headers) {
  let url = firstUrl;

  while (url) {
    console.log(`    GET ${url}`);
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${body.slice(0, 200)}`);
    }

    const bundle = await res.json();
    yield bundle;

    const nextLink = (bundle.link ?? []).find(l => l.relation === 'next');
    url = nextLink?.url ?? null;
  }
}

/** Extract all entry resources from a Bundle, skip entries without a resource. */
function entriesOf(bundle) {
  return (bundle.entry ?? [])
    .map(e => e.resource)
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveResource(resource, typeDir) {
  const id       = resource.id ?? `unknown-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const filePath = path.join(typeDir, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(resource, null, 2), 'utf8');
  return filePath;
}

// ---------------------------------------------------------------------------
// Per-type summary file
// ---------------------------------------------------------------------------
function saveSummary(typeDir, resourceType, stats) {
  const summaryPath = path.join(typeDir, '_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    resourceType,
    fetchedAt: new Date().toISOString(),
    ...stats,
  }, null, 2), 'utf8');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function fetchResourceType(resourceType, headers) {
  const typeDir = path.join(OUTPUT_DIR, resourceType);
  ensureDir(typeDir);

  // Fetch all resources of this type.
  // We use _sort=_id to ensure stable pagination and (usually) numeric order.
  // If you want to restrict to a specific range (e.g. 1..1000), you could append:
  // &id=ge1&id=le1000 (if server supports it)
  const firstUrl = `${FHIR_BASE_URL}/${resourceType}?_count=${PAGE_SIZE}&_sort=_id`;

  let total      = null;
  let saved      = 0;
  let pageNumber = 0;
  let skipped    = 0;

  try {
    for await (const bundle of paginateBundle(firstUrl, headers)) {
      pageNumber++;

      // Capture total on first page
      if (total === null && typeof bundle.total === 'number') {
        total = bundle.total;
        console.log(`    Total reported by server: ${total}`);
      }

      const resources = entriesOf(bundle);

      if (resources.length === 0) {
        console.log(`    Page ${pageNumber}: no entries.`);
        break;
      }

      for (const resource of resources) {
        // Skip Bundle entries that are themselves Bundle indexes (avoid nesting chaos)
        if (resourceType === 'Bundle' && resource.resourceType !== 'Bundle') {
          skipped++;
          continue;
        }
        saveResource(resource, typeDir);
        saved++;
      }

      console.log(`    Page ${pageNumber}: saved ${resources.length - (resources.length - saved + skipped > 0 ? 0 : 0)} resources (running total: ${saved})`);
    }
  } catch (err) {
    console.error(`    ✗ Error fetching ${resourceType}: ${err.message}`);
    saveSummary(typeDir, resourceType, { saved, skipped, error: err.message });
    return { saved, skipped, error: err.message };
  }

  saveSummary(typeDir, resourceType, { total, saved, skipped });
  return { total, saved, skipped };
}

async function main() {
  console.log('='.repeat(60));
  console.log('FHIR Resource Scraper');
  console.log(`Server : ${FHIR_BASE_URL}`);
  console.log(`Output : ${OUTPUT_DIR}`);
  console.log('='.repeat(60));

  // Validate config
  if (!TOKEN_URL || !CLIENT_ID || !CLIENT_SECRET) {
    console.error('Missing TOKEN_URL / CLIENT_ID / CLIENT_SECRET in ../backend/.env');
    process.exit(1);
  }

  ensureDir(OUTPUT_DIR);

  // Authenticate
  console.log('\n[1/2] Authenticating...');
  let accessToken;
  try {
    accessToken = await fetchAccessToken();
    console.log('      ✓ Token obtained.\n');
  } catch (err) {
    console.error(`      ✗ ${err.message}`);
    process.exit(1);
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept:        'application/fhir+json',
  };

  // Fetch all resource types
  console.log('[2/2] Fetching resources...\n');
  const results = {};

  for (const resourceType of RESOURCE_TYPES) {
    console.log(`  ► ${resourceType}`);
    results[resourceType] = await fetchResourceType(resourceType, headers);
    const r = results[resourceType];
    const status = r.error ? '✗ ERROR' : '✓';
    console.log(`    ${status}  saved=${r.saved}  skipped=${r.skipped ?? 0}  serverTotal=${r.total ?? 'n/a'}\n`);
  }

  // Write global summary
  const globalSummaryPath = path.join(OUTPUT_DIR, '_run-summary.json');
  fs.writeFileSync(globalSummaryPath, JSON.stringify({
    fhirBaseUrl: FHIR_BASE_URL,
    fetchedAt:   new Date().toISOString(),
    results,
  }, null, 2), 'utf8');

  // Print table
  console.log('='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  const totalSaved = Object.values(results).reduce((s, r) => s + (r.saved ?? 0), 0);
  for (const [type, r] of Object.entries(results)) {
    const mark = r.error ? '✗' : '✓';
    console.log(`  ${mark}  ${type.padEnd(25)} saved=${String(r.saved).padStart(4)}  server=${String(r.total ?? '?').padStart(5)}`);
  }
  console.log('-'.repeat(60));
  console.log(`     ${'TOTAL'.padEnd(25)} saved=${String(totalSaved).padStart(4)}`);
  console.log(`\nGlobal summary written to: ${globalSummaryPath}`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
