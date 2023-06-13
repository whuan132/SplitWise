import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="nav_header">
      <nav>
        <a class="nav_link" [routerLink]="['', 'home']">Home</a>

        <a class="nav_link" [routerLink]="['', 'signin']">Sign In</a>
        <a class="nav_link" [routerLink]="['', 'signup']">Sign Up</a>
        <a class="nav_link" [routerLink]="['']" (click)="signout()">Sign Out</a>

        <a class="nav_link" [routerLink]="['', 'about']">About</a>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .nav_header {
        margin-bottom: 15px;
      }
      .nav_link {
        margin-right: 10px;
      }
    `,
  ],
})
export class AppComponent {
  signout() {}
}
