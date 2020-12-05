import { createReducer, on } from '@ngrx/store';
import {
  GET_ALL_USERS_SUCCESS,
  GET_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  MODIFY_USER_DATA_SUCCESS,
  LOGIN_USER_ERROR,
  REGISTER_USER_ERROR,
  CHECK_AUTH_SUCCESS,
  CHECK_AUTH_ERROR,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_ERROR,
  GET_USER_LOGO_SUCCESS,
} from '../actions/user.action';
import { IUserState } from '../interfaces/store.interface';

export const initialState: IUserState = {
  lastUserProfile: null,
  loggedUser: null,
  users: [],
  isLoggedIn: null,
};

export const userReducer = createReducer(
  initialState,
  on(LOGOUT_USER_SUCCESS, (state, action) => initialState),
  on(LOGOUT_USER_ERROR, (state, action) => ({ ...state, isLoggedIn: false })),
  on(CHECK_AUTH_SUCCESS, (state, action) => ({
    ...state,
    isLoggedIn: action.isLogged,
    loggedUser: { ...state.loggedUser, ...action.user },
    lastUserProfile: { ...state.lastUserProfile, ...action.user },
  })),
  on(CHECK_AUTH_ERROR, (state, action) => ({ ...state, isLoggedIn: false, loggedUser: null })),
  on(LOGIN_USER_SUCCESS, (state, action) => ({
    ...state,
    loggedUser: { ...state.loggedUser, ...action.payload },
    lastUserProfile: { ...state.lastUserProfile, ...action.payload },
    isLoggedIn: true,
  })),
  on(LOGIN_USER_ERROR, (state, action) => ({ ...state, isLoggedIn: false })),
  on(REGISTER_USER_ERROR, (state, action) => ({ ...state, isLoggedIn: false })),
  on(GET_ALL_USERS_SUCCESS, (state, action) => ({ ...state, users: action.payload })),
  on(GET_USER_SUCCESS, (state, action) => ({ ...state, lastUserProfile: action.payload })),
  on(MODIFY_USER_DATA_SUCCESS, (state, action) => ({
    ...state,
    loggedUser: { ...state.loggedUser, ...action.payload },
    lastUserProfile: { ...state.lastUserProfile, ...action.payload },
  })),
  on(GET_USER_LOGO_SUCCESS, (state, action) => ({
    ...state,
    loggedUser: { ...state.loggedUser, logo: action.payload },
    lastUserProfile: { ...state.lastUserProfile, logo: action.payload },
  }))
);
