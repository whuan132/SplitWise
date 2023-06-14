import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from './groups.service';

@Component({
  selector: 'app-invite-member',
  template: `
    <h2>Invite Member</h2>

    <form
      class="container"
      [formGroup]="inviteForm"
      (ngSubmit)="inviteMember()"
    >
      <input type="email" placeholder="Email" formControlName="email" />
      <div *ngIf="email?.touched && email?.invalid">
        <div [style.color]="'red'" *ngIf="email?.errors?.['required']">
          Email is required.
        </div>
        <div [style.color]="'red'" *ngIf="email?.errors?.['email']">
          Invalid email format.
        </div>
      </div>
      <button type="submit" [disabled]="inviteForm.invalid">Invite</button>
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
export class InviteMemberComponent {
  groupId!: string;
  inviteForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
  });

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  get email() {
    return this.inviteForm.get('email');
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('group_id') as string;
    });
  }

  inviteMember() {
    if (this.inviteForm.valid) {
      const email = this.inviteForm.value.email as string;
      this.groupsService.inviteMember(this.groupId, email).subscribe(
        (res) => {
          this.goBack();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['', 'groups', 'detail', this.groupId]);
  }
}
