import { Component, effect, inject } from '@angular/core';
import { IUser, StateService } from './user/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <header class="nav_header">
      <!-- after sign in -->
      <nav *ngIf="signed; else signin">
        <a class="nav_link" [routerLink]="['', 'home']">Home</a>
        <a class="nav_link" [routerLink]="['']" (click)="signout()">Sign Out</a>
        <a class="nav_link" [routerLink]="['', 'about']">About</a>
      </nav>
      <!-- before sign in -->
      <ng-template #signin>
        <a class="nav_link" [routerLink]="['', 'home']">Home</a>
        <a class="nav_link" [routerLink]="['', 'signin']">Sign In</a>
        <a class="nav_link" [routerLink]="['', 'signup']">Sign Up</a>
        <a class="nav_link" [routerLink]="['', 'about']">About</a>
      </ng-template>
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
  private stateService = inject(StateService);
  private router = inject(Router);

  constructor() {
    this.loadStateFromLocalStorage();
    // Register a new effect.
    effect(() => {
      const user = this.stateService.user();
      this.saveStateToLocalStorage(user);
    });
  }

  get signed() {
    const user = this.stateService.user();
    return user._id && user.email;
  }

  signout() {
    this.stateService.user.set({
      fullname: '',
      email: '',
      _id: '',
    });
    this.router.navigate(['', 'signin']);
  }

  private loadStateFromLocalStorage(): void {
    const data = localStorage.getItem('split-expenses-app-state-user');
    if (data) {
      this.stateService.user.set(JSON.parse(data) as IUser);
    }
  }

  private saveStateToLocalStorage(user: IUser): void {
    if (user.email === '' || user._id === '') {
      localStorage.clear();
      return;
    }
    localStorage.setItem('split-expenses-app-state-user', JSON.stringify(user));
  }
}
