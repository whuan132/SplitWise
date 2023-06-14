import {Component, inject} from '@angular/core';
import { initDials, initTooltips } from 'flowbite';
import {ToastService} from "./toast.service";

@Component({
  selector: 'app-root',
  template: `
    <app-toast *ngIf="toast.showToast()" [content]="toast.toastContent()"/>

    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  toast= inject(ToastService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    initTooltips();
    initDials();
  }
}
