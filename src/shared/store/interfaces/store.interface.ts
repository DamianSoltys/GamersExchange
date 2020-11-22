import { UserEffects } from '../effects/user.effect';
import { counterReducer, counterReducerr } from '../reducers/user.reducer';

export const storeEffects = [UserEffects];
export interface IInitialState {
  count: ICountInterface;
  count1: ICountInterface1;
}

export interface ICountInterface {
  count: number;
}

export interface ICountInterface1 {
  count1: number;
}

export const storeConfig = {
  count: counterReducer,
  count1: counterReducerr,
};
