import { Injectable, signal } from '@angular/core';

export interface IUser {
  email: string;
  fullname: string;
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  user = signal<IUser>({ fullname: '', email: '', _id: '' });
}
