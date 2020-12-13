import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { from, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  public currentPosition$ = new Subject<{ longitude: number; latitude: number }>();

  constructor(private geolocation: Geolocation) {
    this.getCurrentPosition();
  }

  private getCurrentPosition() {
    from(this.geolocation.getCurrentPosition())
      .pipe(take(1))
      .subscribe(({ coords: { longitude, latitude } }) => {
        this.currentPosition$.next({ longitude, latitude });
      });
  }
}
