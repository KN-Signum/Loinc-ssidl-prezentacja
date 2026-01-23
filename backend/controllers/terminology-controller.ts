import { Request, Response } from "express";
import {
  fetchFhirResource,
  fetchPaginatedFhirResource,
} from "../services/fhir-service.js";
import { getActivityDefinitionsByTitle } from "../services/activity-definition.js";

export const activityDefinitionByTitleControllerTerminology = async (
  req: Request,
  res: Response
) => {
  try {
    const { title = "", token } = req.query;
    console.log("Received title:", title);
    console.log("Received token:", token);
    if (token) {
      const result = await fetchPaginatedFhirResource(token as string);
      res.status(200).json(result);
      return;
    }
    const result = await getActivityDefinitionsByTitle(title as string, false);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching activity definitions:", error);
    res.status(500).json({ error });
  }
};
export const healthcareServicesControllerTerminology = async(req:Request,res:Response) =>{
  try {
    const {locationId} = req.params
    console.log(locationId)
    const healthcareServices = await fetchFhirResource(
        "HealthcareService",
        `?location=Location/${locationId}`
      );
      res.json(healthcareServices);
  } catch (error) {
    res.status(500).json({error})
  }
}

export const healthcareServiceByIdController = async(req:Request,res:Response) =>{
  try {
    const {id} = req.params
    const healthcareService = await fetchFhirResource(
      "HealthcareService",
      `/${id}/$everything`
    )
    res.json(healthcareService)
  } catch (error) {
    res.status(500).json({error})
  }
}