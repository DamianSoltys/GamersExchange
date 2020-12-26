import { createAction, props } from '@ngrx/store';
import {
  IExchangeFirebaseCollection,
  IProductFirebaseCollection,
} from 'src/shared/firebase/interfaces/firestore.interface';

export const GET_ALL_USER_PRODUCTS = createAction('[PRODUCT] Get All User Products', props<{ payload: string }>());
export const GET_ALL_USER_PRODUCTS_SUCCESS = createAction(
  '[PRODUCT] Get All User Products Success',
  props<{ payload: IProductFirebaseCollection[] }>()
);
export const GET_ALL_USER_PRODUCTS_ERROR = createAction(
  '[PRODUCT] Get All User Products Error',
  props<{ payload: Error }>()
);

export const GET_ALL_PRODUCTS = createAction('[PRODUCT] Get All Products', props<{ payload: string }>());
export const GET_ALL_PRODUCTS_SUCCESS = createAction(
  '[PRODUCT] Get All Products Success',
  props<{ payload: IProductFirebaseCollection[] }>()
);
export const GET_ALL_PRODUCTS_ERROR = createAction('[PRODUCT] Get All Products Error', props<{ payload: Error }>());

export const GET_ADDRESS_BY_GEOPOINT = createAction(
  '[PRODUCT] Get Address By Geopoint',
  props<{ payload: { latitude: number; longitude: number } }>()
);
export const GET_ADDRESS_BY_GEOPOINT_SUCCESS = createAction(
  '[PRODUCT] Get Address By Geopoint Success',
  props<{ payload: string }>()
);
export const GET_ADDRESS_BY_GEOPOINT_ERROR = createAction(
  '[PRODUCT] Get Address By Geopoint Error',
  props<{ payload: Error }>()
);

export const GET_GEOPOINT_BY_ADDRESS = createAction('[PRODUCT] Get Geopoint By Address', props<{ payload: string }>());
export const GET_GEOPOINT_BY_ADDRESS_SUCCESS = createAction(
  '[PRODUCT] Get Geopoint By Address Success',
  props<{ payload: { latitude: number; longitude: number } }>()
);
export const GET_GEOPOINT_BY_ADDRESS_ERROR = createAction(
  '[PRODUCT] Get Geopoint By Address Error',
  props<{ payload: Error }>()
);

export const GET_PRODUCT = createAction('[PRODUCT] Get Product', props<{ payload: number }>());
export const GET_PRODUCT_SUCCESS = createAction(
  '[PRODUCT] Get Product Success',
  props<{ payload: IProductFirebaseCollection }>()
);
export const GET_PRODUCT_ERROR = createAction('[PRODUCT] Get Product Error', props<{ payload: Error }>());

export const ADD_PRODUCT = createAction(
  '[PRODUCT] Add Product',
  props<{ product: IProductFirebaseCollection; files: Blob[] }>()
);
export const ADD_PRODUCT_SUCCESS = createAction(
  '[PRODUCT] Add Product Success',
  props<{ product: IProductFirebaseCollection; files: Blob[] }>()
);
export const ADD_PRODUCT_ERROR = createAction('[PRODUCT] Add Product Error', props<{ payload: Error }>());

export const DELETE_USER_PRODUCT = createAction(
  '[PRODUCT] Delete User Product',
  props<{ productId: number; userId: string }>()
);
export const DELETE_USER_PRODUCT_SUCCESS = createAction(
  '[PRODUCT] Delete User Product Success',
  props<{ payload: number }>()
);
export const DELETE_USER_PRODUCT_ERROR = createAction(
  '[PRODUCT] Delete User Product Error',
  props<{ payload: Error }>()
);

export const GET_ALL_CATEGORIES = createAction('[PRODUCT] Get All Categories');
export const GET_ALL_CATEGORIES_SUCCESS = createAction(
  '[PRODUCT] Get All Categories Success',
  props<{ payload: string[] }>()
);
export const GET_ALL_CATEGORIES_ERROR = createAction('[PRODUCT] Get All Categories Error', props<{ payload: Error }>());

export const SET_PRODUCT_PHOTO = createAction('[USER] Set Product Photo');
export const SET_PRODUCT_PHOTO_SUCCESS = createAction('[USER] Set Product Photo Success', props<{ payload: Blob }>());
export const SET_PRODUCT_PHOTO_ERROR = createAction('[USER] Set Product Photo Error', props<{ payload: Error }>());

export const GET_PRODUCT_PHOTOS = createAction(
  '[USER] Get Product Photo',
  props<{ userId: string; productId: number }>()
);
export const GET_PRODUCT_PHOTOS_SUCCESS = createAction(
  '[USER] Get Product Photo Success',
  props<{ payload: Blob[] }>()
);
export const GET_PRODUCT_PHOTOS_ERROR = createAction('[USER] Get Product Photo Error', props<{ payload: Error }>());

export const GET_ALL_USER_EXCHANGES = createAction('[PRODUCT] Get All User Exchanges', props<{ payload: string }>());
export const GET_ALL_USER_EXCHANGES_SUCCESS = createAction(
  '[PRODUCT] Get All User Exchanges Success',
  props<{ payload: IExchangeFirebaseCollection[] }>()
);
export const GET_ALL_USER_EXCHANGES_ERROR = createAction(
  '[PRODUCT] Get All User Exchanges Error',
  props<{ payload: Error }>()
);

export const ADD_EXCHANGE = createAction('[PRODUCT] Add Exchange', props<{ payload: IExchangeFirebaseCollection }>());
export const ADD_EXCHANGE_SUCCESS = createAction(
  '[PRODUCT] Add Exchange Success',
  props<{ payload: IExchangeFirebaseCollection }>()
);
export const ADD_EXCHANGE_ERROR = createAction('[PRODUCT] Add Exchange Error', props<{ payload: Error }>());

export const DELETE_EXCHANGE = createAction('[PRODUCT] Delete Exchange', props<{ payload: number }>());
export const DELETE_EXCHANGE_SUCCESS = createAction(
  '[PRODUCT] Delete Exchange Success', props<{ payload: number }>()
);
export const DELETE_EXCHANGE_ERROR = createAction('[PRODUCT] Delete Exchange Error', props<{ payload: Error }>());

export const CHANGE_EXCHANGE_STATUS = createAction(
  '[PRODUCT] Change Exchange Status',
  props<{ payload: IExchangeFirebaseCollection }>()
);
export const CHANGE_EXCHANGE_STATUS_SUCCESS = createAction(
  '[PRODUCT] Change Exchange Status Success',
  props<{ payload: IExchangeFirebaseCollection }>()
);
export const CHANGE_EXCHANGE_STATUS_ERROR = createAction(
  '[PRODUCT] Change Exchange Status Error',
  props<{ payload: Error }>()
);

export const GET_EXCHANGE = createAction('[PRODUCT] Get Exchange', props<{ payload: number }>());
export const GET_EXCHANGE_SUCCESS = createAction(
  '[PRODUCT] Get Exchange Success',
  props<{ payload: IExchangeFirebaseCollection }>()
);
export const GET_EXCHANGE_ERROR = createAction('[PRODUCT] Get Exchange Error', props<{ payload: Error }>());
