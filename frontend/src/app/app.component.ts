import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  showSidebar = true;
  theme!: string;

  constructor (private themeService: ThemeService, public notificationService: NotificationService) {}

  ngOnInit() {
    this.theme = this.themeService.getTheme();
  }

  toggleSidebar(showSidebar: boolean) {
    this.showSidebar = showSidebar;
  }

  toggleTheme() {
    this.themeService.switchTheme();
    this.theme = this.themeService.getTheme();
  }
}
