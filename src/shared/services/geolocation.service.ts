import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { from, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IGeolocationResponse } from '../interfaces/geolocation.interface';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  public currentPosition$ = new Subject<{ longitude: number; latitude: number }>();

  constructor(private geolocation: Geolocation, private http: HttpClient) {
    this.getCurrentPosition();
  }

  private getCurrentPosition() {
    from(this.geolocation.getCurrentPosition())
      .pipe(take(1))
      .subscribe(({ coords: { longitude, latitude } }) => {
        this.currentPosition$.next({ longitude, latitude });
      });
  }

  public getGeopoint(address: string): Observable<IGeolocationResponse> {
    const params = new HttpParams().set('access_key', environment.positionStackKey).set('query', address);

    return this.http.get<IGeolocationResponse>(`http://api.positionstack.com/v1/forward`, { params });
  }

  public getAddress({ latitude, longitude }): Observable<IGeolocationResponse> {
    const params = new HttpParams()
      .set('access_key', environment.positionStackKey)
      .set('query', `${latitude},${longitude}`);

    return this.http.get<IGeolocationResponse>(`http://api.positionstack.com/v1/reverse`, { params });
  }
}
