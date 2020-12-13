import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { MainService } from 'src/shared/services/main.service';
import { DELETE_USER_PRODUCT, GET_ALL_PRODUCTS, GET_ALL_USER_PRODUCTS } from 'src/shared/store/actions/product.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-product-search-list',
  templateUrl: './product-search-list.component.html',
  styleUrls: ['./product-search-list.component.scss'],
})
export class ProductSearchListComponent {
  @ViewChild('searchQuery', { static: true }) searchQuery: IonSearchbar;
  public productList$ = this.store.select('productState').pipe(map((productState) => productState.searchProducts));
  public userId: number;
  // public searchQuery = this.fb.control(['dupa', Validators.minLength(3)]);

  private userId$ = this.store.select('userState').pipe(
    filter((userState) => userState?.loggedUser?.id !== null),
    map((userState) => userState?.loggedUser?.id)
  );
  private destroy$ = new Subject();

  constructor(
    private store: Store<IInitialState>,
    private router: Router,
    private alertController: AlertController,
    private mainService: MainService,
    private fb: FormBuilder
  ) {
    this.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.userId = id;
    });
  }

  public goToDetails(id: number) {
    this.router.navigate(['/product/details', id]);
  }

  ionViewDidEnter() {
    this.mainService.dispatch(GET_ALL_PRODUCTS({ payload: this.searchQuery.value }));

    this.searchQuery.ionChange
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        filter(({ detail: { value } }) => value?.length > 0)
      )
      .subscribe(({ detail: { value } }) => {
        this.mainService.dispatch(GET_ALL_PRODUCTS({ payload: value }));
      });
  }

  IonViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
