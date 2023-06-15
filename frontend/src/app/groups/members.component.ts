import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {GroupsService, IGroup, IMember} from "./groups.service";
import {Accordion} from 'flowbite'
import type { AccordionOptions, AccordionItem, AccordionInterface } from "flowbite";


@Component({
  selector: 'app-members',
  template: `
    <div class="max-w-2xl mx-auto space-y-2">
      <div *ngFor="let user of group.members" >
      <h2 id='{{"accordion-heading-"+user.user_id}}'>
        <button type="button" (click)="showMemberDetail('accordion-heading-'+user.user_id)" (dblclick)="closeMemberDetail('accordion-heading-'+user.user_id)" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border  border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" aria-expanded="true" aria-controls="'accordion-example-body">
          <span class="space-x-2">{{user.fullname | titlecase}} <span class="mb-2 text-gray-500 dark:text-gray-400"></span> {{user.email}}</span>
          <button (click)="onRemove(user.email)" class="text-red text-sm">remove</button>
        </button>
      </h2>
      <div id='{{"accordion-body-"+user.user_id}}' class="hidden space-y-2" aria-labelledby="accordion-example-heading-1">
        <div class="p-5 border rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <div class="flex justify-around mb-2.5">
          <div class="flex flex-col justify-center items-center ">
            <p>Total Money Spent by {{user.fullname}}:</p>
            <p class="text-4xl font-bold text-green-500">
              {{ getSpendBy(user.user_id || '') | currency }}
            </p>
          </div>
          <div class="flex flex-col justify-center items-center">
            <p>Total Money {{user.fullname}} Owes:</p>
            <p [class]="colorizeOwe(getOwesBy(user.user_id || ''))">
              {{ getOwesBy(user.user_id || '') | currency }}
            </p>
          </div>
          </div>
          <div class="flex justify-end">
          <a class="cursor-pointer inline-flex justify-center items-center py-2.5 px-5 text-sm text-blue-500  text-center  rounded-lg  hover:ring-blue-800 focus:ring-4 focus:ring-blue-300 ">
            show Transaction
            <svg
              aria-hidden="true"
              class="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>

          </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  `,
  styles: [
  ]
})
export class MembersComponent {

  @Input({required: true, alias: 'group'}) group!: IGroup;
  @Output('remove') removeMember= new EventEmitter<string>();
  accordionItems!: AccordionItem[]
  members! :AccordionInterface;

  onRemove(email:string){
    this.removeMember.emit(email)

  }
  constructor() {
  }
  ngAfterViewInit() {
    console.log(this.group)
    this.accordionItems =this.group.members.map(x=>
    {return{
      id: 'accordion-heading-'+x.user_id,
      triggerEl: document.querySelector('#accordion-heading-'+x.user_id) as HTMLElement,
      targetEl: document.querySelector('#accordion-body-'+x.user_id) as HTMLElement,
      active: false
    }}
    )
    console.log(this.accordionItems)
    const options: AccordionOptions = {
      alwaysOpen: false,
      activeClasses: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
      inactiveClasses: 'text-gray-500 dark:text-gray-400',
      onOpen: (item) => {

      },
      onClose: (item) => {
        return "CLOSED"
      },
      onToggle: (item) => {
        return "TOGGLED"
      },
    };

     this.members = new Accordion(this.accordionItems, options);

// open accordion item based on id

  }

  showMemberDetail(id: string){

    console.log(id)
    this.members.close(id)

  }
  closeMemberDetail(id: string){

    console.log(id)
    this.members.open(id)

  }
  getSpendBy(member: string) {
    let total = 0;
    this.group.transactions
      .filter((x) => x.category !== 'PAYBACK')
      .forEach((t) => {
        if (t.paid_by.user_id == member) {
          total += t.amount;
        }
      });
    return total;
  }
  getSpend() {
    let total = 0;
    this.group.transactions
      .filter((x) => x.category !== 'PAYBACK')
      .forEach((t) => (total += t.amount));

    return total;
  }
  getSpendBywithPayback(member: string) {
    let total = 0;
    this.group.transactions.forEach((t) => {
      if (t.paid_by.user_id == member) {
        total += t.amount;
      }
    });
    return total;
  }

  getOwesBy(member: string) {
    let total = this.getSpend();
    let spend = this.getSpendBywithPayback(member);
    let length = 0;
    this.group.members.forEach((m) => {
      if (!m.pending) {
        length++;
      }
    });
    return total / length - spend;
  }
  colorizeOwe(amount: number): string {
    if (amount <= 0) return 'text-4xl font-bold text-green-500';
    else return 'text-4xl font-bold text-red-500';
  }

}
