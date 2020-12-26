import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from 'src/shared/components/admin-components/user-list/user-list.component';
import {  ProfilePageComponent } from './profilePage.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilePageComponent,
  },
  {
    path: 'users',
    component: UserListComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
