import { NgModule } from '@angular/core';

import { HomePageComponent } from './homePage.component';
import { HomePageRoutingModule } from './homePage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';

@NgModule({
  declarations: [HomePageComponent],
  imports: [HomePageRoutingModule, SharedCommonModule],
})
export class HomePageModule {}
