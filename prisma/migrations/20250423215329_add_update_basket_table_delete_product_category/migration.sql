/*
  Warnings:

  - You are about to drop the column `productCategoryId` on the `product_basket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `product_basket` DROP FOREIGN KEY `product_basket_productCategoryId_fkey`;

-- DropIndex
DROP INDEX `product_basket_productCategoryId_fkey` ON `product_basket`;

-- AlterTable
ALTER TABLE `product_basket` DROP COLUMN `productCategoryId`;
