import { Component, inject } from '@angular/core';
import { StateService } from '../user/state.service';
import { Router } from '@angular/router';
import {Modal, ModalOptions} from "flowbite";
import {ToastService} from "../toast.service";

@Component({
  selector: 'app-header',
  template: `
    <div class=" max-w-3xl">
      <nav
        class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600"
      >
        <div
          class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
        >
          <a href="https://flowbite.com/" class="flex items-center">
            <img
              src="../../assets/images/logo.png"
              class="h-8 mr-3"
              alt="Flowbite Logo"
            />
            <span
              class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
              >CoinSplit</span
            >
          </a>
          <div class="flex md:order-2">
            <button
              type="button"
              data-modal-target="popup-modal"
              class="text-white bg-blue-700  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              (click)="signout()"
            >
              SignOut
            </button>








          </div>
          <div
            class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul
              class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
            >
              <li>
                <a
                  [routerLink]="['', 'groups']"
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >Home</a
                >
              </li>

              <li>
                <a
                  [routerLink]="['','about']"
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >About</a
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  `,
  styles: [],
})
export class HeaderComponent {
  private modal!: Modal;
  toast= inject(ToastService)

  stateService = inject(StateService);
  router = inject(Router);
  constructor() {}
  signout() {
    this.stateService.user.set({
      fullname: '',
      email: '',
      _id: '',
      token: '',
    });
    this.router.navigate(['', 'signin']);
    this.toast.showNotification('Goodbye,👋')
  }
  showModal(): void {
    const $modalElement = document.querySelector(
      '#popup-modal'
    ) as HTMLElement;

    const modalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses:
        'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
      onHide: () => {
        console.log('modal is hidden');
      },
      onShow: () => {
        console.log('modal is shown');
      },
      onToggle: () => {
        console.log('modal has been toggled');
      },
    };

    this.modal = new Modal($modalElement, modalOptions as ModalOptions);
    this.modal._init();
    this.modal.show();

    // const icon = document.getElementById('close-icon');
    // if (icon)
    //   icon.addEventListener('click', () => {
    //     this.modal.hide();
    //   });
  }

  hideModal() {
    if (this.modal) {
      this.modal.hide();
    }
  }

}
