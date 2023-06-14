import { Component, inject } from '@angular/core';
import { GroupsService, IGroup } from './groups.service';
import { Router } from '@angular/router';
import { StateService } from '../user/state.service';

@Component({
  selector: 'app-list',
  template: `
    <h2>My Spending Groups</h2>

    <h3 *ngIf="!groups; else list">Loading...</h3>
    <ng-template #list>
      <div class="container">
        <div *ngFor="let g of groups">
          <a
            [routerLink]="['', 'groups', 'detail', g._id]"
            [routerLinkActive]="isPending(g) ? 'false' : 'true'"
          >
            {{ g.title }} - {{ g.members[0].fullname }}
          </a>

          <button *ngIf="isPending(g)" (click)="acceptGroup(g)">Accept</button>
          <button *ngIf="isPending(g)" (click)="rejectGroup(g._id)">
            Reject
          </button>

          <button *ngIf="!isPending(g)" (click)="deleteGroup(g._id)">x</button>
        </div>

        <button (click)="addGroup()">Add New Spending Group</button>
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
        margin-right: 10px;
      }

      a {
        margin-right: 10px;
      }
    `,
  ],
})
export class ListComponent {
  groups!: IGroup[];

  private stateService = inject(StateService);
  private groupService = inject(GroupsService);
  private router = inject(Router);

  ngOnInit() {
    this.groupService.getGroups().subscribe(
      (res) => {
        if (res && res.success) {
          this.groups = res.data as IGroup[];
          this.groups.sort((m1, m2) => (this.isPending(m1) ? 1 : -1));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isPending(group: IGroup) {
    const myEmail = this.stateService.user().email;
    return group.members.find((m) => m.email === myEmail && m.pending);
  }

  acceptGroup(group: IGroup) {
    this.groupService.acceptGroup(group._id).subscribe(
      (res) => {
        console.log(res);
        const user = this.stateService.user();
        group.members.find((m) => {
          if (m.email === user.email) {
            m.user_id = user._id;
            m.fullname = user.fullname;
            m.pending = false;
            return true;
          }
          return false;
        });
        this.groups.sort((m1, m2) => (this.isPending(m1) ? 1 : -1));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  rejectGroup(group_id: string) {
    this.groupService.rejectGroup(group_id).subscribe(
      (res) => {
        this.groups = this.groups.filter((g) => g._id !== group_id);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteGroup(group_id: string) {
    this.groupService.deleteGroup(group_id).subscribe(
      (res) => {
        this.groups = this.groups.filter((g) => g._id !== group_id);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addGroup() {
    this.router.navigate(['', 'groups', 'add-group']);
  }
}
