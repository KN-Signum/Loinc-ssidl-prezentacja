import { Router } from "express";
import { activityDefinitionByTitleControllerTerminology, healthcareServiceByIdController, healthcareServicesControllerTerminology } from "../controllers/terminology-controller.js";
import { buildAuthHeaders, fetchFhirResource, fetchJson, getToken } from "../services/fhir-service.js";

const router = Router();

router.get("/activity-definitions", activityDefinitionByTitleControllerTerminology);

router.get("/healthcare-services/location/:locationId", healthcareServicesControllerTerminology)
router.get("/healthcare-service/:id", healthcareServiceByIdController)

router.get("/intake",async (req,res)=>{
    try {
        const intakeResponse = await fetchFhirResource("Location","/$search-intake-points");

        const aggregatedEntries = [...(intakeResponse.entry || [])];
        let nextLink = intakeResponse.link?.find((link: any) => link.relation === "next")?.url;

        if (nextLink) {
            const token = await getToken();
            const headers = buildAuthHeaders(token);
            while (nextLink) {
                const nextPage = await fetchJson(nextLink, { headers });
                aggregatedEntries.push(...(nextPage.entry || []));
                nextLink = nextPage.link?.find((link: any) => link.relation === "next")?.url;
            }

            intakeResponse.entry = aggregatedEntries;
        }
        const resourceOnlyResponse = intakeResponse.entry.map((e :any)=>e.resource)
        res.status(200).json(resourceOnlyResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch intake points" });
    }
});
router.get("/laboratories",async (require,res)=>{
    try {
        const laboratoryResponse = await fetchFhirResource("Location","/$search-laboratories")
        const aggregatedEntries = [...(laboratoryResponse.entry || [])];
        let nextLink = laboratoryResponse.link?.find((link: any) => link.relation === "next")?.url;

        if (nextLink) {
            const token = await getToken();
            const headers = buildAuthHeaders(token);
            while (nextLink) {
                const nextPage = await fetchJson(nextLink, { headers });
                aggregatedEntries.push(...(nextPage.entry || []));
                nextLink = nextPage.link?.find((link: any) => link.relation === "next")?.url;
            }

            laboratoryResponse.entry = aggregatedEntries;
        }
        const resourceOnlyResponse = laboratoryResponse.entry.map((e: any)=>e.resource)
        res.status(200).json(resourceOnlyResponse);
    } catch (error) {
        console.log(error)
    }
})
export default router;
