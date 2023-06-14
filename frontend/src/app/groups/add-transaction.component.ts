import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from './groups.service';

@Component({
  selector: 'app-add-transaction',
  template: `
      <!--    <h2>Add Transaction</h2>-->
      <!--    <form-->
      <!--      class="container"-->
      <!--      [formGroup]="transactionForm"-->
      <!--      (ngSubmit)="addTransaction()"-->
      <!--    >-->
      <!--      <input type="text" placeholder="Title" formControlName="title" />-->
      <!--      <input-->
      <!--        type="text"-->
      <!--        placeholder="Description"-->
      <!--        formControlName="description"-->
      <!--      />-->
      <!--      <input type="text" placeholder="Category" formControlName="category" />-->
      <!--      <input type="number" placeholder="Amount" formControlName="amount" />-->
      <!--      <input type="date" placeholder="Date" formControlName="date" />-->
      <!--      <input-->
      <!--        type="file"-->
      <!--        formControlName="receiptFile"-->
      <!--        accept="image/jpg"-->
      <!--        (change)="pickFile($event)"-->
      <!--      />-->

      <!--      <button type="submit" [disabled]="!transactionForm.valid">-->
      <!--        Add Transaction-->
      <!--      </button>-->
      <!--      <button (click)="goBack()">Back</button>-->
      <!--    </form>-->

      <div>

          <!-- Modal toggle -->
<!--          <button data-modal-target="transaction-modal" data-modal-toggle="transaction-modal"-->
<!--                  class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-3xl px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-full"-->
<!--                  type="button">-->
<!--              +-->
<!--          </button>-->
        <button type="button" data-modal-target="transaction-modal" data-modal-toggle="transaction-modal" data-dial-toggle="speed-dial-menu-default" aria-controls="speed-dial-menu-default" aria-expanded="false" class="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
          <svg aria-hidden="true" class="w-8 h-8 transition-transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          <span class="sr-only">Open actions menu</span>
        </button>

          <!-- Main modal -->
          <div id="transaction-modal" tabindex="-1" aria-hidden="true"
               class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div class="relative w-full max-w-md max-h-full">
                  <!-- Modal content -->
                  <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <button type="button"
                              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                              data-modal-hide="transaction-modal">
                          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"></path>
                          </svg>
                          <span class="sr-only">Close modal</span>
                      </button>
                      <div class="px-6 py-6 lg:px-8">
                          <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sign in to our
                              platform</h3>
                          <form class="space-y-6">
                              <div>
                                  <label for="title"
                                         class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                  <input id="title" name="title" type="text"
                                         class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                         placeholder="name@company.com" required>
                              </div>
                              <div>
                                  <label for="description"
                                         class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                  <input id="description" name="description" type="text"
                                         class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                         placeholder="name@company.com" required>
                              </div>

                              <label for="category"
                                     class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categories</label>
                              <select id="category" name="category"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                  <option>FOOD</option>
                                  <option>GAS</option>
                                  <option>MOVIES</option>
                                  <option>DRINKS</option>
                                  <option>OTHER</option>
                              </select>
                              <div>
                                  <label for="amount"
                                         class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                                  <input id="amount" type="number" name="email"
                                         class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                         placeholder="name@company.com" required>
                              </div>


                              <button type="submit"
                                      class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                  Login to your account
                              </button>

                          </form>
                      </div>
                  </div>
              </div>
          </div>

      </div>
  `,
  styles: [
    `

    `,
  ],
})
export class AddTransactionComponent {
  groupId!: string;
  receipt!: File;
  transactionForm = inject(FormBuilder).group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    amount: ['', Validators.required],
    date: ['', Validators.required],
    receiptFile: '',
  });

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  // ngOnInit() {
  //   this.route.paramMap.subscribe((params) => {
  //     this.groupId = params.get('group_id') as string;
  //   });
  // }

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
        this.goBack();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goBack() {
    this.router.navigate(['', 'groups', 'detail', this.groupId]);
  }
}
