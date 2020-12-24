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
  StatusEnum,
  IExchangeOfferData,
  IUserFirebaseCollection,
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
  ADD_EXCHANGE,
} from 'src/shared/store/actions/product.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';
import { GeolocationService } from 'src/shared/services/geolocation.service';
import { Location } from '@angular/common';
import { IExchangeForm } from 'src/shared/interfaces/exchange.inteface';

@Component({
  selector: 'app-exchange-form',
  templateUrl: './exchange-form.component.html',
  styleUrls: ['./exchange-form.component.css'],
})
export class ExchangeFormComponent {
  public loggedUser: IUserFirebaseCollection;
  public productData: IProductFirebaseCollection;
  public exchangeForm = this.fb.group({
    email: [null, Validators.required],
    phone: [null, Validators.required],
    description: [null],
    productName: [null, Validators.required],
  });

  private loggedUser$ = this.store.select('userState').pipe(
    filter((userState) => userState?.loggedUser !== null),
    map((userState) => userState?.loggedUser)
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
    this.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((loggedUser) => {
      this.loggedUser = loggedUser;
    });

    this.productData = this.location.getState() as IProductFirebaseCollection;

    if (!this.productData?.id) {
      this.location.back();
    }
  }

  public submitModifyData(data: IExchangeForm) {
    const buyerOfferData: IExchangeOfferData = {
      productId: null,
      productName: data.productName,
      status: StatusEnum.PENDING,
      userId: this.loggedUser.id,
      userName: this.loggedUser.userName,
      email: data.email,
      phone: data.phone,
      description: data.description,
    }

    const ownerOfferData: IExchangeOfferData = {
      productId: this.productData.id,
      productName: this.productData.name,
      status: StatusEnum.PENDING,
      userId: this.productData.userId,
      userName: null,
      email: null,
      phone: null,
      description: this.productData.description,
    }

    const exchangeData: IExchangeFirebaseCollection = {
      buyerOfferData,
      ownerOfferData,
      ownerId: this.productData.userId,
      buyerId: this.loggedUser.id,
      status: StatusEnum.PENDING,
      id: null,
    }

    this.mainService.dispatch(ADD_EXCHANGE({ payload: exchangeData }))
  }

  ionViewDidEnter() {
    // test
  }

  ionViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
