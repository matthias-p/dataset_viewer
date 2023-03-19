import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() toggleSidebarEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  showSidebar = true;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    this.toggleSidebarEvent.emit(this.showSidebar);
  }
}
