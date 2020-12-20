import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ToastMessageEnum, ToastTypeEnum } from 'src/shared/interfaces/toast.interface';
import { ErrorService } from 'src/shared/services/error.service';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { GeolocationService } from 'src/shared/services/geolocation.service';
import { PhotoService } from 'src/shared/services/photo.service';
import {
  ADD_EXCHANGE,
  ADD_EXCHANGE_SUCCESS,
  ADD_PRODUCT,
  ADD_EXCHANGE_ERROR,
  ADD_PRODUCT_ERROR,
  ADD_PRODUCT_SUCCESS,
  DELETE_USER_PRODUCT,
  DELETE_USER_PRODUCT_ERROR,
  DELETE_USER_PRODUCT_SUCCESS,
  GET_ADDRESS_BY_GEOPOINT,
  GET_ADDRESS_BY_GEOPOINT_ERROR,
  GET_ADDRESS_BY_GEOPOINT_SUCCESS,
  GET_ALL_CATEGORIES,
  GET_ALL_CATEGORIES_ERROR,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_ALL_PRODUCTS,
  GET_ALL_PRODUCTS_ERROR,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_ALL_USER_PRODUCTS,
  GET_ALL_USER_PRODUCTS_ERROR,
  GET_ALL_USER_PRODUCTS_SUCCESS,
  GET_GEOPOINT_BY_ADDRESS,
  GET_GEOPOINT_BY_ADDRESS_ERROR,
  GET_GEOPOINT_BY_ADDRESS_SUCCESS,
  GET_PRODUCT,
  GET_PRODUCT_ERROR,
  GET_PRODUCT_PHOTOS,
  GET_PRODUCT_PHOTOS_ERROR,
  GET_PRODUCT_PHOTOS_SUCCESS,
  GET_PRODUCT_SUCCESS,
  SET_PRODUCT_PHOTO,
  SET_PRODUCT_PHOTO_ERROR,
  SET_PRODUCT_PHOTO_SUCCESS,
  GET_ALL_USER_EXCHANGES,
  GET_ALL_USER_EXCHANGES_SUCCESS,
  GET_ALL_USER_EXCHANGES_ERROR,
  GET_EXCHANGE,
  GET_EXCHANGE_SUCCESS,
  GET_EXCHANGE_ERROR,
  CHANGE_EXCHANGE_STATUS,
  CHANGE_EXCHANGE_STATUS_SUCCESS,
  CHANGE_EXCHANGE_STATUS_ERROR,
} from '../actions/product.action';

@Injectable()
export class ProductEffects {
  getAllUserProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ALL_USER_PRODUCTS),
      switchMap(({ payload }) => this.fireService.getAllUserProductsById(payload)),
      switchMap((products) => this.errorService.handleResponse(GET_ALL_USER_PRODUCTS_SUCCESS({ payload: products }))),
      catchError((error, caught) =>
        this.errorService.handleError(GET_ALL_USER_PRODUCTS_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      )
    )
  );

  getProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_PRODUCT),
      switchMap(({ payload }) => this.fireService.getProductById(payload)),
      switchMap((product) => {
        console.log(product);
        return this.errorService.handleResponse(GET_PRODUCT_SUCCESS({ payload: product }));
      }),
      catchError((error, caught) =>
        this.errorService.handleError(GET_PRODUCT_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      )
    )
  );

  getSearchProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ALL_PRODUCTS),
      switchMap(({ payload }) => this.fireService.getSearchedProducts(payload)),
      switchMap((products) => this.errorService.handleResponse(GET_ALL_PRODUCTS_SUCCESS({ payload: products }))),
      catchError((error, caught) =>
        this.errorService.handleError(GET_ALL_PRODUCTS_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DELETE_USER_PRODUCT),
      switchMap((payload) =>
        combineLatest([this.fireService.deleteProductById(payload.productId, payload.userId), of(payload)])
      ),
      switchMap(([res, payload]) =>
        combineLatest([this.fireService.removeProductImages(payload.productId, payload.userId), of(payload)])
      ),
      switchMap(([res, payload]) =>
        this.errorService.handleResponse(DELETE_USER_PRODUCT_SUCCESS({ payload: payload.productId }), true, {
          type: ToastTypeEnum.SUCCESS,
          message: ToastMessageEnum.DELETE_PRODUCT_SUCCESS,
        })
      ),
      catchError((error, caught) =>
        this.errorService.handleError(DELETE_USER_PRODUCT_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.DELETE_PRODUCT_ERROR,
        })
      )
    )
  );

  setProductImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_PRODUCT_PHOTO),
      switchMap(() => this.photoService.takePhoto()),
      switchMap((blob) => this.errorService.handleResponse(SET_PRODUCT_PHOTO_SUCCESS({ payload: blob }))),
      catchError((error, caught) =>
        this.errorService.handleError(SET_PRODUCT_PHOTO_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.FILE_ADD_ERROR,
        })
      )
    )
  );

  getProductImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_PRODUCT_PHOTOS),
      switchMap(({ userId, productId }) => this.fireService.getProductImages(productId, userId)),
      switchMap((blobs) => blobs),
      switchMap((blobs) =>
        this.errorService.handleResponse(GET_PRODUCT_PHOTOS_SUCCESS({ payload: blobs[0] === null ? [] : blobs }))
      ),
      catchError((error, caught) =>
        this.errorService.handleError(GET_PRODUCT_PHOTOS_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.DEFAULT_ERROR,
        })
      )
    )
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ADD_PRODUCT),
      switchMap(({ product, files }) =>
        combineLatest([this.fireService.addProduct(product, files), of({ product, files })])
      ),
      switchMap(([res, { product, files }]) => {
        this.navigation.back();
        return this.errorService.handleResponse(ADD_PRODUCT_SUCCESS({ product, files }), true, {
          type: ToastTypeEnum.SUCCESS,
          message: ToastMessageEnum.ADD_PRODUCT_SUCCESS,
        });
      }),
      catchError((error, caught) =>
        this.errorService.handleError(ADD_PRODUCT_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.ADD_PRODUCT_ERROR,
        })
      )
    )
  );

  getCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ALL_CATEGORIES),
      switchMap(() => this.fireService.getAllCategories()),
      switchMap((categories) => this.errorService.handleResponse(GET_ALL_CATEGORIES_SUCCESS({ payload: categories }))),
      catchError((error, caught) =>
        this.errorService.handleError(GET_ALL_CATEGORIES_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      )
    )
  );

  getAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ADDRESS_BY_GEOPOINT),
      switchMap(({ payload: { latitude, longitude } }) => this.geolocationService.getAddress({ latitude, longitude })),
      switchMap(({ data }) =>
        this.errorService.handleResponse(GET_ADDRESS_BY_GEOPOINT_SUCCESS({ payload: data[0].name }))
      ),
      catchError((error, caught) =>
        this.errorService.handleError(GET_ADDRESS_BY_GEOPOINT_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      )
    )
  );

  getGeopoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_GEOPOINT_BY_ADDRESS),
      switchMap(({ payload }) => this.geolocationService.getGeopoint(payload)),
      switchMap(({ data }) =>
        this.errorService.handleResponse(
          GET_GEOPOINT_BY_ADDRESS_SUCCESS({
            payload: { latitude: data[0].latitude, longitude: data[0].longitude },
          })
        )
      ),
      catchError((error, caught) => {
        console.log(error);
        return this.errorService.handleError(GET_GEOPOINT_BY_ADDRESS_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        });
      })
    )
  );

  addExchange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ADD_EXCHANGE),
      switchMap(({ payload }) => combineLatest([this.fireService.addExchange(payload), of(payload)])),
      switchMap(([res, payload]) => {
        this.navigation.back();
        return this.errorService.handleResponse(ADD_EXCHANGE_SUCCESS({ payload }), true, {
          type: ToastTypeEnum.SUCCESS,
          message: ToastMessageEnum.ADD_EXCHANGE_SUCCESS,
        });
      }),
      catchError((error, caught) =>
        this.errorService.handleError(ADD_EXCHANGE_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.ADD_EXCHANGE_ERROR,
        })
      )
    )
  );

  getExchanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ALL_USER_EXCHANGES),
      switchMap(({ payload }) => this.fireService.getAllUserExchangesById(payload)),
      switchMap((payload) => this.errorService.handleResponse(GET_ALL_USER_EXCHANGES_SUCCESS({ payload }))),
      catchError((error, caught) =>
        this.errorService.handleError(GET_ALL_USER_EXCHANGES_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      )
    )
  );

  getExchange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_EXCHANGE),
      switchMap(({ payload }) => this.fireService.getExchangeById(payload)),
      switchMap((payload) => this.errorService.handleResponse(GET_EXCHANGE_SUCCESS({ payload }))),
      catchError((error, caught) =>
        this.errorService.handleError(GET_EXCHANGE_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      )
    )
  );

  updateExchange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CHANGE_EXCHANGE_STATUS),
      switchMap(({ payload }) => combineLatest([this.fireService.modifyExchangeData(payload), of(payload)])),
      switchMap(([res, payload]) => this.errorService.handleResponse(CHANGE_EXCHANGE_STATUS_SUCCESS({ payload }))),
      catchError((error, caught) =>
        this.errorService.handleError(CHANGE_EXCHANGE_STATUS_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
        })
      )
    )
  );

  constructor(
    private fireService: FirebaseService,
    private actions$: Actions,
    private navigation: NavController,
    private geolocationService: GeolocationService,
    private errorService: ErrorService,
    private photoService: PhotoService
  ) {}
}
