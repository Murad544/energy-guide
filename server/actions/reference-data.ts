"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/require-session";
import { referenceDataService } from "@/server/services/reference-data.service";

export type ReferenceKind = "region" | "panel" | "battery" | "roof";

const Name = z.string().trim().min(1).max(100);
const Positive = z.coerce.number().positive();
const Ratio = z.coerce.number().positive().max(1);

function value(formData: FormData, key: string) {
  return formData.get(key);
}

export async function saveReferenceAction(
  kind: ReferenceKind,
  id: string,
  formData: FormData,
): Promise<void> {
  await requireSession();
  if (kind === "region") {
    const data = {
      name: Name.parse(value(formData, "name")),
      peakSunHours: Positive.parse(value(formData, "peakSunHours")),
    };
    if (id) await referenceDataService.updateRegion(id, data);
    else await referenceDataService.createRegion(data);
  }
  if (kind === "panel") {
    const data = {
      watts: z.coerce.number().int().positive().parse(value(formData, "watts")),
    };
    if (id) await referenceDataService.updatePanel(id, data);
    else await referenceDataService.createPanel(data);
  }
  if (kind === "battery") {
    const data = {
      name: Name.parse(value(formData, "name")),
      dod: Ratio.parse(value(formData, "dod")),
    };
    if (id) await referenceDataService.updateBattery(id, data);
    else await referenceDataService.createBattery(data);
  }
  if (kind === "roof") {
    const data = {
      name: Name.parse(value(formData, "name")),
      factor: Ratio.parse(value(formData, "factor")),
    };
    if (id) await referenceDataService.updateRoof(id, data);
    else await referenceDataService.createRoof(data);
  }
  revalidatePath("/dashboard/reference-data");
  revalidatePath("/calculators");
}

export async function deleteReferenceAction(
  kind: ReferenceKind,
  id: string,
  _formData: FormData,
): Promise<void> {
  void _formData;
  await requireSession();
  if (kind === "region") await referenceDataService.deleteRegion(id);
  if (kind === "panel") await referenceDataService.deletePanel(id);
  if (kind === "battery") await referenceDataService.deleteBattery(id);
  if (kind === "roof") await referenceDataService.deleteRoof(id);
  revalidatePath("/dashboard/reference-data");
  revalidatePath("/calculators");
}
