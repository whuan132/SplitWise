import jwtDecode from 'jwt-decode';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser, StateService } from './state.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-signin',
  template: `
    <h2>Sign In</h2>
    <form [formGroup]="signinForm" (ngSubmit)="signIn()">
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
      <button type="submit" [disabled]="signinForm.invalid">Sign In</button>
    </form>
  `,
  styles: [],
})
export class SigninComponent {
  signinForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  private userService = inject(UserService);
  private stateService = inject(StateService);
  private router = inject(Router);

  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

  signIn() {
    if (this.signinForm.invalid) {
      return;
    }

    const { email, password } = this.signinForm.value;
    if (email && password) {
      this.userService.signIn(email, password).subscribe(
        (res) => {
          if (res && res.success) {
            try {
              const user = jwtDecode(res.data as string) as IUser;
              console.log(user);
              this.stateService.user.set(user);
              this.router.navigate(['', 'home']);
            } catch (error) {
              console.error('Error decoding JWT:', error);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
