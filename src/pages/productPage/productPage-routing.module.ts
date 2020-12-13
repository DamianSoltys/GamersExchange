import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormComponent } from 'src/shared/components/product-form/product-form.component';
import { ProductListComponent } from 'src/shared/components/product-list/product-list.component';
import { ProductComponent } from 'src/shared/components/product/product.component';
import { ProductPageComponent } from './productPage.component';

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
    path: 'add',
    component: ProductFormComponent,
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
export class ProductPageRoutingModule {}
