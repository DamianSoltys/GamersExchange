import { createReducer, on } from '@ngrx/store';
import {
  GET_ALL_CATEGORIES_SUCCESS,
  GET_ALL_USER_PRODUCTS_SUCCESS,
  GET_PRODUCT_SUCCESS,
} from '../actions/product.action';
import { IProductState } from '../interfaces/store.interface';

export const initialState: IProductState = {
  lastProduct: null,
  products: [],
  categories: [],
};

export const productReducer = createReducer(
  initialState,
  on(GET_PRODUCT_SUCCESS, (state, action) => ({ ...state, lastProduct: action.payload })),
  on(GET_ALL_USER_PRODUCTS_SUCCESS, (state, action) => ({ ...state, products: action.payload })),
  on(GET_ALL_CATEGORIES_SUCCESS, (state, action) => ({ ...state, categories: action.payload }))
);
