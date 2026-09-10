import nextjs from "@prisma/composer/nextjs";
import { compute } from "@prisma/composer-prisma-cloud";
import { postgres } from "@prisma/composer-prisma-cloud/orm";
import { energyGuideData } from "./prisma/data.ts";

export default compute({
  name: "web",
  deps: {
    db: postgres(energyGuideData),
  },
  build: nextjs({ module: import.meta.url, appDir: "." }),
});
