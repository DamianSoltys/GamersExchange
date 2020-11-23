import { createReducer, on } from '@ngrx/store';
import { IToastInterface } from 'src/shared/interfaces/toast.interface';
import { SHOW_TOAST } from '../actions/toast.action';
import { IToastState } from '../interfaces/store.interface';

export const initialState: IToastState = { toastData: { type: null, message: null } };

export const toastReducer = createReducer(
  initialState,
  on(SHOW_TOAST, (state, action) => ({ ...state, toastData: action.payload }))
);
