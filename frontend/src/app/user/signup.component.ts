import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-signup',
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
            <img class=" h-8 mr-2" src="../assets/images/logo.png" alt="logo" />
            CoinSplit
          </a>
          <div
            class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1
                class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
              >
                Create new Account
              </h1>
              <form
                class="space-y-4 md:space-y-6"
                [formGroup]="signupForm"
                (ngSubmit)="signUp()"
              >
                <div>
                  <label
                    for="fullname"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Your full name</label
                  >
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Full Name"
                    required="true"
                    formControlName="fullname"
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Your email</label
                  >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autocomplete="username"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    autocomplete="new-password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required="true"
                    formControlName="password"
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Re-enter password</label
                  >
                  <input
                    type="password"
                    name="password"
                    autocomplete="new-password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required="true"
                    formControlName="rePassword"
                    (keyup)="comparePassword()"
                  />
                  <p class="text-xs text-red-500" *ngIf="!passwordMatch">
                    *password does not match
                  </p>
                </div>

                <button
                  type="submit"
                  class=" w-full focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 disabled:bg-purple-400 disabled:cursor-not-allowed"
                  [disabled]="signupForm.status === 'INVALID' || !passwordMatch"
                >
                  Sign up
                </button>
                <p class="text-sm  font-light text-gray-500 dark:text-gray-400">
                  Already have an account?
                  <a
                    [routerLink]="['', 'signin']"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >Sign in</a
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
export class SignupComponent {
  passwordMatch = true;
  signupForm = inject(FormBuilder).group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.min(8),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).+$'),
      ],
    ],
    rePassword: [
      '',
      [
        Validators.required,
        Validators.min(8),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).+$'),
      ],
    ],
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
  comparePassword() {
    this.passwordMatch =
      this.signupForm.value.password === this.signupForm.value.rePassword;
    console.log(this.signupForm.status);
    console.log(this.passwordMatch);
  }
}
