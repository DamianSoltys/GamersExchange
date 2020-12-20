import { NgModule } from '@angular/core';

import { ProductPageComponent } from './productPage.component';
import { ProductPageRoutingModule } from './productPage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';
import { ProductListComponent } from 'src/shared/components/product-list/product-list.component';
import { ProductComponent } from 'src/shared/components/product/product.component';
import { ProductFormComponent } from 'src/shared/components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExchangeListComponent } from 'src/shared/components/exchangeList/exchange-list.component';

@NgModule({
  declarations: [ProductPageComponent, ProductListComponent, ProductComponent, ProductFormComponent,ExchangeListComponent],
  imports: [ProductPageRoutingModule, SharedCommonModule, ReactiveFormsModule],
})
export class ProductPageModule {}
