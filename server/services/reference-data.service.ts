import "server-only";
import { db } from "@/lib/prisma";

const regions = db.orm.public.Region;
const panels = db.orm.public.PanelSpec;
const batteries = db.orm.public.BatteryType;
const roofs = db.orm.public.RoofOrientation;

export const referenceDataService = {
  listRegions: () => regions.orderBy((region) => region.name.asc()).all(),
  listPanels: () => panels.orderBy((panel) => panel.watts.asc()).all(),
  listBatteries: () => batteries.orderBy((battery) => battery.name.asc()).all(),
  listRoofs: () => roofs.orderBy((roof) => roof.factor.desc()).all(),
  createRegion: (data: { name: string; peakSunHours: number }) =>
    regions.create(data),
  updateRegion: (id: string, data: { name: string; peakSunHours: number }) =>
    regions.where({ id }).update(data),
  deleteRegion: (id: string) => regions.where({ id }).delete(),
  createPanel: (data: { watts: number }) => panels.create(data),
  updatePanel: (id: string, data: { watts: number }) =>
    panels.where({ id }).update(data),
  deletePanel: (id: string) => panels.where({ id }).delete(),
  createBattery: (data: { name: string; dod: number }) =>
    batteries.create(data),
  updateBattery: (id: string, data: { name: string; dod: number }) =>
    batteries.where({ id }).update(data),
  deleteBattery: (id: string) => batteries.where({ id }).delete(),
  createRoof: (data: { name: string; factor: number }) => roofs.create(data),
  updateRoof: (id: string, data: { name: string; factor: number }) =>
    roofs.where({ id }).update(data),
  deleteRoof: (id: string) => roofs.where({ id }).delete(),
};
