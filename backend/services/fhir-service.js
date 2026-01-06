import dotenv from "dotenv";

dotenv.config();

const TOKEN_URL = process.env.TOKEN_URL;
const FHIR_BASE_URL = process.env.FHIR_BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const buildAuthHeaders = (token) => ({
  Authorization: `Bearer ${token.access_token}`,
  Accept: "application/fhir+json",
});

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  return response.json();
};

async function getToken() {
  return fetchJson(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
  });
}

async function fetchFhirResource(resourceType, suffix = "") {
  const token = await getToken();
  return fetchJson(`${FHIR_BASE_URL}/${resourceType}${suffix}`, {
    headers: buildAuthHeaders(token),
  });
}

async function getActivityDefinitionsByTitle(title) {
  const context = "http://loinc-ssidl.umed.pl/fhir/ig/ssidl/CodeSystem/ssidl-definitionUseContext-CS|BW";
  return fetchFhirResource(
    "ActivityDefinition",
    `?context=${context}&title:contains=${title}`
  );
}

export { getToken, fetchFhirResource, getActivityDefinitionsByTitle };
