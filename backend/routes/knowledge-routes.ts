import { Router } from "express";
import {
  activityDefinitionByIdController,
  activityDefinitionByTitleController,
  citationsController,
  conditionDefinitionByIdController,
  locationController,
  observationDefinitionByIdController,
  specimenDefinitionByIdController,
} from "../controllers/knowledge-controller.js";
import { fetchFhirResource } from "../services/fhir-service.js";

const router = Router();

router.get("/activity-definitions", activityDefinitionByTitleController);

router.get("/activity-definitions/:id", activityDefinitionByIdController);

router.get("/observation-definitions/:id", observationDefinitionByIdController);

router.get("/specimen-definitions/:id", specimenDefinitionByIdController);

router.get("/condition-definitions/:id", conditionDefinitionByIdController);

router.get("/citations/:observationID", citationsController);

router.get("/locations/:type", locationController);


export default router;
