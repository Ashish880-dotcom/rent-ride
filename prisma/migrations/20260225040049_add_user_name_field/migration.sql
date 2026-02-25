-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'User';

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");
