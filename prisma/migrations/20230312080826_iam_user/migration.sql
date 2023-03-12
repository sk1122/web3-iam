-- AlterTable
ALTER TABLE "IamUser" ADD COLUMN     "transactionExecuted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transactionVolume" INTEGER NOT NULL DEFAULT 0;
