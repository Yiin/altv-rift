export enum NotificationType {
    Error = 'error',
    Success = 'success',
    Info = 'info'
};

export interface Notification {
    key: string;
    type: NotificationType;
    title: string;
    text: string;
}
