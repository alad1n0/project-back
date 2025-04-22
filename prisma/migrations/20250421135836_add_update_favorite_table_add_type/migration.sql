/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `favorites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `favorites` DROP FOREIGN KEY `favorites_restaurantId_fkey`;

-- DropIndex
DROP INDEX `favorites_restaurantId_fkey` ON `favorites`;

-- AlterTable
ALTER TABLE `favorites` ADD COLUMN `productId` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    MODIFY `restaurantId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `favorites_userId_productId_key` ON `favorites`(`userId`, `productId`);

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `restaurant_products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
