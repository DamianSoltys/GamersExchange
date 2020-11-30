import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { IInitialState } from '../store/interfaces/store.interface';
import { from } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PhotoSevice {
  public Camera = Plugins.Camera;

  constructor(
    private store: Store<IInitialState>,
    private storage: Storage,
    private router: Router,
    private http: HttpClient
  ) {}

  public takePhoto() {
    return this.getPhotoUrl().pipe(
      map((photoUrl) => this.http.get(photoUrl.dataUrl, { responseType: 'blob' })),
      mergeAll()
    );
  }

  public getPhotoUrl() {
    return from(
      this.Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100,
      })
    );
  }

  public getPhotoFromGallery() {}
}
