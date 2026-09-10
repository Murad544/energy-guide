import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "@/prisma/contract.d";
import contractJson from "@/prisma/contract.json" with { type: "json" };
import service from "@/service";

function createDatabase() {
  try {
    return service.load().db.client;
  } catch {
    return postgres<Contract>({
      contractJson,
      url: process.env.DATABASE_URL,
    });
  }
}

export const db = createDatabase();
