import { Injectable, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { IInitialState } from '../store/interfaces/store.interface';
import { from } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  public Camera = Plugins.Camera;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  public formatToSafeURL(file: Blob) {
    const url = URL.createObjectURL(file);
    const trustedUrl = this.sanitizer.bypassSecurityTrustUrl(url);

    return this.sanitizer.sanitize(SecurityContext.URL, trustedUrl);
  }

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
