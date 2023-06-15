import { Component, effect, inject } from '@angular/core';
import { IUser, StateService } from './user/state.service';
import { Router } from '@angular/router';
import {initDials, initTooltips} from "flowbite";

@Component({
  selector: 'app-root',
  template: `
    <div class="flex flex-col h-screen justify-between">
      <router-outlet></router-outlet>
      <app-footer />
    </div>

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

    effect(() => {
      const user = this.stateService.user();
      this.saveStateToLocalStorage(user);
    });
  }
  ngOnInit(): void {

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
