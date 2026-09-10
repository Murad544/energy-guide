import { wrap } from "@/lib/api/handler";
import { referenceDataService } from "@/server/services/reference-data.service";
export const GET = wrap(async () => ({
  data: await referenceDataService.listPanels(),
}));
