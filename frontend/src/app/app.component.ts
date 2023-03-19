import { Component, OnInit } from '@angular/core';
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

  constructor (private themeService: ThemeService) {}

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
