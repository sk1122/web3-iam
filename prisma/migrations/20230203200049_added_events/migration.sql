-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB[],
    "blockchain" "Blockchain" NOT NULL,
    "projectId" TEXT NOT NULL,
    "iamUserId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iamUserId_fkey" FOREIGN KEY ("iamUserId") REFERENCES "IamUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
