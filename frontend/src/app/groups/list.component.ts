import { Component, inject } from '@angular/core';
import { GroupsService, IGroup } from './groups.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  template: `
    <h2>My Spending Groups</h2>

    <h3 *ngIf="!groups; else list">Loading...</h3>
    <ng-template #list>
      <div class="container">
        <div *ngFor="let g of groups">
          <a [routerLink]="['', 'groups', 'detail', g._id]">
            {{ g.title }} - {{ g.members[0].fullname }}
          </a>
          <button (click)="deleteGroup(g._id)">x</button>
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
      }

      a {
        margin-right: 10px;
      }
    `,
  ],
})
export class ListComponent {
  groups!: IGroup[];

  private groupService = inject(GroupsService);
  private router = inject(Router);

  ngOnInit() {
    this.groupService.getGroups().subscribe(
      (res) => {
        if (res && res.success) {
          this.groups = res.data as IGroup[];
        }
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
