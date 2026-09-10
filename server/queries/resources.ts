import "server-only";
import { resourcesService } from "@/server/services/resources.service";

export const getResourcesByCategory = (category: string) =>
  resourcesService.listByCategory(category);
