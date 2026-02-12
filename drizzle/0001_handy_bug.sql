ALTER TABLE "notifications" RENAME COLUMN "todo_id" TO "task_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_todo_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;