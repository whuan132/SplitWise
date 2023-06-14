import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ITransaction} from "./groups.service";
import {StateService} from "../user/state.service";

@Component({
  selector: 'app-transaction',
  template: `
    <div class="max-w-2xl mx-auto">

      <ol class="relative border-l border-gray-200 dark:border-gray-700">
        <li class="mb-10 ml-6" *ngFor="let transaction of transactions">
        <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">

            <svg aria-hidden="true" class="w-3 h-3 text-blue-800 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
        </span>

          <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{{transaction.title}} <span class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3">{{transaction.amount | currency}}</span></h3>
          <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Paid by {{transaction.paid_by.fullname}} on {{transaction.date | date}}</time>
          <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{{transaction.description}}</p>
          <div class="flex items-center space-x-8">
          <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"></path></svg> Download Receipt</a>
          <button class=" bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 text-red-500" *ngIf="state.user()._id===transaction.paid_by.user_id" (click)="removeTransaction(transaction._id)">remove</button>
          </div>
        </li>

      </ol>


    </div>


  `,
  styles: [
  ]
})
export class TransactionComponent {
@Input({required: true, alias:'transactions'}) transactions! : ITransaction[];
@Output('remove') remove= new EventEmitter<string>();
  protected readonly localStorage = localStorage;
  state= inject(StateService)


  removeTransaction(trans_id: string){
    this.remove.emit(trans_id);
  }
}
