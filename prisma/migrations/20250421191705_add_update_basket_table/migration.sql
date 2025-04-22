/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,productCategoryId,restaurantId]` on the table `product_basket` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `product_basket` DROP FOREIGN KEY `product_basket_userId_fkey`;

-- DropIndex
DROP INDEX `product_basket_userId_productId_key` ON `product_basket`;

-- CreateIndex
CREATE UNIQUE INDEX `product_basket_userId_productId_productCategoryId_restaurant_key` ON `product_basket`(`userId`, `productId`, `productCategoryId`, `restaurantId`);

-- AddForeignKey
ALTER TABLE `product_sizes` ADD CONSTRAINT `product_sizes_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
