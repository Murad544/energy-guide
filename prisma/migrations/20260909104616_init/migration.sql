-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "category" TEXT,
    "title" TEXT NOT NULL,
    "intro" TEXT,
    "contentJson" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "peakSunHours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanelSpec" (
    "id" TEXT NOT NULL,
    "watts" INTEGER NOT NULL,

    CONSTRAINT "PanelSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatteryType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dod" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BatteryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofOrientation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RoofOrientation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_category_number_idx" ON "Lesson"("category", "number");

-- CreateIndex
CREATE INDEX "Resource_category_position_idx" ON "Resource"("category", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PanelSpec_watts_key" ON "PanelSpec"("watts");

-- CreateIndex
CREATE UNIQUE INDEX "BatteryType_name_key" ON "BatteryType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoofOrientation_name_key" ON "RoofOrientation"("name");
