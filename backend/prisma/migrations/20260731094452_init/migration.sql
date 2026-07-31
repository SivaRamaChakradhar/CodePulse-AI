-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "userInput" TEXT NOT NULL,
    "routedModel" TEXT,
    "llmOutput" JSONB,
    "staticAnalysisOutput" JSONB,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
