import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { HandleTypeEnum } from '../interfaces/error.interface';
import { IToastInterface, ToastTypeEnum } from '../interfaces/toast.interface';
import { SHOW_TOAST } from '../store/actions/toast.action';
import { IInitialState } from '../store/interfaces/store.interface';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private store: Store<IInitialState>) {}

  public handleResponse(action: TypedAction<any>, showToast?: boolean, toastConfig?: IToastInterface) {
    if (showToast) {
      this.store.dispatch(SHOW_TOAST({ payload: toastConfig }));
    }

    return of(action);
  }

  public handleError(
    action: TypedAction<any>,
    caught: Observable<TypedAction<any>>,
    showToast?: boolean,
    toastConfig?: IToastInterface
  ) {
    if (showToast) {
      this.store.dispatch(SHOW_TOAST({ payload: toastConfig }));
    }

    this.store.dispatch(action);

    return caught;
  }
}
