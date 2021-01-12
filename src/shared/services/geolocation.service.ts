import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { from, Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IGeolocationResponse } from '../interfaces/geolocation.interface';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  public currentPosition = { longitude: null, latitude: null };

  constructor(private geolocation: Geolocation, private http: HttpClient) {
    this.getCurrentPosition();
  }

  private getCurrentPosition() {
    from(this.geolocation.getCurrentPosition()).subscribe(({ coords: { longitude, latitude } }) => {
      this.currentPosition = { longitude, latitude };
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

  public isInside(circle_x: number, circle_y: number, rad: number, x: number, y: number) {
    // Compare radius of circle with distance
    // of its center from given point
    return (x - circle_x) * (x - circle_x) + (y - circle_y) * (y - circle_y) <= rad * rad;
  }

  public calculatePointDistance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;

    let a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
  }

  public checkIfPointInsideCircle(circleRad, circleLat, circleLon, pointLat, pointLon) {
    const pointDistance = this.calculatePointDistance(circleLat, circleLon, pointLat, pointLon);

    return pointDistance <= circleRad;
  }
}
