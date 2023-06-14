import TypedResponse from '../types/TypedResponse.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = 'http://localhost:3000';
  private http = inject(HttpClient);

  signIn(email: string, password: string) {
    return this.http.post<TypedResponse>(this.api + '/users/signin', {
      email,
      password,
    });
  }

  signUp(fullname: string, email: string, password: string) {
    return this.http.post<TypedResponse>(this.api + '/users/signup', {
      fullname,
      email,
      password,
    });
  }
}
