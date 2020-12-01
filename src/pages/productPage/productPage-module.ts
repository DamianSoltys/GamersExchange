import { NgModule } from '@angular/core';

import { ProductPageComponent } from './productPage.component';
import { ProductPageRoutingModule } from './productPage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';

@NgModule({
  declarations: [ProductPageComponent],
  imports: [ProductPageRoutingModule, SharedCommonModule],
})
export class ProductPageModule {}
