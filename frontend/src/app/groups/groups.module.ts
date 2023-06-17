import { AddGroupComponent } from './add-group.component';
import { AddTransactionComponent } from './add-transaction.component';
import { authGuard } from '../user/auth.guard';
import { ColorDirective } from './color.directive';
import { CommonModule } from '@angular/common';
import { GroupDetailComponent } from './group-detail.component';
import { InviteMemberComponent } from './invite-member.component';
import { ListComponent } from './list.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header.component';
import { ModalComponent } from './modal.component';
import { TransactionComponent } from './transaction.component';
import { MembersComponent } from './members.component';
import {AUTO_STYLE} from "@angular/animations";

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
  },
  {
    path: 'add-group',
    component: AddGroupComponent,
    canActivate: [authGuard],
  },
  {
    path: 'detail/:group_id',
    component: GroupDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-transaction/:group_id',
    component: AddTransactionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'invite-member/:group_id',
    component: InviteMemberComponent,
    canActivate: [authGuard],
  },

];

@NgModule({
  declarations: [
    ListComponent,
    AddGroupComponent,
    GroupDetailComponent,
    ColorDirective,
    AddTransactionComponent,
    InviteMemberComponent,
    HeaderComponent,
    ModalComponent,
    TransactionComponent,
    MembersComponent,

  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsModule {}
