import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { GroupsService, ITransaction } from './groups.service';
import { StateService } from '../user/state.service';

@Component({
  selector: 'app-transaction',
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="mt-5 flex items-center space-x-2 justify-between ">
        <div class="flex space-x-2 items-center">
          <p class="block text-sm font-medium text-gray-900 dark:text-white">
            Filters:
          </p>
          <div class="flex space-x-2">
            <button
              type="button"
              class="text-gray-900 border border-gray-300  hover:border-gray-200  bg-white focus:ring-2 text-xs focus:outline-none  rounded-full  font-medium px-2  text-center  focus:ring-gray-800"
              (click)="filter('')"
            >
              All
            </button>

            <div class="flex" *ngFor="let category of categories">
              <button
                type="button"
                class="text-gray-900 border border-gray-300 py-1 px-3 hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-full text-xs font-medium  text-center dark:text-white dark:focus:ring-gray-800"
                (click)="filter(category)"
              >
                {{ category | titlecase }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="flex space-x-2 items-center">
            <p class="block text-sm font-medium text-gray-900 dark:text-white">
              SortBy:
            </p>
            <select
              class="bg-gray-50  border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              (change)="sortTransactions(Sort.value)"
              #Sort
            >
              <option>Highest price</option>
              <option>Lowest price</option>
              <option>Oldest</option>
              <option>Newest</option>
              <option [defaultSelected]="true">None</option>
            </select>
          </div>
        </div>
      </div>
      <hr class="my-4" />
      <div *ngIf="!transactions.length" class="my-36 text-xl text-gray-600 flex justify-center">
        <p>NO TRASNSACTIONS HAS BEEN MADE IN THIS GROUP.</p>

      </div>
      <ol class="m-2 relative border-l border-gray-200 dark:border-gray-700">

        <li
          class="mb-10 ml-6"
          *ngFor="let transaction of transactions_filter || transactions"
        >

          <span
            class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"
          >
            <svg
              aria-hidden="true"
              class="w-3 h-3 text-blue-800 dark:text-blue-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>

          <h3
            class="flex items-center  text-lg font-semibold text-gray-900 dark:text-white"
          >
            {{ transaction.title }}
            <span
              class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3 cursor-pointer"
              (click)="filter(transaction.category)"
              >{{ transaction.category }}</span
            >
          </h3>
          <time
            class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
            >Paid by<span
              class="hover:text-blue-600 cursor-pointer"
              (click)="filterByUser(transaction.paid_by.user_id)"
            >
              {{ transaction.paid_by.fullname }}</span
            >
            on {{ transaction.date | date }}</time
          >
          <p
            class="mb-4 text-xl  font-bold text-gray-500 dark:text-gray-400 line-clamp-2"
          >
            {{ transaction.amount | currency }}
          </p>
          <p
            class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-2"
          >
            {{ transaction.description }}
          </p>
          <div class="flex items-center space-x-8">
            <button
              (click)="downloadReceipt(transaction._id)"
              class="inline-flex items-center px-4 py-2 text-sm font-medium
              text-gray-900 bg-white border border-gray-200 rounded-lg
              hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4
              focus:outline-none focus:ring-gray-200 focus:text-blue-700
              dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600
              dark:hover:text-white dark:hover:bg-gray-700
              dark:focus:ring-gray-700"
            >
              <svg
                class="w-4 h-4 "
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Download Receipt
            </button>
            <button
              class=" bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2 mr-2  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 text-red-500"
              *ngIf="state.user()._id === transaction.paid_by.user_id"
              (click)="removeTransaction(transaction._id)"
            >
              remove
            </button>
          </div>
        </li>
      </ol>
    </div>
  `,
  styles: [],
})
export class TransactionComponent implements OnInit {
  @Input({ required: true }) groupId!: string;
  @Input({ required: true }) filterUser!: string;
  @Input({ required: true, alias: 'transactions' })
  transactions!: ITransaction[];
  @Output('remove')
  remove = new EventEmitter<string>();

  categories: Set<string> = new Set();
  transactions_filter!: ITransaction[];
  category_filter!: string;

  state = inject(StateService);
  private groupsService = inject(GroupsService);

  ngOnInit() {
    this.transactions.forEach((trans) => {
      this.categories.add(trans.category);
    });
    console.log(this.categories);
    if (this.filterUser) {
      this.transactions_filter = this.transactions.filter(
        (trans) => trans.paid_by.user_id === this.filterUser
      );
    }
  }
  filter(category: string) {
    this.category_filter = category;
    if (category === '') {
      this.transactions_filter = this.transactions;
    } else {
      this.transactions_filter = this.transactions.filter((x) => {
        return x.category === category;
      });
    }
  }

  removeTransaction(trans_id: string) {
    this.remove.emit(trans_id);
  }
  sortTransactions(value: string) {
    this.transactions_filter = structuredClone(this.transactions);
    switch (value) {
      case 'Highest price':
        this.transactions_filter.sort((x, y) => y.amount - x.amount);
        break;
      case 'Lowest price':
        this.transactions_filter.sort((x, y) => x.amount - y.amount);
        break;
      case 'Oldest':
        this.transactions_filter.sort((x, y) => {
          console.log(y.date - x.date);
          return x.date - y.date;
        });

        break;
      case 'Newest':
        this.transactions_filter.sort((x, y) => y.date - x.date);
        break;
      case 'None':
        break;
    }
  }

  downloadReceipt(transaction_id: string) {
    this.groupsService.downloadReceipt(this.groupId, transaction_id).subscribe(
      (res) => {
        console.log(res);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(res);
        link.download = 'image.jpg';
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  filterByUser(id: string) {
    this.filterUser = id;
    if (this.filterUser) {
      this.transactions_filter = this.transactions.filter(
        (trans) => trans.paid_by.user_id === this.filterUser
      );
    }
  }
}
