import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { GroupsService, IGroup, IMember } from './groups.service';
import { StateService } from '../user/state.service';

@Component({
  selector: 'app-group-detail',
  template: `
    <h2 *ngIf="!group; else detail">Loading...</h2>
    <ng-template #detail>
      <div class="container">
        <h2>{{ group.title }}</h2>

        <!-- Members -->
        <h3>Members: <button (click)="inviteMember()">+</button></h3>
        <div *ngFor="let m of group?.members" [app-color]="getOwesBy(m)">
          User <b>{{ m.fullname || m.email }}</b> spent
          <b>{{ getSpendBy(m) | currency : 'USD' }}</b> in total => owes
          <b>{{ getOwesBy(m) | currency : 'USD' }}</b>
          <button
            class="del-button"
            (click)="deleteMember(m.email)"
            *ngIf="!isOwner(m)"
          >
            x
          </button>
        </div>

        <!-- Transactions -->
        <h3>
          Transactions:
          <button (click)="addTransaction()">+</button>
        </h3>
        <div *ngFor="let t of group?.transactions">
          {{ t.date | date }} - {{ t.title }} - {{ t.description }} -
          {{ t.category }} - User {{ t.paid_by.fullname }} paid
          {{ t.amount | currency : 'USD' }}
          <button class="del-button" (click)="deleteTransaction(t._id)">
            x
          </button>
        </div>

        <!-- Go Back Button -->
        <button (click)="goBack()">Back</button>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
      }
      div,
      input,
      button {
        margin-bottom: 10px;
      }

      .del-button {
        margin-left: 10px;
      }
    `,
  ],
})
export class GroupDetailComponent {
  group!: IGroup;
  groupId!: string;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);
  private stateService = inject(StateService);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('group_id') as string;
      this.loadGroupDetails();
    });
  }

  private loadGroupDetails() {
    this.groupsService.getGroupById(this.groupId).subscribe(
      (res) => {
        console.log(res.data);
        this.group = res.data as IGroup;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isOwner(member: IMember) {
    return this.stateService.user().email === member.email;
  }

  getSpend() {
    let total = 0;
    this.group.transactions.forEach((t) => (total += t.amount));
    return total;
  }

  getSpendBy(member: IMember) {
    let total = 0;
    this.group.transactions.forEach((t) => {
      if (t.paid_by.user_id == member.user_id) {
        total += t.amount;
      }
    });
    return total;
  }

  getOwesBy(member: IMember) {
    let total = this.getSpend();
    let spend = this.getSpendBy(member);
    let owes = total / this.group.members.length - spend;
    return owes;
  }

  getMemberStr(member: IMember): string {
    let spend = this.getSpendBy(member);
    let owes = this.getOwesBy(member);
    return `User ${member.fullname} spent $${spend} in total => owes $${owes}`;
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
}
