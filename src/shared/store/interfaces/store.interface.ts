import { ActionReducerMap } from '@ngrx/store';
import {
  IProductFirebaseCollection,
  IUserFirebaseCollection,
} from 'src/shared/firebase/interfaces/firestore.interface';
import { IToastInterface } from 'src/shared/interfaces/toast.interface';
import { ProductEffects } from '../effects/product.effect';
import { UserEffects } from '../effects/user.effect';
import { productReducer } from '../reducers/product.reducer';
import { toastReducer } from '../reducers/toast.reducer';
import { userReducer } from '../reducers/user.reducer';

export const storeEffects = [UserEffects, ProductEffects];
export interface IInitialState {
  userState: IUserState;
  toastState: IToastState;
  productState: IProductState;
}

export interface IToastState {
  toastData: IToastInterface;
}

export interface IUserState {
  users: IUserFirebaseCollection[];
  loggedUser: IUserFirebaseCollection;
  lastUserProfile: IUserFirebaseCollection;
  isLoggedIn: boolean;
}

export interface IProductState {
  products: IProductFirebaseCollection[];
  searchProducts: IProductFirebaseCollection[];
  lastProduct: IProductFirebaseCollection;
  categories: string[];
  formImages: Blob[];
}

export const storeConfig: ActionReducerMap<IInitialState> = {
  userState: userReducer,
  toastState: toastReducer,
  productState: productReducer,
};
