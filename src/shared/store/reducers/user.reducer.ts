import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from '../actions/user.action';
import { ICountInterface, ICountInterface1 } from '../interfaces/store.interface';

export const countState: ICountInterface = { count: 0 };
export const count1State: ICountInterface1 = { count1: 2 };

const _counterReducer = createReducer(
  countState,
  on(increment, (state) => ({ ...state, count: state.count + 1 })),
  on(decrement, (state) => ({ ...state, count: state.count - 1 })),
  on(reset, (state) => ({ ...state, count: 0 }))
);

const _counterReducerr = createReducer(
  count1State,
  on(increment, (state) => ({ ...state, count: state.count1 + 1 })),
  on(decrement, (state) => ({ ...state, count: state.count1 - 1 })),
  on(reset, (state) => ({ ...state, count1: 0 }))
);

export function counterReducerr(state, action) {
  return _counterReducerr(state, action);
}

export function counterReducer(state, action) {
  return _counterReducer(state, action);
}
