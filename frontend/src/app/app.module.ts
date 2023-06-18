import { AboutComponent } from './about.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './user/auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './user/signin.component';
import { SignupComponent } from './user/signup.component';
import { StateService } from './user/state.service';
import {
  provideHttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgIf } from '@angular/common';
import { FooterComponent } from './footer.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {ToastComponent} from "./toast.component";
@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    AboutComponent,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgIf,
    ReactiveFormsModule,
    BrowserAnimationsModule,

  ],
  providers: [
    provideHttpClient(),
    StateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
