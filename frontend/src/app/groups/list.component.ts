import { Component, inject, OnInit } from '@angular/core';
import { GroupsService, IGroup } from './groups.service';
import { Router } from '@angular/router';
import { StateService } from '../user/state.service';

@Component({
  selector: 'app-list',
  template: `
    <app-header />
    <div class="mt-20 max-w-4xl mx-auto w-full">
      <h2
        class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white"
      >
        My Spending Groups
      </h2>

      <h3 *ngIf="!groups; else list">Loading...</h3>
      <ng-template #list>
        <div class="space-y-2">
          <div *ngFor="let g of groups">
            <div
              class="flex flex-col  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <a (click)="gotoDetail(g)" class="flex">
                <!--                      <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"-->
                <!--                           src="../../assets/images/logo.png" alt="">-->
                <div class="flex flex-col justify-between p-4 leading-normal">
                  <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  >
                    {{ g.title }} - {{ g.members[0].fullname }}
                  </h5>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Here are the biggest enterprise technology acquisitions of
                    2021 so far, in reverse chronological order.
                  </p>
                </div>
              </a>
              <div>
                <button
                  *ngIf="isPending(g)"
                  (click)="acceptGroup(g)"
                  class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Accept
                </button>
                <button
                  *ngIf="isPending(g)"
                  (click)="rejectGroup(g._id)"
                  class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Reject
                </button>

                <button
                  *ngIf="!isPending(g)"
                  (click)="deleteGroup(g._id)"
                  class=" bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div class="w-full mx-auto">
            <!--            <button type="button" class="focus:outline-none text-white bg-purple-700 max-w-2xl w-full hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" (click)="addGroup()">Add New Spending Group</button>-->
          </div>
        </div>
      </ng-template>
      <app-modal
        title="Create A new Group"
        [fields]="['title']"
        button="Create new Group"
        (add)="addGroup($event)"
      />
    </div>
  `,
  styles: [],
})
export class ListComponent implements OnInit {
  groups!: IGroup[];

  private stateService = inject(StateService);
  private groupService = inject(GroupsService);
  private router = inject(Router);

  ngOnInit() {
    this.groupService.getGroups().subscribe(
      (res) => {
        if (res && res.success) {
          this.groups = res.data as IGroup[];
          this.groups.sort((m1, _) => (this.isPending(m1) ? 1 : -1));
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
        this.groups.sort((m1, _) => (this.isPending(m1) ? 1 : -1));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  rejectGroup(group_id: string) {
    this.groupService.rejectGroup(group_id).subscribe(
      (res) => {
        if (res && res.success) {
          this.groups = this.groups.filter((g) => g._id !== group_id);
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
        if (res && res.success) {
          this.groups = this.groups.filter((g) => g._id !== group_id);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addGroup(title: string) {
    console.log(typeof title);
    this.groupService.addGroup({ title }).subscribe((res) => {
      console.log(res);
      this.groups.unshift(res.data);
    });
  }
  gotoDetail(group: IGroup) {
    if (this.isPending(group)) {
      return;
    }
    this.router.navigate(['', 'groups', 'detail', group._id]);
  }
}
