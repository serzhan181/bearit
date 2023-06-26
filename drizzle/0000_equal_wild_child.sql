CREATE TABLE `comment` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`text` text,
	`authorId` varchar(255) NOT NULL,
	`postId` varchar(255) NOT NULL,
	`replyToId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP);
--> statement-breakpoint
CREATE TABLE `commentVote` (
	`userId` varchar(255) NOT NULL,
	`commentId` varchar(255) NOT NULL,
	`vote_type` enum('UP','DOWN'),
	PRIMARY KEY(`commentId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`authorId` varchar(255) NOT NULL,
	`subId` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP);
--> statement-breakpoint
CREATE TABLE `sub` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(16) NOT NULL,
	`creatorId` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`userId` varchar(255) NOT NULL,
	`subId` varchar(255) NOT NULL,
	PRIMARY KEY(`subId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `vote` (
	`userId` varchar(255) NOT NULL,
	`postId` varchar(255) NOT NULL,
	`vote_type` enum('UP','DOWN'),
	PRIMARY KEY(`postId`,`userId`)
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `sub` (`name`);