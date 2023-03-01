/*
  Warnings:

  - A unique constraint covering the columns `[address,projectId]` on the table `IamUser` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `data` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "IamUser_projectId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "data",
ADD COLUMN     "data" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IamUser_address_projectId_key" ON "IamUser"("address", "projectId");
