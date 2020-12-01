import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { HandleTypeEnum } from '../interfaces/error.interface';
import { IToastInterface, ToastTypeEnum } from '../interfaces/toast.interface';
import { SHOW_TOAST } from '../store/actions/toast.action';
import { IInitialState } from '../store/interfaces/store.interface';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(
    private store: Store<IInitialState>,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.store
      .select('toastState')
      .pipe(
        skip(1),
        map((toastState) => toastState?.toastData)
      )
      .subscribe((toastData) => {
        this.presentToast(toastData.message, 2000, toastData.type === ToastTypeEnum.ERROR ? 'danger' : 'success');
      });
  }

  public async presentToast(message, duration, color) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      cssClass: 'custom-toast-container',
    });

    toast.present();
  }

  public async showLoading() {
    (await this.loadingController.create()).present();
  }

  public async dismissLoading() {
    await this.loadingController.dismiss();
  }

  public handleResponse(action: TypedAction<any>, showToast?: boolean, toastConfig?: IToastInterface) {
    if (showToast) {
      this.store.dispatch(SHOW_TOAST({ payload: toastConfig }));
    }

    this.dismissLoading();
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
    this.dismissLoading();
    return caught;
  }
}
