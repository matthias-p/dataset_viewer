import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { 
    const theme = localStorage.getItem("theme");
    if (theme && theme === "dark") {
      this.setDarkTheme();
    }
  }

  switchTheme() {
    const theme = localStorage.getItem("theme")
    if (theme) {
      if (theme === "dark") {
        this.setLightTheme();
      } else {
        this.setDarkTheme();
      }
    } else {
      this.setDarkTheme();
    }
  }

  setDarkTheme() {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  }

  setLightTheme() {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
  }

  getTheme() {
    const theme = localStorage.getItem("theme");
    if (theme && theme === "dark") {
      return "dark";
    }
    return "light";
  }
}
