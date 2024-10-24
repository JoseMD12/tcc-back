/*
  Warnings:

  - You are about to drop the column `storageZones` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "storageZones";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "updatedAt";
