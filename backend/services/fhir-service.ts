import dotenv from "dotenv";
import paginationCache from "../pagination-cache.js";

dotenv.config();

const TOKEN_URL = process.env.TOKEN_URL!;
const FHIR_BASE_URL = process.env.FHIR_BASE_URL!;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;

interface TokenResponse {
  access_token: string;
  [key: string]: any;
}

interface FhirLink {
  relation: string;
  url: string;
}

interface FhirBundle {
  link?: FhirLink[];
  [key: string]: any;
}

interface CanonicalReference {
  id: string;
  resourceType: string;
}

function buildAuthHeaders(token: TokenResponse): Record<string, string> {
  return {
    Authorization: `Bearer ${token.access_token}`,
    Accept: "application/fhir+json",
  };
}

async function fetchJson(url: string, options: RequestInit): Promise<any> {
  const response = await fetch(url, options);
  return response.json();
}

async function getToken(): Promise<TokenResponse> {
  return fetchJson(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
  });
}

function createPaginationToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function addTokenToPaginationCache(link: string): string {
  const token = createPaginationToken();
  console.log("Generated pagination token for next link:", token, link);
  paginationCache.set(token, { link });
  return token;
}

export function validateResponseForPagination(response: FhirBundle): FhirBundle {
  const nextLink = response.link?.find((l) => l.relation === "next")?.url;
  const prevLink = response.link?.find((l) => l.relation === "prev")?.url;

  let responseCopy = { ...response };
  if (nextLink) {
    const token = addTokenToPaginationCache(nextLink);
    responseCopy = { ...responseCopy, paginationTokenNext: token };
  }
  if (prevLink) {
    const token = addTokenToPaginationCache(prevLink);
    responseCopy = { ...responseCopy, paginationTokenPrev: token };
  }
  return responseCopy;
}

export async function fetchPaginatedFhirResource(token: string): Promise<FhirBundle | null> {
  const authToken = await getToken();
  const headers = buildAuthHeaders(authToken);

  const cachedData = paginationCache.get(token);
  console.log("Fetched cached pagination data for token:", token, cachedData);
  if (!cachedData) return null;

  const data = cachedData.link;
  console.log("Fetching paginated FHIR resource from URL:", data);
  const result = await fetchJson(data, { headers });
  console.log("Fetched paginated FHIR resource:", result);
  const validatedResult = validateResponseForPagination(result);
  console.log("Validated paginated FHIR resource:", validatedResult);
  return validatedResult;
}

export async function fetchFhirResource(
  resourceType: string,
  suffix: string = ""
): Promise<any> {
  const token = await getToken();
  return fetchJson(`${FHIR_BASE_URL}/${resourceType}${suffix}`, {
    headers: buildAuthHeaders(token),
  });
}

function transformCanonicalUrlToId(canonicalUrl: string): string {
  const parts = canonicalUrl.split("-");
  return parts[parts.length - 1];
}

function transformCanonicalUrlToResourceType(canonicalUrl: string): string {
  const parts = canonicalUrl.split("/");
  return parts[parts.length - 2];
}

function extractCanonicals(
  items: any[] | undefined,
  pickCanonical: (item: any) => string | undefined
): CanonicalReference[] {
  return (items || [])
    .map((item) => pickCanonical(item))
    .filter(Boolean)
    .map((canonicalUrl) => ({
      id: transformCanonicalUrlToId(canonicalUrl!),
      resourceType: transformCanonicalUrlToResourceType(canonicalUrl!),
    }));
}

export {
  getToken,
  extractCanonicals,
  transformCanonicalUrlToId,
  transformCanonicalUrlToResourceType,
  buildAuthHeaders,
  fetchJson,
};
