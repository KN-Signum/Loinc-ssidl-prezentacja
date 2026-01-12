import { Router } from "express";
import { activityDefinitionByTitleControllerTerminology, healthcareServiceByIdController, healthcareServicesControllerTerminology } from "../controllers/terminology-controller.js";

const router = Router();

router.get("/activity-definitions", activityDefinitionByTitleControllerTerminology);

router.get("/healthcare-services", healthcareServicesControllerTerminology)
router.get("/healthcare-service/:id", healthcareServiceByIdController)
export default router;
