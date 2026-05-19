CREATE INDEX `account_user_id_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `api_keys_user_id_idx` ON `api_keys` (`user_id`);--> statement-breakpoint
CREATE INDEX `email_user_id_idx` ON `email` (`userId`);--> statement-breakpoint
CREATE INDEX `message_email_id_received_at_type_idx` ON `message` (`emailId`,`received_at`,`type`);--> statement-breakpoint
CREATE INDEX `user_role_user_id_idx` ON `user_role` (`user_id`);--> statement-breakpoint
CREATE INDEX `webhook_user_id_idx` ON `webhook` (`user_id`);