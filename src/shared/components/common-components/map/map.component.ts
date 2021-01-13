import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  latLng,
  Map,
  MapOptions,
  tileLayer,
  marker,
  circle,
  icon,
  MarkerOptions,
  DomUtil,
  DomEvent,
  LatLng,
} from 'leaflet';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { IProductFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { GeolocationService } from 'src/shared/services/geolocation.service';
import { MainService } from 'src/shared/services/main.service';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Input('data') data: IProductFirebaseCollection[];
  @Input() options: MapOptions = {
    layers: [tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })],
    zoom: 14,
    center: latLng(51.246452, 22.568445),
  };

  public map: Map;
  public zoom: number;
  public loaded = false;
  public radius: number;
  public biggerRadius: number;
  public actualPosition = this.geolocationService.currentPosition;

  private destroy$ = new Subject();

  constructor(
    private store: Store<IInitialState>,
    private mainService: MainService,
    private router: Router,
    private actions$: Actions,
    private ngZone: NgZone,
    private geolocationService: GeolocationService,
    private modalController: ModalController
  ) {
    const { longitude, latitude } = this.geolocationService.currentPosition;
    console.log(this.actualPosition);
    this.options.center = latLng(longitude, latitude);
  }

  ngOnInit() {
    const { longitude, latitude } = this.geolocationService.currentPosition;

    this.actualPosition = { longitude, latitude };
    this.options.center = latLng(latitude, longitude);
    this.radius =
      this.geolocationService.calculatePointDistance(
        this.actualPosition.latitude,
        this.actualPosition.longitude - 0.48,
        this.actualPosition.latitude,
        this.actualPosition.longitude + 0.48
      ) / 2;
    this.biggerRadius =
      this.geolocationService.calculatePointDistance(
        this.actualPosition.latitude,
        this.actualPosition.longitude - 0.95,
        this.actualPosition.latitude,
        this.actualPosition.longitude + 0.95
      ) / 2;
    this.options.layers.push(circle(this.options.center, { radius: this.radius, opacity: 0.5 }));
    this.options.layers.push(circle(this.options.center, { radius: this.biggerRadius, opacity: 1 }));
    this.loaded = true;
    this.getMarkerData();
  }

  public getMarkerData() {
    this.data.forEach((product) => {
      const { position, name, id } = product;
      const latitude = (position as { longitude; latitude })?.latitude;
      const longitude = (position as { longitude; latitude })?.longitude;

      if (
        this.geolocationService.checkIfPointInsideCircle(
          this.biggerRadius,
          this.actualPosition.latitude,
          this.actualPosition.longitude,
          latitude,
          longitude
        )
      ) {
        let opacity = 1;

        if (
          this.geolocationService.checkIfPointInsideCircle(
            this.biggerRadius,
            this.actualPosition.latitude,
            this.actualPosition.longitude,
            latitude,
            longitude
          ) &&
          !this.geolocationService.checkIfPointInsideCircle(
            this.radius,
            this.actualPosition.latitude,
            this.actualPosition.longitude,
            latitude,
            longitude
          )
        ) {
          opacity = 0.5;
        }

        const markerObject = marker(latLng(latitude, longitude), {
          title: name,
          opacity,
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png',
          }),
        });

        markerObject.bindPopup(`<a>Produkt: ${name}</a>`);
        markerObject.on('dblclick', () => {
          this.ngZone.run(() => {
            this.redirect(id);
          });
        });
        this.options.layers.push(markerObject);

        console.log(markerObject);
      }
    });
  }

  public redirect(id: number) {
    this.router.navigate(['product/details', id]);
    this.closeModal();
  }

  public closeModal() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onMapReady(map: Map) {
    this.map = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }
}
