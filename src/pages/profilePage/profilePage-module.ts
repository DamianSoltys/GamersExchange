import { NgModule } from '@angular/core';

import { ProfilePageComponent } from './profilePage.component';
import { ProfilePageRoutingModule } from './profilePage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';

@NgModule({
  declarations: [ProfilePageComponent],
  imports: [ProfilePageRoutingModule, SharedCommonModule],
})
export class ProfilePageModule {}
