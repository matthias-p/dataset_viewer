import { Injectable } from '@angular/core';

interface Notification {
  message: string,
  classes: string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notification[] = [];

  constructor() { }

  pushNotification(message: string, notificationType: string) {
    let classes = ""
    switch (notificationType) {
      case "info":
        classes = "dark:border-blue-800 dark:text-blue-300 border-blue-300 text-blue-800";
        break;

      case "danger":
        classes = "dark:border-red-800 dark:text-red-300 border-red-300 text-red-800";
        break;

        case "success":
          classes = "dark:border-green-800 dark:text-green-300 border-green-300 text-green-800";
          break;
    
      default:
        break;
    }

    const notification: Notification = {message: message, classes: classes};
    this.notifications.push(notification);

    setTimeout(() => {
      this.notifications.splice(this.notifications.indexOf(notification), 1);
    }, 5000);
  }
}
