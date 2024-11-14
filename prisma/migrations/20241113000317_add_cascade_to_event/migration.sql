-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_depositId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_productInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOrder" DROP CONSTRAINT "ProductOrder_orderId_fkey";

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_productInstanceId_fkey" FOREIGN KEY ("productInstanceId") REFERENCES "ProductInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
