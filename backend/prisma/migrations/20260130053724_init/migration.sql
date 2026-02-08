-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transakSessionId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD';

-- CreateIndex
CREATE INDEX "transactions_transakSessionId_idx" ON "transactions"("transakSessionId");
