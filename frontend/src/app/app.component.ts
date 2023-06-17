import { Component, effect, inject, OnInit } from '@angular/core';
import { IUser, StateService } from './user/state.service';
import { Router } from '@angular/router';
import { initDials, initTooltips } from 'flowbite';

@Component({
  selector: 'app-root',
  template: `
    <div class="flex flex-col h-screen md:justify-between">
      <div class="self-start w-full">
        <router-outlet></router-outlet>
      </div>
      <app-footer />
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
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
