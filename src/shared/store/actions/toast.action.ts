import { createAction, props } from '@ngrx/store';
import { IToastInterface } from 'src/shared/interfaces/toast.interface';

export const SHOW_TOAST = createAction('[TOAST] Show Toast', props<{ payload: IToastInterface }>());
