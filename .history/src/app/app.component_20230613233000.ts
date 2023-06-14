import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <p class="text-red-500">Hello</p>
    </div>
   P
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'splitExpense';
}
