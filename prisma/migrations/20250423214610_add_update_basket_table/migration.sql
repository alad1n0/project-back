-- DropForeignKey
ALTER TABLE `product_basket` DROP FOREIGN KEY `product_basket_userId_fkey`;

-- DropIndex
DROP INDEX `product_basket_userId_productId_key` ON `product_basket`;

-- AlterTable
ALTER TABLE `product_basket` ADD COLUMN `sessionId` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `product_basket_userId_idx` ON `product_basket`(`userId`);

-- CreateIndex
CREATE INDEX `product_basket_sessionId_idx` ON `product_basket`(`sessionId`);

-- AddForeignKey
ALTER TABLE `product_basket` ADD CONSTRAINT `product_basket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
