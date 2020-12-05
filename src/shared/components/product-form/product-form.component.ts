import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { IProductFirebaseCollection, PlatformEnum } from 'src/shared/firebase/interfaces/firestore.interface';
import { MainService } from 'src/shared/services/main.service';
import { PhotoService } from 'src/shared/services/photo.service';
import {
  ADD_PRODUCT,
  GET_ALL_CATEGORIES,
  GET_PRODUCT,
  SET_PRODUCT_PHOTO,
} from 'src/shared/store/actions/product.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  public categories$ = this.store.select('productState').pipe(
    filter((state) => state.categories?.length > 0),
    map((state) => state.categories)
  );

  public images$ = this.store.select('productState').pipe(
    filter((state) => state.formImages?.length > 0),
    map((state) => state.formImages)
  );
  public userId: number;
  public capturedPhotos: Blob[];
  public trustedCapturedPhotos: SafeUrl[] = [];
  public platformOptions = Object.values(PlatformEnum);
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

  private userId$ = this.store.select('userState').pipe(
    filter((userState) => userState?.loggedUser?.id !== null),
    map((userState) => userState?.loggedUser?.id)
  );
  private destroy$ = new Subject();

  constructor(
    private store: Store<IInitialState>,
    private fb: FormBuilder,
    private mainService: MainService,
    private photoService: PhotoService,
    private router: Router
  ) {
    this.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.userId = id;
    });

    this.images$.pipe(takeUntil(this.destroy$)).subscribe((images) => {
      this.capturedPhotos = images;
      this.trustedCapturedPhotos = [];

      images.forEach((image) => {
        this.trustedCapturedPhotos.push(this.photoService.formatToSafeURL(image));
      });
    });
  }

  public takePhoto() {
    this.mainService.dispatch(SET_PRODUCT_PHOTO());
  }

  public submitModifyData(data: IProductFirebaseCollection) {
    const productData = { ...data };
    productData.userId = this.userId;

    this.mainService.dispatch(ADD_PRODUCT({ product: productData, files: this.capturedPhotos }));
    this.router.navigate([`/product/search`]);
  }

  ionViewDidEnter() {
    this.mainService.dispatch(GET_ALL_CATEGORIES());
  }

  ionViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
