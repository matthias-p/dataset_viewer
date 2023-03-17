import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeObs$: ReplaySubject<string> = new ReplaySubject<string>(1);

  constructor() { 
    const theme = localStorage.getItem("theme");
    if (theme && theme === "dark") {
      this.setDarkTheme();
    }

    this.themeObs$.next(this.getTheme());
  }

  getThemeObs(): Observable<string> {
    return this.themeObs$.asObservable();
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

    this.themeObs$.next(this.getTheme());
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
