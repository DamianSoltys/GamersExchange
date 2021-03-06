import { NgModule } from '@angular/core';

import { ProductPageComponent } from './productPage.component';
import { ProductPageRoutingModule } from './productPage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';
import { ProductListComponent } from 'src/shared/components/product-components/product-list/product-list.component';
import { ProductComponent } from 'src/shared/components/product-components/product/product.component';
import { ProductFormComponent } from 'src/shared/components/product-components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExchangeListComponent } from 'src/shared/components/exchange-components/exchange-list/exchange-list.component';
import { ExchangeFormComponent } from 'src/shared/components/exchange-components/exchange-form/exchange-form.component';

@NgModule({
  declarations: [ProductPageComponent, ProductListComponent, ProductComponent, ExchangeFormComponent, ProductFormComponent, ExchangeListComponent],
  imports: [ProductPageRoutingModule, SharedCommonModule, ReactiveFormsModule],
})
export class ProductPageModule { }
