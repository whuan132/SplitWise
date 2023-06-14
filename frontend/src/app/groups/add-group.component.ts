import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from './groups.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-group',
  template: `
    <h2>Add New Spending Group</h2>

    <form class="container" [formGroup]="groupForm" (ngSubmit)="onSubmit()">
      <input type="text" placeholder="Title" formControlName="title" />
      <div [style.color]="'red'" *ngIf="title?.invalid && title?.touched">
        Title is required.
      </div>
      <button class="button" type="submit">Add Group</button>
      <!-- Go Back Button -->
      <button (click)="goBack()">Back</button>
    </form>
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
    `,
  ],
})
export class AddGroupComponent {
  groupForm = inject(FormBuilder).group({
    title: ['', Validators.required],
  });
  private router = inject(Router);
  private groupsService = inject(GroupsService);

  get title() {
    return this.groupForm.get('title');
  }

  onSubmit() {
    if (this.groupForm.invalid) {
      return;
    }

    const { title } = this.groupForm.value;
    if (title) {
      this.groupsService.addGroup({ title }).subscribe(() => {
        this.router.navigate(['', 'groups']);
      });
    }
  }

  goBack() {
    this.router.navigate(['', 'groups']);
  }
}
