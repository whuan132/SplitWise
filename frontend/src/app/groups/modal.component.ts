import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Modal, ModalOptions } from 'flowbite';

@Component({
  selector: 'app-modal',
  template: `
    <div>
      <!-- Modal toggle -->
      <button
        *ngIf="button"
        (click)="showModal()"
        data-modal-target="custom-modal"
        class="block text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 w-full max-w-2xl"
        type="button"
      >
        {{ button }}
      </button>

      <!-- Main modal -->
      <div
        id="custom-modal"
        tabindex="-1"
        aria-hidden="true"
        class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div class="relative w-full max-w-md max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              (click)="hideModal()"
              type="button"
              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              id="close-icon"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
            <div class="px-6 py-6 lg:px-8">
              <h3
                class="mb-4 text-xl font-medium text-gray-900 dark:text-white"
              >
                {{ title }}
              </h3>
              <form
                class="space-y-6"
                action="#"
                [formGroup]="form"
                (ngSubmit)="onSubmit()"
              >
                <div *ngFor="let field of fields">
                  <input
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    [placeholder]="field"
                    formControlName="field"
                  />
                </div>
                <button
                  type="submit"
                  class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                  data-modal-hide="custom-modal"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ModalComponent {
  closeModal = '';
  @Input({ required: true, alias: 'title' }) title!: string;
  @Input({ required: true, alias: 'fields' }) fields!: string[];
  @Input({ required: false, alias: 'button' }) button!: string;
  @Output('add') groupName = new EventEmitter<string>();
  form = inject(FormBuilder).group({
    field: ['', [Validators.required, Validators.min(5)]],
  });

  private modal!: Modal;

  onSubmit() {
    console.log(this.form.value.field);
    if (this.form.status === 'VALID') {
      if (this.modal) {
        this.modal.hide();
      }
      this.groupName.emit(this.form.value.field as string);
      this.form.reset();
    } else {
      console.log('invalid form');
    }
  }
  showModal(): void {
    const $modalElement = document.querySelector(
      '#custom-modal'
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
