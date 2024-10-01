/*
  Warnings:

  - You are about to drop the column `EventDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `storageZone` on the `ProductInstance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "EventDate",
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProductInstance" DROP COLUMN "storageZone";
