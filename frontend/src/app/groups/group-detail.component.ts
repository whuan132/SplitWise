import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { GroupsService, IGroup, IMember } from './groups.service';
import { StateService } from '../user/state.service';
import {initDials, initTooltips} from "flowbite";

@Component({
  selector: 'app-group-detail',
  template: `
      <div class="mt-96" *ngIf="!group; else details">
          <div role="status" class=" flex w-full h-full justify-center items-center">
              <svg aria-hidden="true"
                   class="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                   viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"/>
              </svg>
              <span class="sr-only">Loading...</span>
          </div>
      </div>

      <app-header/>
      <ng-template #details>
          <div class="mt-20 max-w-4xl mx-auto">

              <section class="bg-white dark:bg-gray-900">
                  <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
                      <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">

                          <h1 class="text-gray-900 dark:text-white text-3xl md:text-5xl font-extrabold mb-2">{{group.title}}</h1>
                          <div class=" flex border border-gray-300 rounded-lg p-5 m-5 justify-around">
                              <div class="flex flex-col justify-center items-center">
                                  <p>Total Money Spent:</p>
                                  <p class="text-4xl font-bold text-red-500"> {{getSpend()| currency}}</p>

                              </div>
                              <div class="flex flex-col justify-center items-center">
                                  <p>Total Money Spent by you:</p>
                                  <p class="text-4xl font-bold text-green-500"> {{getSpendBy(stateService.user()._id)|currency}}</p>

                              </div>
                              <div class="flex flex-col justify-center items-center">
                                  <p>Total Money You Owe:</p>
                                  <p [class]="colorizeOwe(getOwesBy(stateService.user()._id))">{{getOwesBy(stateService.user()._id)| currency}}</p>

                              </div>

                          </div>
                          <a (click)="showMembers=true; showTrasactions=false"
                             class=" mb-4 cursor-pointer inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                              show Members
                              <svg aria-hidden="true" class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                   xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd"
                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                        clip-rule="evenodd"></path>
                              </svg>
                          </a>

                          <p class="text-lg font-normal  text-gray-500 dark:text-gray-400 line-clamp-2">Static websites
                              are now used to bootstrap lots of websites and are becoming the basis for a variety of
                              tools that even influence both web designers and developers.</p>

                      </div>

                      <!-- Modal toggle -->

                      <div class="grid md:grid-cols-2 gap-8">


                      </div>
                  </div>
              </section>
          </div>
          <div class="max-w-2xl mx-auto mb-10">

              <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                  <ul class="flex flex-wrap -mb-px justify-around">
                      <li class="mr-2">
                          <a (click)="showTrasactions=true; showMembers=false"
                             class=" cursor-pointer inline-block p-4 hover:text-blue-600 active:border-b-2 border-blue-600 rounded-t-lg  active:text-blue-500 active:border-blue-500"
                             aria-current="page">Transactions</a>
                      </li>
                      <li class="mr-2">
                          <a (click)="showTrasactions=false; showMembers=true"
                             class=" cursor-pointer inline-block p-4 hover:text-blue-600 active:border-b-2 border-blue-600 rounded-t-lg  active:text-blue-500 active:border-blue-500"
                             aria-current="page">Members</a>
                      </li>

                  </ul>
              </div>

          </div>

          <div class="w-full">
              <app-transaction [transactions]="group.transactions" (remove)="deleteTransaction($event)"
                               *ngIf="showTrasactions"/>
              <app-members [members]="group.members" *ngIf="showMembers" (remove)="deleteMember($event)"/>
              <div class="mt-10 max-w-2xl mx-auto flex justify-end">
                <app-add-transaction *ngIf="!showMembers "/>
               <app-invite-member *ngIf="showMembers"/>
              </div>
          </div>
      </ng-template>

  `,
  styles: [
    `

    `,
  ],
})
export class GroupDetailComponent {
  showTrasactions=true;
  showMembers=false
  group!: IGroup;
  groupId!: string;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);
   stateService = inject(StateService);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('group_id') as string;
      this.loadGroupDetails();
    });

    initTooltips();
    initDials();
  }

  private loadGroupDetails() {
    this.groupsService.getGroupById(this.groupId).subscribe(
      (res) => {
        console.log(res.data);
        const myEmail = this.stateService.user().email;
        this.group = res.data as IGroup;
        this.group.members.sort((m) => (m.email !== myEmail ? 0 : -1));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isOwner(member: string) {
    return this.stateService.user().email === member;
  }

  getSpend() {
    let total = 0;
    this.group.transactions.forEach((t) => (total += t.amount));
    return total;
  }

  getSpendBy(member: string) {
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
    let spend = this.getSpendBy(member);
    let length = 0;
    this.group.members.forEach((m) => {
      if(!m.pending){
        length++;
      }
    });
    return total / length - spend;
  }

  getMemberStr(member: string) {
    let spend = this.getSpendBy(member);
    let owes = this.getOwesBy(member);
    // return `User ${member.fullname} spent $${spend} in total => owes $${owes}`;
  }

  inviteMember() {
    this.router.navigate(['', 'groups', 'invite-member', this.groupId]);
  }

  deleteMember(email: string) {
    this.groupsService.deleteMember(this.groupId, email).subscribe(
      (res) => {
        this.group.members = this.group.members.filter(
          (t) => t.email !== email
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addTransaction() {
    this.router.navigate(['', 'groups', 'add-transaction', this.groupId]);
  }

  deleteTransaction(trans_id: string) {
    this.groupsService.deleteTransaction(this.groupId, trans_id).subscribe(
      (res) => {
        this.group.transactions = this.group.transactions.filter(
          (t) => t._id !== trans_id
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goBack() {
    this.router.navigate(['', 'groups']);
  }
  colorizeOwe(amount: number): string{
    if(amount<=0) return "text-4xl font-bold text-green-500"
    else return "text-4xl font-bold text-red-500"
  }


}
