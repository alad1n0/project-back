/*
  Warnings:

  - You are about to drop the column `country` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `isMain` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `country`,
    DROP COLUMN `postalCode`,
    ADD COLUMN `apartment` VARCHAR(191) NULL,
    ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `flat` VARCHAR(191) NULL,
    ADD COLUMN `floor` VARCHAR(191) NULL,
    ADD COLUMN `house` VARCHAR(191) NULL,
    ADD COLUMN `isMain` BOOLEAN NOT NULL;
