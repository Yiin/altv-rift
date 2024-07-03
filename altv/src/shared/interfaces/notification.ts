export enum NotificationType {
  Error = "error",
  Success = "success",
  Info = "info",
  Warning = "warning",
}

export interface Notification {
  type: NotificationType;
  text: string;
}
