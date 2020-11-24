import { ActionReducerMap } from '@ngrx/store';
import { IUserFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { IToastInterface } from 'src/shared/interfaces/toast.interface';
import { UserEffects } from '../effects/user.effect';
import { toastReducer } from '../reducers/toast.reducer';
import { userReducer } from '../reducers/user.reducer';

export const storeEffects = [UserEffects];
export interface IInitialState {
  userState: IUserState;
  toastState: IToastState;
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

export const storeConfig: ActionReducerMap<IInitialState> = {
  userState: userReducer,
  toastState: toastReducer,
};
