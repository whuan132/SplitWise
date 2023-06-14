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
    <form class="container" [formGroup]="signinForm" (ngSubmit)="signIn()">
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

      <button type="submit" [disabled]="signinForm.invalid">Sign In</button>
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
              const token = res.data as string;
              const user = jwtDecode(token) as IUser;
              console.log(user);
              this.stateService.user.set({ ...user, token });
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
