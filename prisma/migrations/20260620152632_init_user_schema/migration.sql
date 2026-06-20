-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `primaryMobile` VARCHAR(191) NOT NULL,
    `secondaryMobile` VARCHAR(191) NULL,
    `aadhaar` VARCHAR(12) NOT NULL,
    `pan` VARCHAR(10) NOT NULL,
    `dateOfBirth` DATE NOT NULL,
    `placeOfBirth` VARCHAR(191) NULL,
    `currentAddress` TEXT NOT NULL,
    `permanentAddress` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_primaryMobile_key`(`primaryMobile`),
    UNIQUE INDEX `User_aadhaar_key`(`aadhaar`),
    UNIQUE INDEX `User_pan_key`(`pan`),
    INDEX `User_isDeleted_idx`(`isDeleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
