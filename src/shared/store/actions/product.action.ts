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

export const GET_PRODUCT = createAction('[PRODUCT] Get Product', props<{ payload: number }>());
export const GET_PRODUCT_SUCCESS = createAction(
  '[PRODUCT] Get Product Success',
  props<{ payload: IProductFirebaseCollection }>()
);
export const GET_PRODUCT_ERROR = createAction('[PRODUCT] Get Product Error', props<{ payload: Error }>());

export const GET_ALL_CATEGORIES = createAction('[PRODUCT] Get All Categories');
export const GET_ALL_CATEGORIES_SUCCESS = createAction(
  '[PRODUCT] Get All Categories Success',
  props<{ payload: string[] }>()
);
export const GET_ALL_CATEGORIES_ERROR = createAction('[PRODUCT] Get All Categories Error', props<{ payload: Error }>());
