import { NgModule } from '@angular/core';

import { SearchPageComponent } from './searchPage.component';
import { SearchPageRoutingModule } from './searchPage-routing.module';

import { SharedCommonModule } from 'src/shared/constants/modules.const';
import { ProductSearchListComponent } from 'src/shared/components/product-components/product-search-list/product-search-list.component';
import { MapComponent } from 'src/shared/components/common-components/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [SearchPageComponent, ProductSearchListComponent, MapComponent],
  imports: [SearchPageRoutingModule, SharedCommonModule, LeafletModule],
})
export class SearchPageModule {}
