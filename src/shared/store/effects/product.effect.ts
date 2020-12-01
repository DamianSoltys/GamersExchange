import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap } from 'rxjs/operators';
import { ToastMessageEnum, ToastTypeEnum } from 'src/shared/interfaces/toast.interface';
import { ErrorService } from 'src/shared/services/error.service';
import { FirebaseService } from 'src/shared/services/firebase.service';
import {
  GET_ALL_CATEGORIES,
  GET_ALL_CATEGORIES_ERROR,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_ALL_USER_PRODUCTS,
  GET_ALL_USER_PRODUCTS_ERROR,
  GET_ALL_USER_PRODUCTS_SUCCESS,
  GET_PRODUCT,
  GET_PRODUCT_ERROR,
  GET_PRODUCT_SUCCESS,
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
      switchMap((product) => this.errorService.handleResponse(GET_PRODUCT_SUCCESS({ payload: product }))),
      catchError((error, caught) =>
        this.errorService.handleError(GET_PRODUCT_ERROR(error), caught, true, {
          type: ToastTypeEnum.ERROR,
          message: ToastMessageEnum.GET_DATA_ERROR,
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

  constructor(private fireService: FirebaseService, private actions$: Actions, private errorService: ErrorService) {}
}
