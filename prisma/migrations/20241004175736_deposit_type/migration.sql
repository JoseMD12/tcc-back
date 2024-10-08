/*
  Warnings:

  - Added the required column `type` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "type" "EventType" NOT NULL;
