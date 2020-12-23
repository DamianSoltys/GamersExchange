import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { from, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';
import {
  IExchangeFirebaseCollection,
  IProductFirebaseCollection,
  PlatformEnum,
} from 'src/shared/firebase/interfaces/firestore.interface';
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
import { Location } from '@angular/common';

@Component({
  selector: 'app-exchange-form',
  templateUrl: './exchange-form.component.html',
  styleUrls: ['./exchange-form.component.css'],
})
export class ExchangeFormComponent {
  public userId: number;
  public productData: IProductFirebaseCollection;
  public exchangeForm = this.fb.group({
    email: [null],
    phone: [null],
    description: [null],
    productName: [null],
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
    private location: Location,
    private photoService: PhotoService,
    private geolocationService: GeolocationService,
    private router: Router
  ) {
    this.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.userId = id;
    });

    this.productData = this.location.getState() as IProductFirebaseCollection;
  }

  public submitModifyData(data: IExchangeFirebaseCollection) {
    // test
  }

  ionViewDidEnter() {
    // test
  }

  ionViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
