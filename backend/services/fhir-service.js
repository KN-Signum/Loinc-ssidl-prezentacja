import dotenv from "dotenv";
import paginationCache from "../pagination-cache.js";

dotenv.config();

const TOKEN_URL = process.env.TOKEN_URL;
const FHIR_BASE_URL = process.env.FHIR_BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

function buildAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token.access_token}`,
    Accept: "application/fhir+json",
  };
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  return response.json();
}

async function getToken() {
  return fetchJson(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
  });
}

function createPaginationToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
function addTokenToPaginationCache(link) {
  const token = createPaginationToken();
  console.log("Generated pagination token for next link:", token, link);
  paginationCache.set(token, { link });
  return token;
}

export function validateResponseForPagination(response) {
  const nextLink = response.link?.find((l) => l.relation === "next")?.url;
  const prevLink = response.link?.find((l) => l.relation === "prev")?.url;

  let responseCopy = { ...response };
  if(nextLink) {
    const token = addTokenToPaginationCache(nextLink);
    responseCopy = { ...responseCopy, paginationTokenNext: token };
  }
  if(prevLink){
    const token = addTokenToPaginationCache(prevLink);
    responseCopy = { ...responseCopy, paginationTokenPrev: token };
  }
  return responseCopy;
}

export async function fetchPaginatedFhirResource(token) {
  const authToken = await getToken();
  const headers = buildAuthHeaders(authToken);

  const cachedData = paginationCache.get(token);
  console.log("Fetched cached pagination data for token:", token, cachedData);
  if (!cachedData)
    return null;

  const data = cachedData.link;
  console.log("Fetching paginated FHIR resource from URL:", data);
  const result = await fetchJson(data, {headers});
  console.log("Fetched paginated FHIR resource:", result);
  const validatedResult = validateResponseForPagination(result);
  console.log("Validated paginated FHIR resource:", validatedResult);
  return validatedResult;

}
async function fetchFhirResource(resourceType, suffix = "") {
  const token = await getToken();
  return fetchJson(`${FHIR_BASE_URL}/${resourceType}${suffix}`, {
    headers: buildAuthHeaders(token),
  });
}
function transformCanonicalUrlToId(canonicalUrl) {
  const parts = canonicalUrl.split("-");
  return parts[parts.length - 1];
}

function transformCanonicalUrlToResourceType(canonicalUrl) {
  const parts = canonicalUrl.split("/");
  return parts[parts.length - 2];
}

function extractCanonicals(items, pickCanonical) {
  return (items || [])
    .map((item) => pickCanonical(item))
    .filter(Boolean)
    .map((canonicalUrl) => ({
      id: transformCanonicalUrlToId(canonicalUrl),
      resourceType: transformCanonicalUrlToResourceType(canonicalUrl),
    }));
}
export {
  getToken,
  fetchFhirResource,
  extractCanonicals,
  transformCanonicalUrlToId,
  transformCanonicalUrlToResourceType,
  buildAuthHeaders,
  fetchJson,
};
