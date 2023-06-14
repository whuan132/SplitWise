import { AddGroupComponent } from './add-group.component';
import { authGuard } from '../user/auth.guard';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

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
];

@NgModule({
  declarations: [ListComponent, AddGroupComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsModule {}
