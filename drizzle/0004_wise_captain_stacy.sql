ALTER TABLE `sub` RENAME COLUMN `images` TO `coverImages`;--> statement-breakpoint
ALTER TABLE `sub` ADD `backgroundImages` json DEFAULT ('null');