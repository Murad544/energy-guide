import { module } from "@prisma/composer";
import { postgres } from "@prisma/composer-prisma-cloud/orm";
import { energyGuideData } from "./prisma/data.ts";
import webService from "./service.ts";

export default module("energy-guide", ({ provision }) => {
  const database = provision(
    postgres({
      name: "database",
      contract: energyGuideData,
      config: "./prisma.config.ts",
    }),
    { id: "database" },
  );

  provision(webService, { id: "web", deps: { db: database } });
});
