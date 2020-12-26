import { NgModule } from '@angular/core';

import { ProfilePageComponent } from './profilePage.component';
import { ProfilePageRoutingModule } from './profilePage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';
import { ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from 'src/shared/components/admin-components/user-list/user-list.component';

@NgModule({
  declarations: [ProfilePageComponent,UserListComponent],
  imports: [ProfilePageRoutingModule, SharedCommonModule,ReactiveFormsModule],
})
export class ProfilePageModule {}
