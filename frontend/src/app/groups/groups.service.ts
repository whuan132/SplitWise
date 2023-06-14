import TypedResponse from '../types/TypedResponse.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StateService } from '../user/state.service';

export interface IGroup {
  _id: string;
  title: string;
  members: IMember[];
  transactions: ITransaction[];
}

export interface IMember {
  user_id: string;
  fullname: string;
  email: string;
  pending: boolean;
}

export interface ITransaction {
  title: string;
  description: string;
  paid_by: { user_id: string; fullname: string };
  category: string;
  amount: number;
  date: number;
  receipt: { filename: string; originalname: string };
}

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private api = 'http://localhost:3000';
  private stateService = inject(StateService);
  private http = inject(HttpClient);

  getGroups() {
    return this.http.get<TypedResponse>(this.api + '/groups');
  }

  addGroup(data: { title: string }) {
    return this.http.post<TypedResponse>(this.api + '/groups', data);
  }

  deleteGroup(group_id: string) {
    return this.http.delete<TypedResponse>(this.api + '/groups/' + group_id);
  }
}