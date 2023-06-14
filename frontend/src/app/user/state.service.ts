import { Injectable, signal } from '@angular/core';

export interface IUser {
  _id: string;
  email: string;
  fullname: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  user = signal<IUser>({ fullname: '', email: '', _id: '', token: '' });
}
