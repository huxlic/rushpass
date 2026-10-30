/*
  Warnings:

  - You are about to drop the column `author_id` on the `events` table. All the data in the column will be lost.
  - Added the required column `organizer_id` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_author_id_fkey`;

-- DropIndex
DROP INDEX `events_author_id_fkey` ON `events`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `author_id`,
    ADD COLUMN `organizer_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_organizer_id_fkey` FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
