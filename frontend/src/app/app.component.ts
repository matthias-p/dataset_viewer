import { Component } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  showSidebar = true;
  theme!: string;

  constructor (private themeService: ThemeService) {}

  ngOnInit() {
    this.theme = this.themeService.getTheme();
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  toggleTheme() {
    this.themeService.switchTheme();
    this.theme = this.themeService.getTheme();
  }
}
