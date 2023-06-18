import { Component, inject, OnInit } from '@angular/core';
import { GroupsService, IGroup } from './groups.service';
import { Router } from '@angular/router';
import { StateService } from '../user/state.service';
import {ToastService} from "../toast.service";

@Component({
  selector: 'app-list',
  template: `
    <div class="mt-96" *ngIf="!groups; else list">
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

    <ng-template #list>
      <div class="mt-20 mx-auto w-full items-start md:max-w-2xl">
        <h2
          class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white"
        >
          My Spending Groups
        </h2>

        <div class="space-y-2">
          <div
            *ngFor="let g of groups"
            class="flex flex-col w-auto items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:justify-between p-2"
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
                <div *ngIf="!isPending(g)">
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Click to show details of the group.
                  </p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Members: {{ g.members.length }} - Transactions:
                    {{ g.transactions.length }}
                  </p>
                </div>
                <div *ngIf="isPending(g)">
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    You should to accept the invitation to be part of the group.
                  </p>
                </div>
              </div>
            </a>

            <div
              class="inline-flex flex-col rounded-md shadow-sm mr-5"
              *ngIf="isPending(g)"
            >
              <button
                (click)="acceptGroup(g)"
                class="px-4 py-2 text-sm font-medium text-green-700 bg-white border border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              >
                Accept
              </button>
              <button
                (click)="rejectGroup(g._id)"
                class="px-4 py-2 text-sm font-medium text-red-500 bg-white border border-gray-200 rounded-b-lg hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-red-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              >
                Reject
              </button>
            </div>

            <div
              class="inline-flex rounded-md shadow-sm mr-5"
              *ngIf="!isPending(g)"
            >
              <button
                (click)="deleteGroup(g._id)"
                class="px-4 py-2 text-sm font-medium text-red-500 bg-white border border-gray-200 rounded-l-lg rounded-r-lg hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-red-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              >
                Remove
              </button>
            </div>
          </div>

          <!-- Create Button -->
          <div class="flex flex-col justify-between">
            <app-modal
              title="Create A new Group"
              [fields]="['title']"
              button="Create new Group"
              (add)="addGroup($event)"
              class="mb-5"
            />
          </div>
        </div>
      </div>
    </ng-template>

  `,
  styles: [],
})
export class ListComponent implements OnInit {
  groups!: IGroup[];

  private stateService = inject(StateService);
  private groupService = inject(GroupsService);
  private router = inject(Router);
  toast= inject(ToastService)



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

            this.toast.showNotification(`joined spend group: ${group.title}`)
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
          this.toast.showNotification(`rejected spend group: ${this.groups.find(x=>x._id===group_id)?.title}`)
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
          this.toast.showNotification(`deleted spend group: ${this.groups.find(x=>x._id===group_id)?.title}`)
          this.groups = this.groups.filter((g) => g._id !== group_id);
          this.toast.showNotification(`deleted spend group: ${this.groups.find(x=>x._id===group_id)?.title}`)
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

    this.toast.showNotification(`created new spend group: ${title}`)
  }
  gotoDetail(group: IGroup) {
    if (this.isPending(group)) {
      return;
    }
    this.router.navigate(['', 'groups', 'detail', group._id]);
  }
  notify(){
    let length = this.groups.filter(x=>this.isPending(x)).length;

    if(length>0){
      setTimeout(()=> {
        this.toast.showNotification(`you have ${length} unchecked group invitations`)
      },0)
  }
}
}
