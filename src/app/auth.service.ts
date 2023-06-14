import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUser} from "./interfaces/IUser.interface";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(user :IUser){
    return this.http.post(environment.BACKEND_URL+"/users/signup",user)

  }
  signin(credentials: {email:string, password: string}){
    return this.http.post(environment.BACKEND_URL+"/users/signin", credentials)

  }
}
