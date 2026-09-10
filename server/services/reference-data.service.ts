import "server-only";
import { prisma } from "@/lib/prisma";

export const referenceDataService = {
  listRegions: () => prisma.region.findMany({ orderBy: { name: "asc" } }),
  listPanels: () => prisma.panelSpec.findMany({ orderBy: { watts: "asc" } }),
  listBatteries: () =>
    prisma.batteryType.findMany({ orderBy: { name: "asc" } }),
  listRoofs: () =>
    prisma.roofOrientation.findMany({ orderBy: { factor: "desc" } }),
  createRegion: (data: { name: string; peakSunHours: number }) =>
    prisma.region.create({ data }),
  updateRegion: (id: string, data: { name: string; peakSunHours: number }) =>
    prisma.region.update({ where: { id }, data }),
  deleteRegion: (id: string) => prisma.region.delete({ where: { id } }),
  createPanel: (data: { watts: number }) => prisma.panelSpec.create({ data }),
  updatePanel: (id: string, data: { watts: number }) =>
    prisma.panelSpec.update({ where: { id }, data }),
  deletePanel: (id: string) => prisma.panelSpec.delete({ where: { id } }),
  createBattery: (data: { name: string; dod: number }) =>
    prisma.batteryType.create({ data }),
  updateBattery: (id: string, data: { name: string; dod: number }) =>
    prisma.batteryType.update({ where: { id }, data }),
  deleteBattery: (id: string) => prisma.batteryType.delete({ where: { id } }),
  createRoof: (data: { name: string; factor: number }) =>
    prisma.roofOrientation.create({ data }),
  updateRoof: (id: string, data: { name: string; factor: number }) =>
    prisma.roofOrientation.update({ where: { id }, data }),
  deleteRoof: (id: string) => prisma.roofOrientation.delete({ where: { id } }),
};
