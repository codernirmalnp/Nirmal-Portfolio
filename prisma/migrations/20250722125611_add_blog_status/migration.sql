/*
  Warnings:

  - You are about to drop the column `featureImage` on the `Blog` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('PUBLISHED', 'UNPUBLISHED');

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "featureImage",
ADD COLUMN     "status" "BlogStatus" NOT NULL DEFAULT 'UNPUBLISHED';
