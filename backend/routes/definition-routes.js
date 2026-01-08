import { Router } from "express";
import {
    activityDefinitionByIdController, activityDefinitionByTitleController,
    citationsController, conditionDefinitionByIdController,
    locationController,
    observationDefinitionByIdController, specimenDefinitionByIdController
} from "../controlers/definition-controler.js";
import { fetchFhirResource } from "../services/fhir-service.js";
const router = Router();

router.get("/activity-definitions", activityDefinitionByTitleController);

router.get("/activity-definitions/:id", activityDefinitionByIdController);

router.get("/observation-definitions/:id", observationDefinitionByIdController);

router.get("/specimen-definitions/:id", specimenDefinitionByIdController);

router.get("/condition-definitions/:id", conditionDefinitionByIdController);

router.get("/citations/:observationID", citationsController);

router.get("/locations/:type", locationController);

router.get("/healthcare-services", async (req, res) => {
    const healthcareServices = await fetchFhirResource("HealthcareService","?name:contains=a");
    res.json(healthcareServices);
});

export default router;