import {
  createNotifier,
  NotificationGroup,
  defineNotificationComponent,
} from "notiwind";

export enum NotificationTypes {
  Error = 'error',
  Success = 'success',
  Info = 'info',
  Warning = 'warning'
}

export type NotificationSchema = {
  text: string;
  type: NotificationTypes;
};

export const notify = createNotifier<NotificationSchema>();
export const Notification = defineNotificationComponent<NotificationSchema>();
export { NotificationGroup };