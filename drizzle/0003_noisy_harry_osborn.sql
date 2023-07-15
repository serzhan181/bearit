ALTER TABLE `post` RENAME COLUMN `imageUrl` TO `images`;--> statement-breakpoint
ALTER TABLE `sub` RENAME COLUMN `imageUrl` TO `images`;--> statement-breakpoint
ALTER TABLE `post` MODIFY COLUMN `images` json DEFAULT ('null');--> statement-breakpoint
ALTER TABLE `sub` MODIFY COLUMN `images` json DEFAULT ('null');