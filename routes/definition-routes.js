import { Router } from "express";
import {
    activityDefinitionByIdController, activityDefinitionByTitleController,
    citationsController, conditionDefinitionByIdController,
    observationDefinitionByIdController, specimenDefinitionByIdController
} from "../controlers/definition-controler.js";
const router = Router();

router.get("/activity-definitions", activityDefinitionByTitleController);

router.get("/activity-definitions/:id", activityDefinitionByIdController);

router.get("/observation-definitions/:id", observationDefinitionByIdController);

router.get("/specimen-definitions/:id", specimenDefinitionByIdController);

router.get("/condition-definitions/:id", conditionDefinitionByIdController);

router.get("/citations", citationsController);


export default router;