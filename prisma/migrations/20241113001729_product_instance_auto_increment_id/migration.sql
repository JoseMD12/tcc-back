/*
  Warnings:

  - The primary key for the `ProductInstance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductInstance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `productInstanceId` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_productInstanceId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "productInstanceId",
ADD COLUMN     "productInstanceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductInstance" DROP CONSTRAINT "ProductInstance_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProductInstance_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_productInstanceId_fkey" FOREIGN KEY ("productInstanceId") REFERENCES "ProductInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
