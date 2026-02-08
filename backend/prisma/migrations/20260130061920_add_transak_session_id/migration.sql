/*
  Warnings:

  - A unique constraint covering the columns `[transakSessionId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "transactions_transakOrderId_key";

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transakSessionId_key" ON "transactions"("transakSessionId");
