-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `banner` VARCHAR(191) NULL,
    ADD COLUMN `cookingTime` INTEGER NULL,
    ADD COLUMN `deliveryPrice` DOUBLE NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `minimumOrderPrice` DOUBLE NULL,
    ADD COLUMN `workingHours` VARCHAR(191) NULL;
