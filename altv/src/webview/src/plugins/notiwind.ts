import { createNotifier, NotificationGroup, defineNotificationComponent } from "notiwind";
import type { NotificationSchema } from "@shared/interfaces";

export const notify = createNotifier<NotificationSchema>();
export const Notification = defineNotificationComponent<NotificationSchema>();
export { NotificationGroup };
