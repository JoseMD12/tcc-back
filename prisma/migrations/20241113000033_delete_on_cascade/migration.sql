-- DropForeignKey
ALTER TABLE "ProductInstance" DROP CONSTRAINT "ProductInstance_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOrder" DROP CONSTRAINT "ProductOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOrder" DROP CONSTRAINT "ProductOrder_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductInstance" ADD CONSTRAINT "ProductInstance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
