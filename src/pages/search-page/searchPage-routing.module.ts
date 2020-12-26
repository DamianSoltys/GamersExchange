import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductSearchListComponent } from 'src/shared/components/product-components/product-search-list/product-search-list.component';
import { SearchPageComponent } from './searchPage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductSearchListComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchPageRoutingModule {}
