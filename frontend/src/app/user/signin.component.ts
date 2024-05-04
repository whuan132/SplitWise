import jwtDecode from 'jwt-decode';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser, StateService } from './state.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-signin',
  template: `
    <div>
      <section class="bg-gray-50 dark:bg-gray-900">
        <div
          class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
        >
          <a
            href="#"
            class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              class=" h-8 mr-2"
              src="../../assets/images/logo.png"
              alt="logo"
            />
            CoinSplit
          </a>
          <div
            class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1
                class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
              >
                Sign in to your account
              </h1>
              <form
                class="space-y-4 md:space-y-6"
                [formGroup]="signinForm"
                (ngSubmit)="signIn()"
              >
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Your email</label
                  >
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autocomplete="username"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="name@company.com"
                    required="true"
                    formControlName="email"
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Password</label
                  >
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autocomplete="current-password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required="true"
                    formControlName="password"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-800 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
                        required="true  "
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label
                        for="remember"
                        class="text-gray-500 dark:text-gray-300"
                        >Remember me</label
                      >
                    </div>
                  </div>
                  <a
                    href="#"
                    class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >Forgot password?</a
                  >
                </div>
                <button
                  type="submit"
                  class=" w-full focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 disabled:bg-purple-400 disabled:cursor-not-allowed"
                  [disabled]="signinForm.status === 'INVALID'"
                >
                  Sign in
                </button>

                <p class="text-sm  font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?
                  <a
                    [routerLink]="['', 'signup']"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >Sign up</a
                  >
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [``],
})
export class SigninComponent {
  toast = inject(ToastService);
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
              this.toast.showNotification(`welcome,${user.fullname}`);
              this.router.navigate(['', 'groups']);
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
