import "server-only";
import { referenceDataService } from "@/server/services/reference-data.service";

export const listRegions = () => referenceDataService.listRegions();
export const listPanels = () => referenceDataService.listPanels();
export const listBatteries = () => referenceDataService.listBatteries();
export const listRoofs = () => referenceDataService.listRoofs();
