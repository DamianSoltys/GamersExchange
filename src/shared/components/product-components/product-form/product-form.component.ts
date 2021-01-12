import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { from, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';
import { IProductFirebaseCollection, PlatformEnum } from 'src/shared/firebase/interfaces/firestore.interface';
import { MainService } from 'src/shared/services/main.service';
import { PhotoService } from 'src/shared/services/photo.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  ADD_PRODUCT,
  GET_ADDRESS_BY_GEOPOINT,
  GET_ALL_CATEGORIES,
  GET_GEOPOINT_BY_ADDRESS,
  GET_PRODUCT,
  SET_PRODUCT_PHOTO,
} from 'src/shared/store/actions/product.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';
import { GeolocationService } from 'src/shared/services/geolocation.service';

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

  public userAddress$ = this.store.select('productState').pipe(
    filter((state) => state.userAddress !== null),
    map((state) => state.userAddress)
  );

  public userGeopoint$ = this.store.select('productState').pipe(
    filter((state) => state.userGeopoint !== null),
    map((state) => state.userGeopoint)
  );

  public images$ = this.store.select('productState').pipe(
    filter((state) => state.formImages?.length > 0),
    map((state) => state.formImages)
  );
  public userId: string;
  public capturedPhotos: Blob[];
  public trustedCapturedPhotos: SafeUrl[] = [];
  public platformOptions = Object.values(PlatformEnum);
  public productForm = this.fb.group({
    name: [null, Validators.required],
    state: [null, Validators.required],
    approximatePrice: [null],
    platform: [null, Validators.required],
    category: [null, Validators.required],
    description: [null, Validators.required],
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
    private geolocationService: GeolocationService,
    private router: Router
  ) {
    const { longitude, latitude } = this.geolocationService.currentPosition;

    if (longitude && latitude) {
      this.mainService.dispatch(GET_ADDRESS_BY_GEOPOINT({ payload: { longitude, latitude } }));
    }

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

    this.userAddress$.pipe(takeUntil(this.destroy$)).subscribe((address) => {
      this.productForm.controls.position.setValue(address);
    });

    this.userGeopoint$
      .pipe(
        distinctUntilChanged((x, y) => x.latitude === y.latitude),
        takeUntil(this.destroy$)
      )
      .subscribe(({ longitude, latitude }) => {
        console.log('addwithgeopoint');
        this.addProduct({ longitude, latitude });
      });

    this.userAddress$
      .pipe(
        distinctUntilChanged((x, y) => x === y),
        takeUntil(this.destroy$)
      )
      .subscribe((address) => {
        console.log(address);
        this.productForm.controls.position.setValue(address);
      });
    console.log('test');
  }

  public takePhoto() {
    this.mainService.dispatch(SET_PRODUCT_PHOTO());
  }

  public submitModifyData() {
    if (this.productForm.controls.position.value) {
      this.mainService.dispatch(GET_GEOPOINT_BY_ADDRESS({ payload: this.productForm.controls.position.value }));
    } else {
      this.addProduct();
    }
  }

  private addProduct(position?: { longitude: number; latitude: number }) {
    console.log('add');
    const productData = { ...this.productForm.value };
    productData.position = position ? position : null;

    productData.userId = this.userId;
    this.mainService.dispatch(ADD_PRODUCT({ product: productData, files: this.capturedPhotos }));
  }

  ionViewDidEnter() {
    this.mainService.dispatch(GET_ALL_CATEGORIES());
  }

  ionViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
