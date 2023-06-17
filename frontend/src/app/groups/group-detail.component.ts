import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { GroupsService, IGroup, IMember, ITransaction } from './groups.service';
import { StateService } from '../user/state.service';
import { initDials, initTooltips } from 'flowbite';
import { GroupHelper, IGroupResult } from '../utils/GroupHelper';

@Component({
  selector: 'app-group-detail',
  template: `
    <div class="mt-96" *ngIf="!group; else details">
      <div
        role="status"
        class=" flex w-full h-full justify-center items-center"
      >
        <svg
          aria-hidden="true"
          class="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <app-header />
    <ng-template #details>
      <div class="mt-20 max-w-4xl mx-auto w-full">
        <h2
          class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white"
        >
          {{ group.title }}
        </h2>
        <div
          class=" flex border border-gray-300 rounded-lg p-5 m-5 justify-around"
        >
          <div class="flex flex-col justify-center items-center">
            <p>Total:</p>
            <p class="text-4xl font-bold text-red-500">
              {{ groupResult.total | currency }}
            </p>
          </div>
          <div class="flex flex-col justify-center items-center">
            <p>Spent:</p>
            <p class="text-4xl font-bold text-green-500">
              {{
                groupResult.members[stateService.user()._id].spend | currency
              }}
            </p>
          </div>
          <div class="flex flex-col justify-center items-center">
            <p>Owe:</p>
            <p
              [class]="
                colorizeOwe(groupResult.members[stateService.user()._id].owes)
              "
            >
              {{ groupResult.members[stateService.user()._id].owes | currency }}
            </p>
          </div>
        </div>

        <!-- Transactions and Members -->
        <div
          class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
        >
          <ul class="flex flex-wrap  justify-around">
            <li class="mr-2">
              <a
                (click)="showTrasactions = true; showMembers = false"
                class=" cursor-pointer inline-block p-4 hover:text-blue-600 active:border-b-2 border-blue-600 rounded-t-lg  active:text-blue-500 active:border-blue-500"
                aria-current="page"
                >Transactions</a
              >
            </li>
            <li class="mr-2">
              <a
                (click)="showTrasactions = false; showMembers = true"
                class=" cursor-pointer inline-block p-4 hover:text-blue-600 active:border-b-2 border-blue-600 rounded-t-lg  active:text-blue-500 active:border-blue-500"
                aria-current="page"
                >Members</a
              >
            </li>
          </ul>
        </div>

        <!-- Modals -->
        <app-transaction
          [groupId]="groupId"
          [transactions]="group.transactions"
          (remove)="deleteTransaction($event)"
          [filterUser]="filter"
          *ngIf="showTrasactions"
        />
        <app-members
          [group]="group"
          [groupResult]="groupResult"
          *ngIf="showMembers"
          (remove)="deleteMember($event)"
          (showMemberTransaction)="showMembersTransaction($event)"
        />
        <div class="mt-3 max-w-2xl mx-auto flex justify-end">
          <app-add-transaction
            [groupName]="group.title"
            [amount_owed]="groupResult.members[stateService.user()._id].owes"
            *ngIf="!showMembers"
            (transaction)="pushTransaction($event)"
          />
          <app-invite-member
            *ngIf="showMembers"
            [groupId]="groupId"
            (onSubmit)="onInviteMember($event)"
          />
        </div>
      </div>
    </ng-template>
  `,
  styles: [``],
})
export class GroupDetailComponent implements OnInit {
  showTrasactions = true;
  showMembers = false;

  group!: IGroup;
  groupId!: string;
  groupResult!: IGroupResult;
  filter = '';
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
        this.groupResult = GroupHelper.compute(this.group);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onInviteMember(email: string) {
    this.group.members.push({
      email: email,
      pending: true,
    });
    this.groupResult = GroupHelper.compute(this.group);
  }

  deleteMember(email: string) {
    this.groupsService.deleteMember(this.groupId, email).subscribe(
      (res) => {
        if (email === this.stateService.user().email) {
          // remove myself, navigate to groups
          this.router.navigate(['/groups']);
          return;
        }
        this.group.members = this.group.members.filter(
          (t) => t.email !== email
        );
        this.groupResult = GroupHelper.compute(this.group);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteTransaction(trans_id: string) {
    this.groupsService.deleteTransaction(this.groupId, trans_id).subscribe(
      (res) => {
        this.group.transactions = this.group.transactions.filter(
          (t) => t._id !== trans_id
        );
        this.groupResult = GroupHelper.compute(this.group);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  colorizeOwe(amount: number): string {
    if (amount <= 0) return 'text-4xl font-bold text-green-500';
    else return 'text-4xl font-bold text-red-500';
  }

  pushTransaction(transaction: ITransaction) {
    this.group.transactions.unshift(transaction);
    this.groupResult = GroupHelper.compute(this.group);
  }
  showMembersTransaction(id: string) {
    this.showMembers = false;
    this.showTrasactions = true;
    this.filter = id;
  }
}
