import { NgModule } from '@angular/core';

import { SearchPageComponent } from './searchPage.component';
import { SearchPageRoutingModule } from './searchPage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';
import { ProductSearchListComponent } from 'src/shared/components/product-search-list/product-search-list.component';

@NgModule({
  declarations: [SearchPageComponent, ProductSearchListComponent],
  imports: [SearchPageRoutingModule, SharedCommonModule],
})
export class SearchPageModule {}
