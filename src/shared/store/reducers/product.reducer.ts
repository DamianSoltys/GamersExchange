import { createReducer, on } from '@ngrx/store';
import {
  ADD_PRODUCT_ERROR,
  ADD_PRODUCT_SUCCESS,
  DELETE_USER_PRODUCT_SUCCESS,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_ALL_USER_PRODUCTS_SUCCESS,
  GET_PRODUCT_PHOTOS_SUCCESS,
  GET_PRODUCT_SUCCESS,
  SET_PRODUCT_PHOTO_SUCCESS,
} from '../actions/product.action';
import { LOGOUT_USER_SUCCESS } from '../actions/user.action';
import { IProductState } from '../interfaces/store.interface';

export const initialState: IProductState = {
  lastProduct: null,
  products: [],
  categories: [],
  formImages: [],
  searchProducts: [],
};

export const productReducer = createReducer(
  initialState,
  on(GET_PRODUCT_SUCCESS, (state, action) => ({ ...state, lastProduct: action.payload })),
  on(GET_PRODUCT_PHOTOS_SUCCESS, (state, action) => ({
    ...state,
    lastProduct: { ...state.lastProduct, productImages: action.payload },
  })),
  on(GET_ALL_USER_PRODUCTS_SUCCESS, (state, action) => ({ ...state, products: action.payload })),
  on(GET_ALL_PRODUCTS_SUCCESS, (state, action) => ({ ...state, searchProducts: action.payload })),
  on(GET_ALL_CATEGORIES_SUCCESS, (state, action) => ({ ...state, categories: action.payload })),
  on(SET_PRODUCT_PHOTO_SUCCESS, (state, action) => ({
    ...state,
    formImages: [...state.formImages, action.payload],
  })),
  on(DELETE_USER_PRODUCT_SUCCESS, (state, action) => ({
    ...state,
    products: state.products.filter((product) => product.id !== action.payload),
  })),
  on(ADD_PRODUCT_SUCCESS, (state, action) => ({
    ...state,
    products: [...state.products, action.product],
    formImages: [],
  })),
  on(ADD_PRODUCT_ERROR, (state, action) => ({
    ...state,
    formImages: [],
  })),
  on(LOGOUT_USER_SUCCESS, (state, action) => initialState)
);
