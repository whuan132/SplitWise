import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-signup',
  template: `
    <h2>Sign Up</h2>
    <form [formGroup]="signupForm" (ngSubmit)="signUp()">
      <div>
        <label for="fullname">Full Name:</label>
        <input type="text" id="fullname" formControlName="fullname" required />
        <div *ngIf="fullname?.touched && fullname?.invalid">
          <div *ngIf="fullname?.errors?.['required']">
            Full Name is required.
          </div>
        </div>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" formControlName="email" required />
        <div *ngIf="email?.touched && email?.invalid">
          <div *ngIf="email?.errors?.['required']">Email is required.</div>
          <div *ngIf="email?.errors?.['email']">Invalid email format.</div>
        </div>
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          formControlName="password"
          required
        />
        <div *ngIf="password?.touched && password?.invalid">
          <div *ngIf="password?.errors?.['required']">
            Password is required.
          </div>
        </div>
      </div>
      <button type="submit" [disabled]="signupForm.invalid">Sign Up</button>
    </form>
  `,
  styles: [],
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
