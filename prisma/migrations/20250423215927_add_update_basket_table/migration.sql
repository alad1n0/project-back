-- DropForeignKey
ALTER TABLE `product_basket` DROP FOREIGN KEY `product_basket_productId_fkey`;

-- DropIndex
DROP INDEX `product_basket_productId_fkey` ON `product_basket`;

-- AddForeignKey
ALTER TABLE `product_basket` ADD CONSTRAINT `product_basket_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `restaurant_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
