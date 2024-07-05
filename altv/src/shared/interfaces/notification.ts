export enum NotificationType {
  Error = "error",
  Success = "success",
  Info = "info",
  Warning = "warning",
}

export type NotificationSchema = {
  type: NotificationType;
  text: string;
}
