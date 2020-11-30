import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { IInitialState } from '../store/interfaces/store.interface';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PhotoSevice {
  public Camera = Plugins.Camera;

  constructor(
    private store: Store<IInitialState>,
    private storage: Storage,
    private router: Router,
  ) { }

  public takePhoto() {
    return from(this.Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    }));
  }

  public getPhotoFromGallery() {

  }
}
