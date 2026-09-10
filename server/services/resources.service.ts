import "server-only";
import { db } from "@/lib/prisma";

const resources = db.orm.public.Resource;

export const resourcesService = {
  listByCategory: (category: string) =>
    resources
      .where({ category })
      .orderBy((resource) => resource.position.asc())
      .all(),
  listAll: () =>
    resources
      .orderBy([
        (resource) => resource.category.asc(),
        (resource) => resource.position.asc(),
      ])
      .all(),
};
