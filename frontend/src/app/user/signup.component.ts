import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-signup',
  template: `
    <h2>Sign Up</h2>
    <form class="container" [formGroup]="signupForm" (ngSubmit)="signUp()">
      <input
        type="text"
        placeholder="Full Name"
        formControlName="fullname"
        required
      />
      <div *ngIf="fullname?.touched && fullname?.invalid">
        <div [style.color]="'red'" *ngIf="fullname?.errors?.['required']">
          Full Name is required.
        </div>
      </div>

      <input
        type="email"
        placeholder="Email"
        formControlName="email"
        required
      />
      <div *ngIf="email?.touched && email?.invalid">
        <div [style.color]="'red'" *ngIf="email?.errors?.['required']">
          Email is required.
        </div>
        <div [style.color]="'red'" *ngIf="email?.errors?.['email']">
          Invalid email format.
        </div>
      </div>

      <input
        type="password"
        placeholder="Password"
        formControlName="password"
        required
      />
      <div *ngIf="password?.touched && password?.invalid">
        <div [style.color]="'red'" *ngIf="password?.errors?.['required']">
          Password is required.
        </div>
      </div>

      <button type="submit" [disabled]="signupForm.invalid">Sign Up</button>
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
export class SignupComponent {
  signupForm = inject(FormBuilder).group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  private userService = inject(UserService);
  private router = inject(Router);

  get fullname() {
    return this.signupForm.get('fullname');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  signUp() {
    if (this.signupForm.invalid) {
      return;
    }

    const { fullname, email, password } = this.signupForm.value;
    if (fullname && email && password) {
      this.userService.signUp(fullname, email, password).subscribe((res) => {
        if (res && res.success) {
          console.log(res.data);
          this.router.navigate(['', 'signin']);
        }
      });
    }
  }
}
