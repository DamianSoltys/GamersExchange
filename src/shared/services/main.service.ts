import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { from } from 'rxjs';
import { IInitialState } from '../store/interfaces/store.interface';
import { ErrorService } from './error.service';

@Injectable({ providedIn: 'root' })
export class MainService {
  constructor(private store: Store<IInitialState>, private errorService: ErrorService) {}

  public dispatch(action: TypedAction<any>) {
    this.errorService.showLoading();
    this.store.dispatch(action);
  }
}
