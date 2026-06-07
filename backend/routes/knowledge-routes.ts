import { Router } from "express";
import {
  activityDefinitionByIdController,
  activityDefinitionByTitleController,
  citationsController,
  conditionDefinitionsByActivityDefinitionIdController,
  conditionDefinitionByIdController,
  locationController,
  observationDefinitionByObsIdController,
  observationDefinitionListController,
  specimenDefinitionByIdController,
  ageUnitsController,
} from "../controllers/knowledge-controller.js";

const router = Router();

router.get("/activity-definitions", activityDefinitionByTitleController);

router.get("/activity-definitions/:id", activityDefinitionByIdController);

router.get("/observation-definitions/:obsId", observationDefinitionByObsIdController);

router.get("/observation-definitions-list/:id", observationDefinitionListController);

router.get("/specimen-definitions/:id", specimenDefinitionByIdController);

router.get(
  "/activity-definitions/:id/condition-definitions",
  conditionDefinitionsByActivityDefinitionIdController,
);

router.get("/condition-definitions/:id", conditionDefinitionByIdController);

router.get("/citations/:obsId", citationsController);

router.get("/locations/:type", locationController);

router.get("/age-units", ageUnitsController);


export default router;
