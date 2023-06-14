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
  _id: string;
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

  acceptGroup(group_id: string) {
    return this.http.put<TypedResponse>(this.api + '/groups/' + group_id, {
      pending: true,
    });
  }

  deleteGroup(group_id: string) {
    return this.http.delete<TypedResponse>(this.api + '/groups/' + group_id);
  }

  getGroupById(group_id: string) {
    return this.http.get<TypedResponse>(this.api + '/groups/' + group_id);
  }

  addTransaction(group_id: string, trans: any) {
    return this.http.put<TypedResponse>(
      this.api + '/groups/' + group_id + '/transactions',
      trans
    );
  }

  deleteTransaction(group_id: string, trans_id: string) {
    return this.http.delete<TypedResponse>(
      this.api + '/groups/' + group_id + '/transactions/' + trans_id
    );
  }

  inviteMember(group_id: string, email: string) {
    return this.http.put<TypedResponse>(
      this.api + '/groups/' + group_id + '/members',
      { email }
    );
  }

  deleteMember(group_id: string, email: string) {
    return this.http.delete<TypedResponse>(
      this.api + '/groups/' + group_id + '/members/' + email
    );
  }
}
