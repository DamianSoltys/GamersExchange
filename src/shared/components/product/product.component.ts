import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { IProductFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { MainService } from 'src/shared/services/main.service';
import { PhotoService } from 'src/shared/services/photo.service';
import {
  GET_PRODUCT,
  GET_PRODUCT_PHOTOS,
  GET_PRODUCT_PHOTOS_SUCCESS,
  GET_PRODUCT_SUCCESS,
} from 'src/shared/store/actions/product.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  public product$ = this.store.select('productState').pipe(
    filter((productState) => productState.lastProduct !== null),
    map((productState) => productState.lastProduct)
  );
  public trustedCapturedPhotos: SafeUrl[] = [];
  public userId: number;
  public productId: number;
  public productForm = this.fb.group({
    name: [null],
    state: [null],
    approximatePrice: [null],
    platform: [null],
    category: [null],
    description: [null],
    position: [null],
    possibleExchangeItem: [null],
  });
  private productData: IProductFirebaseCollection;

  private userId$ = this.store.select('userState').pipe(
    filter((userState) => userState?.loggedUser?.id !== null),
    map((userState) => userState?.loggedUser?.id)
  );
  private destroy$ = new Subject();

  constructor(
    private store: Store<IInitialState>,
    private route$: ActivatedRoute,
    private photoService: PhotoService,
    private mainService: MainService,
    private actions$: Actions,
    private fb: FormBuilder
  ) {
    this.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.userId = id;
    });

    this.route$.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.productId = params.id;
    });

    this.actions$.pipe(takeUntil(this.destroy$), ofType(GET_PRODUCT_SUCCESS)).subscribe(({ payload }) => {
      this.mainService.dispatch(GET_PRODUCT_PHOTOS({ userId: payload.userId, productId: this.productId }));
    });

    this.actions$.pipe(takeUntil(this.destroy$), ofType(GET_PRODUCT_PHOTOS_SUCCESS)).subscribe(({ payload }) => {
      this.trustedCapturedPhotos = [];

      payload.forEach((image) => {
        this.trustedCapturedPhotos.push(this.photoService.formatToSafeURL(image));
      });
    });

    this.product$.pipe(takeUntil(this.destroy$)).subscribe((product) => {
      this.productData = product;
      this.productForm.patchValue(product);
      this.productForm.disable();
    });
  }

  ionViewDidEnter() {
    this.mainService.dispatch(GET_PRODUCT({ payload: this.productId }));
  }

  IonViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
