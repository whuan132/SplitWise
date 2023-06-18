import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService, ITransaction } from './groups.service';
import { Modal, ModalOptions } from 'flowbite';
import { formatDate } from '@angular/common';
import {ToastService} from "../toast.service";

@Component({
  selector: 'app-add-transaction',
  template: `
    <div class="relative mt-10">
    <div class="absolute  -right-5 -bottom-5 mb-2.5">
      <button
        (click)="showModal()"
        type="button"
        data-modal-target="transaction-modal"
        aria-expanded="false"
        class="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
      >
        <svg
          aria-hidden="true"
          class="w-8 h-8 transition-transform group-hover:rotate-45"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
      </button>
    </div>

    <div>
      <!-- Main modal -->
      <div
        id="transaction-modal"
        tabindex="-1"
        aria-hidden="true"
        class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div class="relative w-full max-w-md max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="px-6 py-6 lg:px-8">
              <div class="flex flex-row justify-between items-center p-2">
                <h3
                  class="mb-2 text-xl font-medium text-gray-900 dark:text-white"
                >
                  Add a new Transaction
                </h3>
                <button
                  [disabled]="amount_owed <= 0"
                  (click)="fillPaymentInfo()"
                  class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Settle
                </button>
              </div>

              <form
                class="space-y-6"
                [formGroup]="transactionForm"
                (ngSubmit)="addTransaction()"
              >
                <div>
                  <input
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Title"
                    required
                    formControlName="title"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Description"
                    required
                    formControlName="description"
                  />
                </div>
                <select
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  formControlName="category"
                >
                  <option>FOOD</option>
                  <option>GAS</option>
                  <option>MOVIES</option>
                  <option>DRINKS</option>
                  <option>RENT</option>
                  <option>GROCERIES</option>
                  <option>BILLS</option>
                  <option>PAYBACK</option>
                  <option>OTHERS</option>
                </select>
                <div>
                  <input
                    type="number"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Amount"
                    required
                    formControlName="amount"
                  />
                </div>
                <div class="relative max-w-sm">
                  <input
                    type="date"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Select date"
                    formControlName="date"
                  />
                </div>
                <div class="flex items-center justify-center w-full">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div
                      class="flex flex-col items-center justify-center pt-5 pb-6"
                    >
                      <svg
                        aria-hidden="true"
                        class="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      class="hidden"
                      (change)="pickFile($event)"
                      formControlName="receiptFile"
                    />
                  </label>
                </div>

                <button
                  [disabled]="!transactionForm.valid"
                  type="submit"
                  data-modal-hide="transaction-modal"
                  id="close-icon"
                  class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  Add a Transaction
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  `,
  styles: [``],
})
export class AddTransactionComponent {
  groupId!: string;
  receipt!: File;
  toastService= inject(ToastService)
  @Output('transaction') transaction = new EventEmitter<ITransaction>();
  @Input({ required: true, alias: 'amount_owed' }) amount_owed!: number;
  @Input({ required: true, alias: 'groupName' }) group_name!: string;
  transactionForm = inject(FormBuilder).group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['FOOD', Validators.required],
    amount: ['0', Validators.required],
    date: [this.formatDate(Date.now()), Validators.required],
    receiptFile: [, Validators.required],
  });

  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  private modal!: Modal;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('group_id') as string;
    });
  }

  pickFile(event: Event) {
    const input_element = event.target as HTMLInputElement;
    if (input_element.files) {
      this.receipt = input_element.files[0];
    }
  }

  addTransaction() {
    if (!this.transactionForm.valid) {
      return;
    }

    const form = this.transactionForm.value;
    const form_data = new FormData();
    form_data.append('title', form.title as string);
    form_data.append('description', form.description as string);
    form_data.append('category', form.category as string);
    form_data.append('amount', form.amount as string);
    form_data.append('date', form.date as string);
    form_data.append('receipt', this.receipt);

    this.groupsService.addTransaction(this.groupId, form_data).subscribe(
      (res) => {
        console.log(res);
        this.transaction.emit(res.data as ITransaction);
        this.hideModal();
        this.toastService.showNotification(`transaction added successfully`)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showModal() {
    const $modalElement = document.querySelector(
      '#transaction-modal'
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
    //     modal.hide();
    //   });
  }

  hideModal() {
    this.modal && this.modal.hide();
    this.transactionForm.reset();
  }

  fillPaymentInfo() {
    this.transactionForm.get('title')?.setValue('Payment');
    this.transactionForm.get('category')?.setValue('PAYBACK');
    this.transactionForm.get('amount')?.setValue(this.amount_owed.toString());
    this.transactionForm.get('date')?.setValue(this.formatDate(Date.now()));
    this.transactionForm
      .get('description')
      ?.setValue(
        `Making payment for spend group ${this.group_name} on coinsplit`
      );
  }
  formatDate(date: number) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
