import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { IInitialState } from '../store/interfaces/store.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private store: Store<IInitialState>, private storage: Storage, private router: Router) {}

  public setStorageData(key: string, value: any) {
    return from(this.storage.set(key, value));
  }

  public getStorageData(key: string) {
    return from(this.storage.get(key));
  }

  public removeStorageData(key: string) {
    return from(this.storage.remove(key));
  }
}
