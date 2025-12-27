-- CreateTable
CREATE TABLE "ProductAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productName" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "usageScenario" TEXT NOT NULL,
    "priceRange" TEXT,
    "coreFeatures" TEXT NOT NULL,
    "marketingPoints" TEXT NOT NULL,
    "platformAdvice" TEXT NOT NULL,
    "fullReport" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ReferenceTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceTag_category_value_key" ON "ReferenceTag"("category", "value");
