import { NgModule } from '@angular/core';

import { ProfilePageComponent } from './profilePage.component';
import { ProfilePageRoutingModule } from './profilePage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfilePageComponent],
  imports: [ProfilePageRoutingModule, SharedCommonModule,ReactiveFormsModule],
})
export class ProfilePageModule {}
