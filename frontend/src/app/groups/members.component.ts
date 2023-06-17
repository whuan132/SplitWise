import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IGroup } from './groups.service';
import { Accordion } from 'flowbite';
import type {
  AccordionOptions,
  AccordionItem,
  AccordionInterface,
} from 'flowbite';
import { IGroupResult } from '../utils/GroupHelper';

@Component({
  selector: 'app-members',
  template: `
    <div class="max-w-2xl mx-auto space-y-2">
      <div *ngFor="let user of group.members">
        <h2 id="{{ 'accordion-heading-' + user.user_id }}">
          <button
            (click)="showMemberDetail('accordion-heading-' + user.user_id)"
            (dblclick)="closeMemberDetail('accordion-heading-' + user.user_id)"
            type="button"
            class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border  border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-expanded="true"
            aria-controls="'accordion-example-body"
          >
            <div class="inline-flex flex-row">
              <span class="space-x-2">
                {{ user.fullname | titlecase }} {{ user.email }}
              </span>
              <span
                *ngIf="user.pending"
                class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3 cursor-pointer"
              >
                Pending
              </span>
            </div>
            <button (click)="onRemove(user.email)" class="text-red text-sm">
              remove
            </button>
          </button>
        </h2>
        <div
          id="{{ 'accordion-body-' + user.user_id }}"
          class="hidden space-y-2"
          aria-labelledby="accordion-example-heading-1"
        >
          <div
            *ngIf="result.members[user.user_id || '']"
            class="p-5 border rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900"
          >
            <div class="flex justify-around mb-2.5">
              <div class="flex flex-col justify-center items-center ">
                <p>Spent:</p>
                <p class="text-4xl font-bold text-green-500">
                  {{ result.members[user.user_id || ''].spend | currency }}
                </p>
              </div>
              <div class="flex flex-col justify-center items-center">
                <p>Owe:</p>
                <p
                  [class]="colorizeOwe(result.members[user.user_id || ''].owes)"
                >
                  {{ result.members[user.user_id || ''].owes | currency }}
                </p>
              </div>
            </div>
            <div class="flex justify-end">
              <a
                (click)="showMembers(user.user_id)"
                class="cursor-pointer inline-flex justify-center items-center py-2.5 px-5 text-sm text-blue-500  text-center  rounded-lg  hover:ring-blue-800 focus:ring-4 focus:ring-blue-300 "
              >
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
  styles: [],
})
export class MembersComponent implements AfterViewInit {
  @Input({ required: true, alias: 'group' }) group!: IGroup;
  @Input({ required: true, alias: 'groupResult' }) result!: IGroupResult;
  @Output('remove') removeMember = new EventEmitter<string>();
  @Output('showMemberTransaction') showMemberTransaction =
    new EventEmitter<string>();

  accordionItems!: AccordionItem[];
  members!: AccordionInterface;

  onRemove(email: string) {
    this.removeMember.emit(email);
  }

  ngAfterViewInit() {
    console.log(this.group);
    this.accordionItems = this.group.members.map((x) => {
      return {
        id: 'accordion-heading-' + x.user_id,
        triggerEl: document.querySelector(
          '#accordion-heading-' + x.user_id
        ) as HTMLElement,
        targetEl: document.querySelector(
          '#accordion-body-' + x.user_id
        ) as HTMLElement,
        active: false,
      };
    });
    console.log(this.accordionItems);
    const options: AccordionOptions = {
      alwaysOpen: false,
      activeClasses:
        'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
      inactiveClasses: 'text-gray-500 dark:text-gray-400',
      onOpen: (item) => {},
      onClose: (item) => {
        return 'CLOSED';
      },
      onToggle: (item) => {
        return 'TOGGLED';
      },
    };

    this.members = new Accordion(this.accordionItems, options);

    // open accordion item based on id
  }

  showMemberDetail(id: string) {
    if (!this.result.members[id]) {
      return;
    }
    console.log(id);
    this.members.close(id);
  }

  closeMemberDetail(id: string) {
    if (!this.result.members[id]) {
      return;
    }
    console.log(id);
    this.members.open(id);
  }

  colorizeOwe(amount: number): string {
    if (amount <= 0) return 'text-4xl font-bold text-green-500';
    else return 'text-4xl font-bold text-red-500';
  }

  showMembers(id: string | undefined) {
    this.showMemberTransaction.emit(id as string);
  }
}
