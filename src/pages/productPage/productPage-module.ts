import { NgModule } from '@angular/core';

import { ProductPageComponent } from './productPage.component';
import { ProductPageRoutingModule } from './productPage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';
import { ProductListComponent } from 'src/shared/components/product-list/product-list.component';
import { ProductComponent } from 'src/shared/components/product/product.component';

@NgModule({
  declarations: [ProductPageComponent, ProductListComponent, ProductComponent],
  imports: [ProductPageRoutingModule, SharedCommonModule],
})
export class ProductPageModule {}
