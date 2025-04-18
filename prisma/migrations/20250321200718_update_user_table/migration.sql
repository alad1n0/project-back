/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `role` ENUM('USER', 'DRIVER', 'RESTAURANT', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX `users_phone_key` ON `users`(`phone`);
