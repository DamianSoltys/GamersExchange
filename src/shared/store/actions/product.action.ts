import { createAction, props } from '@ngrx/store';
import { IProductFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';

export const GET_ALL_USER_PRODUCTS = createAction('[PRODUCT] Get All User Products', props<{ payload: number }>());
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
  props<{ productId: number; userId: number }>()
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
  props<{ userId: number; productId: number }>()
);
export const GET_PRODUCT_PHOTOS_SUCCESS = createAction(
  '[USER] Get Product Photo Success',
  props<{ payload: Blob[] }>()
);
export const GET_PRODUCT_PHOTOS_ERROR = createAction('[USER] Get Product Photo Error', props<{ payload: Error }>());
