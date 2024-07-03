import { createNotifier, NotificationGroup, defineNotificationComponent } from "notiwind";
import type { NotificationType } from "@shared/interfaces";

export type Notification = {
  text: string;
  type: NotificationType;
};

export const notify = createNotifier<Notification>();
export const Notification = defineNotificationComponent<Notification>();
export { NotificationGroup };
