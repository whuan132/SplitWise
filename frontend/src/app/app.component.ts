import { Component, effect, inject } from '@angular/core';
import { IUser, StateService } from './user/state.service';
import { Router } from '@angular/router';
import {initDials, initTooltips} from "flowbite";

@Component({
  selector: 'app-root',
  template: `

<!--    <header class="nav_header">-->
<!--      &lt;!&ndash; after sign in &ndash;&gt;-->
<!--      <nav *ngIf="signed; else signin">-->
<!--        <a class="nav_link" [routerLink]="['', 'home']">Home</a>-->

<!--        <a class="nav_link" [routerLink]="['', 'groups']">Goups</a>-->

<!--        <a class="nav_link" [routerLink]="['']" (click)="signout()">Sign Out</a>-->
<!--        <a class="nav_link" [routerLink]="['', 'about']">About</a>-->
<!--      </nav>-->
<!--      &lt;!&ndash; before sign in &ndash;&gt;-->
<!--      <ng-template #signin>-->
<!--        <a class="nav_link" [routerLink]="['', 'home']">Home</a>-->
<!--        <a class="nav_link" [routerLink]="['', 'signin']">Sign In</a>-->
<!--        <a class="nav_link" [routerLink]="['', 'signup']">Sign Up</a>-->
<!--        <a class="nav_link" [routerLink]="['', 'about']">About</a>-->
<!--      </ng-template>-->
<!--    </header>-->
    <router-outlet></router-outlet>
  `,
  styles: [
    `

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
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    initTooltips();
    initDials();
  }

  get signed() {
    const user = this.stateService.user();
    return user._id && user.email && user.token;
  }

  signout() {
    this.stateService.user.set({
      fullname: '',
      email: '',
      _id: '',
      token: '',
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
    if (!this.signed) {
      localStorage.clear();
      return;
    }
    localStorage.setItem('split-expenses-app-state-user', JSON.stringify(user));
  }
}
