import { Component, inject } from '@angular/core';
import { GroupsService, IGroup } from './groups.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  template: `
    <h2>My Spending Groups</h2>

    <div class="group-container" *ngIf="groups">
      <div class="group" *ngFor="let group of groups">
        <p class="group-child-p">
          {{ group.title }} - {{ group.members[0].fullname }}
        </p>
        <button class="group-child-button">Detail</button>
        <button class="group-child-button" (click)="deleteGroup(group._id)">
          Delete
        </button>
      </div>
    </div>

    <button class="add-button" (click)="addGroup()">
      Add New Spending Group
    </button>
  `,
  styles: [
    `
      .group-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
      }

      .group {
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-bottom: 10px;
      }

      .group-child-p {
        margin-right: 15px;
      }

      .group-child-button {
        margin-right: 15px;
        width: 80px;
        height: 30px;
      }

      .add-button {
        margin-top: 10px;
        padding: 15px;
      }
    `,
  ],
})
export class ListComponent {
  groups: IGroup[] = [];

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
