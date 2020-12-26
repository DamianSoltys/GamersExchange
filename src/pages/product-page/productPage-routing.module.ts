import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeListComponent } from 'src/shared/components/exchange-components/exchange-list/exchange-list.component';
import { ProductFormComponent } from 'src/shared/components/product-components/product-form/product-form.component';
import { ProductListComponent } from 'src/shared/components/product-components/product-list/product-list.component';
import { ProductComponent } from 'src/shared/components/product-components/product/product.component';
import { ExchangeFormComponent } from 'src/shared/components/exchange-components/exchange-form/exchange-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'exchanges',
    component: ExchangeListComponent,
  },
  {
    path: 'add/product',
    component: ProductFormComponent,
  },
  {
    path: 'add/exchange',
    component: ExchangeFormComponent,
  },
  {
    path: 'details/:id',
    component: ProductComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPageRoutingModule { }
