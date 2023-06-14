import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from './groups.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-group',
  template: `
    <h2>Add New Spending Group</h2>

    <form [formGroup]="groupForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="title">Title:</label>
        <input type="text" id="title" formControlName="title" />
        <div *ngIf="title?.invalid && title?.touched">Title is required.</div>
      </div>
      <button class="button" type="submit">Add Group</button>
    </form>
  `,
  styles: [
    `
      .button {
        margin-top: 20px;
        padding: 5px;
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
}
