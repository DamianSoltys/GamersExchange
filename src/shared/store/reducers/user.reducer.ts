import { createReducer, on } from '@ngrx/store';
import {
  REGISTER_USER_SUCCESS,
  GET_ALL_USERS_SUCCESS,
  GET_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  MODIFY_USER_DATA_SUCCESS,
} from '../actions/user.action';
import { IUserState } from '../interfaces/store.interface';

export const initialState: IUserState = {
  lastUserProfile: null,
  loggedUser: null,
  users: [],
};

export const userReducer = createReducer(
  initialState,
  on(REGISTER_USER_SUCCESS, (state, action) => ({ ...state, loggedUser: action.payload })),
  on(LOGIN_USER_SUCCESS, (state, action) => ({ ...state, loggedUser: action.payload })),
  on(GET_ALL_USERS_SUCCESS, (state, action) => ({ ...state, users: action.payload })),
  on(GET_USER_SUCCESS, (state, action) => ({ ...state, lastUserProfile: action.payload })),
  on(MODIFY_USER_DATA_SUCCESS, (state, action) => ({ ...state, loggedUser: action.payload }))
);
